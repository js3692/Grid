'use strict';
var request = require('request');
var mongoose = require('mongoose');
var chalk = require('chalk');
var re = /[+]+/;

var schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  countryCode: {
    type: String,
    required: true
  },
  location: {
    type: [Number]
  },
  players: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  region: {
    type: Number,
    required: true,
    enum: [0,1,2,3,4,5]
  }
});

schema.set('toObject', { virtuals: true });
schema.set('toJSON', { virtuals: true });

schema.pre('save', function (next) {
  var self = this;
  request('https://maps.googleapis.com/maps/api/geocode/json?address=' + this.name + '&region=' + this.countryCode + '&key=AIzaSyDY1FnH6Ji9xdyIBTPnApj07nvn-yHyf5o', function (err, res, body) {
    if (!err && res.statusCode == 200) {
      if(re.test(self.name)) self.name = self.name.slice(0, self.name.indexOf('+'));
      console.log(chalk.cyan('City saved as:', JSON.parse(body).results[0].formatted_address));
      self.location = [
        JSON.parse(body).results[0].geometry.location.lat,
        JSON.parse(body).results[0].geometry.location.lng
      ];
      next();
    } else next(err);
  });
});

schema.statics.findByRegions = function (regions) {
  return this.find({region: {$in: regions}}).lean().exec();
}

mongoose.model('City', schema);