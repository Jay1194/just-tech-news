// All this file is responsible for right now is importing the User model and exporting an object with it as a property - will serve as a means to collect all of the API routes and package them up for us.
const User = require('./User');

module.exports = { User }; 