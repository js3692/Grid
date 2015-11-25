var State = require('../state');
var payments = require('./payments.js');
var depOnNumP = require('../utils/dependsOnNumPlayers.js');
var endGame = depOnNumP.endGame;
var phase2 = depOnNumP.phase2;
var drawPlant = require('../utils/drawPlant');
var restockRatesMaster = require('../init/restock.js');
var determineTurnOrder = require('../utils/turnOrder.js');
var _ = require('lodash');

var validators = [
	function hasResources(plantsToPower, player) {
		var needs = {}
		plantsToPower.forEach(function (plant) {
			if(plant.resourceType !== 'green') {
				needs[plant.resourceType] = needs[plant.resourceType] + plant.resourceNum || plant.resourceNum;
			}
		})
		for (var resource in needs) {
			if (resource !== 'hybrid') {
				needs[resource] -= player.resources[resource];
			}
		}
		if (needs.hybrid) needs.hybrid -= player.resources['coal'] + player.resources['oil'];
		for (var resource in needs) {
			if (needs[resource] > 0) return false;
		}
		return true;
	}
]

var EndOfTurn = function(game) {
	this.game = game;
	this.validators = validators;
	this.nextState = 'placeholder for plant state';
	this.numResponded = 0;
	State.call(this);
}

EndOfTurn.prototype = Object.create(State.prototype);
EndOfTurn.prototype.constructor = State; // CityRound?

EndOfTurn.prototype.go = function() {
	return this.game;
}

EndOfTurn.prototype.continue = function(plantsToPower, playerColor) {
	var player = _.find(this.game.turnOrder, function (p) {
		return p.color === playerColor;
	});
	var totalCapacity = 0;
	plantsToPower.forEach(function (plant) {
		totalCapacity += plant.capacity;
		if (plant.resourceType === 'hybrid') {
			// transition to hybrid choice state
		} else {
			// move resources from player to bank
			player.resources[plant.resourceType] -= plant.resourceNum;
			this.game.resourceBank[plant.resourceType] += plant.resourceNum;
		}
	})
	player.numPowered = Math.min(player.numCities, totalCapacity);
	player.money += payments[player.numPowered];
	this.numResponded++;

	// Now check if everyone has responded
	if (this.numResponded < this.game.turnOrder.length) return;

	var maxCities = this.game.turnOrder.reduce(function (prev, curr) {
		return Math.max(prev, curr.numCities);
	}, 0);

	// check end game condition
	if (maxCities >= endGame[this.game.turnOrder.length]) {
		// sort the players by win condition
		this.turnOrder.sort(function(player1, player2) {
			if (player1.numPowered > player2.numPowered) return -1;
			else if (player1.numPowered < player2.numPowered) return 1;
			else if (player1.money > player2.money) return -1;
			else return 1;
		})
		// return gameOver(this.turnOrder)
	}

	// start phase 2 if necessary
	if (this.game.phase === 1 && maxCities > phase2[this.game.turnOrder.length]) {
		this.game.phase = 2;
		this.game.discardedPlants.push(this.game.plantMarket.shift());
		drawPlant(this.game);
	}

	// restock resources
	this.game.restockRates = restockRatesMaster[this.turnOrder.length][this.phase];
	for(var resource in this.game.resources) {
		var canFill = Math.min(this.game.restockRates[resource], this.game.resourceBank[resource]);
		this.game.resourceBank -= canFill;
		this.game.resources += canFill;
	}

	if (this.game.phase === 3) {
		this.game.discardedPlants.push(this.game.plantMarket.shift());
	} else {
		this.game.phase3Plants.push(this.game.plantMarket.pop());
	}
	drawPlant(this.game);

	this.game.turnOrder = determineTurnOrder(this.game.turnOrder);
	// transition to plant state
	return this.game;
}

module.exports = EndOfTurn;
