var router = require('express').Router();
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var firebaseHelper = require("../../../firebase");

var fbRef = firebaseHelper.base();

var Grid = mongoose.model('Grid');
var User = mongoose.model('User');

// Current URL: 'api/grid'

router.post('/', function (req, res, next) {
  // req.body has map, max players, and selected regions
	Grid.create(req.body)
    .then(function (grid) {
      return grid.addPlayer(req.user);
    })
    .then(function (grid) {
      return Grid.populate(grid, "users");
    })
    .then(function(grid) {
      // grid.key is the id of the array element in firebase.
      grid.key = fbRef.push(grid.toObject()).key();
      res.status(201).json(grid);
      return grid.save();
    })
    .catch(next);
});

router.param('gridId', function(req, res, next, gridId){
  Grid.findById(gridId)
    .populate('users')
    .then(function(grid){
        req.grid = grid;
        next();
    })
    .catch(next);
});

router.use('/before/:gridId', require('./before'));

router.use('/after/:gridId', require('./after'));

module.exports = router;