var shuffle = require('../common/shuffle');

module.exports = function drawPlant(game) {
	if (game.plantDeck.length) {
		game.plantMarket.push(this.game.plantDeck.shift());
	} else {
		initStepThree(game);
	}
	game.plantMarket.sort(function (plant1, plant2) {
		return plant1.rank < plant2.rank ? -1 : 1;
	});
};

function initStepThree(game) {
	if(game.phase === 3) return;
	if (game.currentState instanceof PlantState) {
		// stuff shouldn't actually happen here until the end of the state
		game.phase = 2.5;
	} else {
		game.discardedPlants.push(game.plantMarket.shift());
		game.phase = 3;
	}
	game.plantDeck = shuffle(game.phase3Plants);
}