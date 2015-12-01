'use strict';
var mongoose = require('mongoose');
var _ = require('lodash');

var schema = new mongoose.Schema({
  regionId: {
    type: Number,
    required: true
  },
  color: {
    type: String
  },
  map: {
    type: String,
    enum: ['United States', 'Germany', 'China', 'South Korea'],
    required: true
  },
  adjacent: {
    type: [Number],
    required: true
  }
});

schema.statics.makeRandom = function (map, numPlayers) {
  var regionsPicked = [];
  var idsOfRegionsPicked;

  function getRandomIdx (array) {
    return Math.floor(Math.random()*array.length);
  }

  return this.find({ map: map })
    .then(function (regions) {
      // Randomly pick the first region
      var firstRandomIdx = getRandomIdx(regions);
      regionsPicked.push(regions[firstRandomIdx]);

      // Also randomly pick the second region
      var secondRandomIdx;
      do secondRandomIdx = getRandomIdx(regions);
      while (secondRandomIdx === firstRandomIdx);
      regionsPicked.push(regions[secondRandomIdx]);

      // Pick the third region from the intersection of the
      // adjacent regions of the first two
      var intersection = _.intersection(regions[firstRandomIdx].adjacent, regions[secondRandomIdx].adjacent);
      regions.forEach(function (region) {
        if(region.regionId === intersection[getRandomIdx(intersection)]) regionsPicked.push(region);
      });

      // Turn the array of region documents into array of regionIds
      idsOfRegionsPicked = regionsPicked.map(function (elem) { return elem.regionId; });

      // If there are more than three players, include the fourth
      // region by picking a region from the intersection of the
      // adjacent regions of the first three
      if (numPlayers > 3) {
        var union = _.union(regionsPicked[0].adjacent, regionsPicked[1].adjacent, regionsPicked[2].adjacent);
        var adjacentWithoutSelves = _.difference(union, idsOfRegionsPicked);
        idsOfRegionsPicked.push(adjacentWithoutSelves[getRandomIdx(adjacentWithoutSelves)]);
      }
      
      return this.find({ map: map }, { regionId: { $nin: idsOfRegionsPicked } });
    })
    .then(function (leftOverRegions) {
      if (numPlayers < 5) return idsOfRegionsPicked;
      else {
        idsOfRegionsPicked.push(leftOverRegions[getRandomIdx(leftOverRegions)].regionId);
        return idsOfRegionsPicked;
      }
    });
};

mongoose.model('Region', schema);