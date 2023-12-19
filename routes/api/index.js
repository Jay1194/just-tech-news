// will serve as a means to collect all of the API routes and package them up for us.
const router = require('express').Router();
const userRoutes = require('./user-routes.js');

//  in this file we take those routes and implement them to another router instance, prefixing them with the path /users at that time.
router.use('/users', userRoutes);
module.exports = router;