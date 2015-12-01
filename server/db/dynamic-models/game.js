'use strict';
var _ = require('lodash');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var Region = mongoose.model('Region');
var Plant = mongoose.model('Plant');
var City = mongoose.model('City');
var Connection = mongoose.model('Connection');

var masterRestockRates = require('../utils/0_basic_rules/restock');

var shuffle = require('../utils/common/shuffle');
var countryCode = require('../utils/common/countryCodes');

var schema = new mongoose.Schema({
  cities: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City'
  }],
  connections: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Connection'
  }],
  turnOrder: {
    type: [Number]
  },
  turn: {
    type: Number,
    default: 1
  },
  step: {
    type: Number,
    enum: [1, 2, 3],
    default: 1
  },
  resourceMarket: {
    type: Object,
    default: { coal: 24, oil: 15, trash: 6, nuke: 2 }
  },
  resouceBank: {
    type: Object,
    default: { coal: 0, oil: 9, trash: 18, nuke: 10 }
  },
  restockRates: {
    type: Object
  },
  plantMarket: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plant'
  }],
  plantDeck: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plant'
  }],
  discardedPlants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plant'
  }],
  stepThreePlants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plant'
  }]
});

schema.methods.init = function (map, players, selectedRegions) {
  function grabObjectId (documents) {
    return documents.map(function (doc) {
      return doc._id;
    });
  }

  function removePlants(shuffledPlants, numPlayers) {
    if(numPlayers < 5) {
      shuffledPlants.splice(0,4);
    }
    if(numPlayers < 4) {
      shuffledPlants.splice(0,4);
    }
    return shuffledPlants;
  }

  return City.find({ countryCode: countryCode[map] }, { region: { $in: selectedRegions } })
    .then(function (citiesInPlay) {
      citiesInPlay = grabObjectId(citiesInPlay);
      this.cities = citiesInPlay;
      return Connection.find({ 'cities.0': { $in: citiesInPlay } }, { 'cities.1': { $in: citiesInPlay } });
    })
    .then(function (connectionsInPlay) {
      this.connections = grabObjectId(connectionsInPlay);
      this.turnOrder = shuffle(players);
      this.restockRates = masterRestockRates[players.length][this.step];
      return Plant.find().sort({ rank: 'asc' });
    })
    .then(function (plants) {
      var allPlants = grabObjectId(plants);

      this.plantMarket = allPlants.splice(0, 8);

      var thirteen = allPlants.splice(2, 1);
      var remainingPlants = removePlants(shuffle(allPlants), players.length);
      this.plantDeck = thirteen.concat(remainingPlants);

      return this.save();
    });

};

mongoose.model('Game', schema);