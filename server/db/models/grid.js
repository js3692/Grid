var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	game: {
		type: Object,
		default: null
	},
	users: {
		type: [mongoose.Schema.Types.ObjectId],
		ref: 'User'
	},
	complete: {
		type: Boolean,
		default: false
	}
})

schema.methods.addUser = function(userId) {
	if(this.game) return;
	var alreadyIn = false;
	if(this.users.length === 6) return;
	this.users.forEach(function(user) {
		if(userId.equals(user._id)) alreadyIn = true;
	})
	if(alreadyIn) return;
	this.users.push(userId);
	return this.users;
}

schema.statics.getJoinable = function() {
	return this.find({})
	.then(function (grids) {
		return grids.filter(function (grid) {
			return !grid.game && !grid.complete;
		})
	})
}

mongoose.model('Grid', schema);