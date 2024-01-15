// All this file is responsible for right now is importing the User model and exporting an object with it as a property - will serve as a means to collect all of the API routes and package them up for us.
const User = require('./User');
//we can use the Post model, we need to require it in models/index.js and export it 
const Post = require('./Post');

//  create our model associations - relationship between the User and the Post model will work. A user can make many posts. But a post only belongs to a single user, and never many users. By this relationship definition, we know we have a one-to-many relationship.
User.hasMany(Post, { // This association creates the reference for the id column in the User model to link to the corresponding foreign key pair, which is the user_id in the Post model.
    foreignKey: 'user_id'
});

//need to make the reverse association (a common relationship) - drop the table and then create it again so the associations would be implemented
Post.belongsTo(User, { // defining the relationship of the Post model to the User. The constraint we impose here is that a post can belong to one user, but not many users. Again, we declare the link to the foreign key, which is designated at user_id in the Post model.
    foreignKey: 'user_id',
});

module.exports = { User, Post }; 