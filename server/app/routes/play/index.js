var router = require('express').Router();
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var firebaseHelper = require("../../../firebase");

var fbRef = firebaseHelper.base();

var Grid = mongoose.model('Grid');
var User = mongoose.model('User');

// Current URL: 'api/play'

router.use('/plantState', require('./plantState'));
router.use('/resourceState', require('./resourceState'));
router.use('/cityState', require('./cityState'));
router.use('/endOfTurn', require('./endOfTurn'));

module.exports = router;