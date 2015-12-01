var mongoose = require('mongoose');
var Promise = require('bluebird');
var Region = Promise.promisifyAll(mongoose.model('Region'));

var seedRegions = function () {
  var regions = [
    { regionId: 1, color: 'purple', map: 'United States', adjacent: [2, 4, 5]},
    { regionId: 2, color: 'yellow', map: 'United States', adjacent: [1, 3, 5, 6]},
    { regionId: 3, color: 'brown', map: 'United States', adjacent: [2, 6]},
    { regionId: 4, color: 'blue', map: 'United States', adjacent: [1, 5]},
    { regionId: 5, color: 'red', map: 'United States', adjacent: [1, 2, 4, 6]},
    { regionId: 6, color: 'green', map: 'United States', adjacent: [2, 3, 5]}
  ];

  return Promise.each(regions, function (region) { return Region.create(region); });
};

module.exports = seedRegions;