var router = require('express').Router();
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var firebaseHelper = require("../../../../firebase");

var fbRef = firebaseHelper.base();

var Grid = mongoose.model('Grid');
var User = mongoose.model('User');

// Current URL: 'api/grid/before/:gridId'

router.get('/', function (req, res, next) {
    if(req.grid) res.status(200).json(req.grid);
});

router.post('/join', function (req, res, next) {
    req.grid.addUser(req.user)
        .then(function (grid) {
            res.json(grid);
        }).catch(next);
});

router.post('/leave', function (req, res, next) {
    req.grid.removeUser(req.user)
        .then(function (grid) {
            res.json(grid);
        })
        .catch(next);
});

router.put('/start', function(req, res, next) {
     
     require('../../../../game/init')(req.body)
        .then(function (newGame) {
            // req.grid.state = new PlantState(newGame);
            req.grid.game = req.grid.state.go();
            return req.grid.save();
        })
        .then(function(grid){
            res.status(200).end();
        })
        .catch(next);
});
 
 router.put('/changeColor', function(req, res, next){
     User.findById(req.body.userId)
        .then(function(user){
            user.color = req.body.color;
            return user.save();
        })
        .then(function(){
            return Grid.populate(req.grid, 'users');
        })
        .then(function(updatedGrid){
            updatedGrid.save();
            res.status(200).end();
        })
        .catch(next);
});

module.exports = router;