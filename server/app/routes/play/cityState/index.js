var router = require('express').Router();
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var firebaseHelper = require("../../../../firebase");

var fbRef = firebaseHelper.base();

var Grid = mongoose.model('Grid');
var User = mongoose.model('User');

// Current URL: 'api/play/cityState'

module.exports = router;