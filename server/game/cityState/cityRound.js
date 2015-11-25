var State = require('../state');
var totalPrice = require('./price.js');
var isOccupiedBy = require('./isOccupiedBy.js');
var drawPlant = require('../utils/drawPlant.js')
var _ = require('lodash');

var validators = [
	function citiesAreOpen(game, citiesToAdd) {
		return citiesToAdd.every(function (city) {
			return !isOccupiedBy(game.activePlayer, city) && city.players.length < game.phase;
		})
	},
	function canAfford(game, citiesToAdd) {
		return totalPrice(game, citiesToAdd) <= game.activePlayer.money;
	}

];

var CityRound = function(game) {
	this.game = game;
	this.validators = validators;
	this.nextState = 'placeholder for end of turn';
	this.turnIndex = 1;
	State.call(this);
}

CityRound.prototype = Object.create(State.prototype);
CityRound.prototype.constructor = State; // CityRound?

CityRound.prototype.go = function() {
	this.game.activePlayer = this.game.turnOrder.slice(-1)[0];
	return this.game;
}

CityRound.prototype.continue = function(citiesToAdd) {
	// find the correct player to manipulate
	var player = this.game.turnOrder[this.game.turnOrder.length - this.turnIndex];
	player.money -= totalPrice(this.game, citiesToAdd);
	player.numCities += citiesToAdd.length;
	// RULE: discard plants with lower or equal ranks to numCities
	while (player.numCities >= this.game.plantMarket[0].rank) {
		this.game.discardedPlants.push(this.game.plantMarket.shift());
		drawPlant(this.game);
	}
	// add the player to each city's players array
	citiesToAdd.forEach(function (cityToAdd) {
		var city = _.find(this.game, function (c) {
			return c._id.equals(cityToAdd._id);
		});
		city.players.push(player);
	})
	// transition or continue
	this.turnIndex++;
	if (this.turnIndex > this.game.turnOrder.length) {
		// transition to end of turn
	} else {
		this.game.activePlayer = this.game.turnOrder[this.game.turnOrder.length - this.turnIndex];
	}
	return this.game;
}

module.exports = CityRound;
