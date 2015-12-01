'use strict';
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	rank: {
		type: Number,
		required: true
	},
	capacity: {
		type: Number,
		required: true
	},
	resourceType: {
		type: String,
		required: true,
		enum: ["coal", "oil", "trash", "nuke", "hybrid", "green"]
	},
	numResources: {
		type: Number,
		default: 0
	}
});

schema.set('toObject', { virtuals: true });
schema.set('toJSON', { virtuals: true });

mongoose.model('Plant', schema);