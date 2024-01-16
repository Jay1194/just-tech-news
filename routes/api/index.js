// will serve as a means to collect all of the API routes and package them up for us.
const router = require('express').Router();

//  assign the UserRoutes to the Express.js router
const userRoutes = require('./user-routes');

// assign the postRoutes to the Express.js router
const postRoutes = require('./post-routes')

// assign the postRoutes to the Express.js router
const commentRoutes = require('./comment-routes');

//  in this file we take those routes and implement them to another router instance, prefixing them with the path /users at that time.
router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/comments', commentRoutes);

module.exports = router;