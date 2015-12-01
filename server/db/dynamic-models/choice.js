var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	player: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Player',
		required: true
	},
	hybridPlants: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Plant'
	}],
	choiceType: {
		type: String,
		enum: ['ditchPlant', 'ditchResources', 'spendResources'],
		required: true
	},
	parentState: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'State',
		required: true
	},
	choices: {
		type: Array
	}
});

schema.methods.go = function() {
	if (this.choiceType === 'ditchPlant') {
		this.choices = this.player.plants;
	} else if (this.choiceType === 'spendResources') {
		var totalResourcesNeeded = this.hybridPlants.reduce(function(prev, currPlant) {
			return prev + currPlant.resourceNum;
		}, 0);
		var choices = [];
		for(var i = 0; i <= totalResourcesNeeded; i++) {
			choices.push({coal: i, oil: totalResourcesNeeded - i});
		}
		var numCoal = this.player.resources.coal, numOil = this.player.resources.oil;
		this.choices = choices.filter(function (choice) {
			return choice.coal <= numCoal && choice.oil <= numOil
		});
	} else if (this.choiceType === 'ditchResources') {
		
	}
	return this;
}

schema.methods.continue = function(choice) {
	if (this.choiceType === 'ditchPlant') {
		player.plants = player.plants.filter(function(plant) {
			plant.rank !== choice.rank;
		})
	} else {
		for(var resource in choice) {
			player.resources[resource] -= choice[resource];
		}
	}
	// transition back to parent state
}

mongoose.model('Choice', schema);