'use strict';
var request = require('request');
var mongoose = require('mongoose');
var chalk = require('chalk');
var City = mongoose.model('City');

var schema = new mongoose.Schema({
  cityNames: {
    type: [String],
    required: true
  },
  distance: {
    type: Number
  },
  cities: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City'
  }]
});

schema.set('toObject', { virtuals: true });
schema.set('toJSON', { virtuals: true });

schema.pre('save', function (next) {
  var self = this;
  City.find({ name: { $in: this.cityNames } })
    .then(function (foundCities) {
      self.cities = foundCities.map(function (elem) { return elem._id; });
      next();
    })
    .then(null, next);
});

schema.statics.findByRegions = function (regions) {
  return this.find().populate('cities').lean().exec()
  .then(function (connections) {
    return connections.filter(function (connection) {
      return connection.cities.every(function (city) {
        return regions.indexOf(city.region) > -1;
      })
    })
  })
}

mongoose.model('Connection', schema);