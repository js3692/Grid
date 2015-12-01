var mongoose = require('mongoose');
var Promise = require('bluebird');
var chalk = require('chalk');
var connectToDb = require('../server/db');

var seedUsers = require('./user');
var seedPlants = require('./plant');
var seedCities = require('./city');
var seedConnections = require('./connection');
var seedRegions = require('./region');

connectToDb.then(function (db) {
    return db.db.dropDatabase();
})
.then(function () {
  console.log(chalk.magenta('Database dropped'));
  return seedUsers();
})
.then (function () {
  console.log(chalk.grey('Users created'));
  return seedPlants();
})
.then (function () {
  console.log(chalk.grey('Plants created'));
  return seedRegions();
})
.then (function () {
  console.log(chalk.grey('Regions created'));
  return seedCities();
})
.then (function () {
  console.log(chalk.grey('Cities created'));
  return seedConnections();
})
.then(function () {
  console.log(chalk.grey('Connections created'));
  console.log(chalk.blue('Seed successful!'));
  process.kill(0);
}).catch(function (err) {
  console.error(err);
  process.kill(1);
});