var mongoose = require('mongoose');
var firebaseHelper = require('../../firebase');
var _ = require('lodash');
mongoose.Promise = require('bluebird');

var schema = new mongoose.Schema({
	game: {
		type: Object,
		default: null
	},
	users: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}],
	complete: {
		type: Boolean,
		default: false
	},
    key: {
        type: String
    },
    history: {
        type: []
    },
    availableColors: {
    	type: [String],
    	default: ['red', 'green', 'yellow', 'purple', 'black', 'blue']
    }
});

schema.set('toObject', { virtuals: true });
schema.set('toJSON', { virtuals: true });

schema.methods.addUser = function (newUser) {

    if (this.game) throw new Error('The Game already exists');

    // >= just  to be safe
    if (this.users.length === 6) throw new Error('The Game is already full');

    if (this.users.some(user => user._id.equals(newUser._id))) return Promise.resolve(this);

	this.users.push(newUser);
	return this.save();
};

schema.methods.removeUser = function (userId) {
	var userIndex = this.users.indexOf(userId);
	this.users.splice(userIndex,1);
	return this.save();
}

schema.statics.getJoinable = function() {
	return this.find({})
        .populate('users')
		.then(function (grids) {
			return grids.filter(function (grid) {
				return !grid.game && !grid.complete;
			});
		});
};

schema.pre('save', function (next) {

    /*
        Pushes grid (minus grid history) into grid.
    */

    var gridSnapshot = _.omit(this.toObject(), 'history');
    if(this.game) this.history.push(gridSnapshot);

    /*
        finds connection within connections hash
        then updates firebase game object.
    */

    firebaseHelper
        .getConnection(this.key)
        .set(gridSnapshot);

	next();
});

mongoose.model('Grid', schema);
