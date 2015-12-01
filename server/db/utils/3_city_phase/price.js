var dij = require('./dijkstra.js');
var isOccupiedBy = require('./isOccupiedBy');

module.exports = function totalCost(game, citiesToAdd) {
	var network = game.cities.filter(function (city) {
			return isOccupiedBy(game.activePlayer, city);
		})
	var connectionCost = dij(citiesToAdd, network, game.cities, game.connections);
	var citiesCost = citiesToAdd.reduce(function(prevCost, currentCity) {
		var cityCost = currentCity.players.length*5 + 10;
		return prevCost + cityCost;
	}, 0);
	return connectionCost + citiesCost;
}