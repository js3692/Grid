function largestPlant(player) {
	var ranks = player.plants.map(function(plant) {
		return plant.rank;
	});
	return Math.max.apply(null, ranks);
}

function turnSort(player1, player2) {
	if (player1.numCities > player2.numCities) return -1;
	else if (player1.numCities < player2.numCities) return 1;
	else if (largestPlant(player1) > largestPlant(player2)) return -1;
	else return 1;
}

module.exports = function determineTurnOrder(players) {
	return players.sort(turnSort);
}