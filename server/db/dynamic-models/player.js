'use strict';
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var schema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  plants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plant'
  }],
  cities: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City'
  }],
  money: {
    type: Number,
    default: 50
  },
  color: {
    type: String,
    enum: ['purple', 'yellow', 'green', 'blue', 'red', 'black']
  },
  resources: {
    type: Object,
    default: { coal: 0, oil: 0, trash: 0, nuke: 0 }
  },
  clockwise: {
    type: Number
  },
  numPowered: {
    type: Number
  }
});

mongoose.model('Player', schema);
