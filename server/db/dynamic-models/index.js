// Require our models -- these should register the model into mongoose
// so the rest of the application can simply call mongoose.model('User')
// anywhere the User model needs to be used.
require('./player');
require('./game');
// require('./state');
require('./grid');

// require('./auction');
// require('./choice');