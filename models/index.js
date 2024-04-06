 // All this file is responsible for right now is importing the User model and exporting an object with it as a property - will serve as a means to collect all of the API routes and package them up for us.
const User = require('./User');
//we can use the Post model, we need to require it in models/index.js and export it 
const Post = require('./Post');

//  importing the Vote model
const Vote = require('./Vote');

// import comments model
const Comment = require('./Comment');

// -----------------------------  ONE TO MANY RELATIONSHIPS

//  create our model associations - relationship between the User and the Post model will work. A user can make many posts. But a post only belongs to a single user, and never many users. By this relationship definition, we know we have a one-to-many relationship.
User.hasMany(Post, { // This association creates the reference for the id column in the User model to link to the corresponding foreign key pair, which is the user_id in the Post model.
    foreignKey: 'user_id'
});

//need to make the reverse association (a common relationship) - drop the table and then create it again so the associations would be implemented
Post.belongsTo(User, { // defining the relationship of the Post model to the User. The constraint we impose here is that a post can belong to one user, but not many users. Again, we declare the link to the foreign key, which is designated at user_id in the Post model.
    foreignKey: 'user_id',
});

// If we want to see the total number of votes on a post, we need to directly connect the Post and Vote models.
//  So because the user_id and post_id pairings must be unique, we're protected from the possibility of a single user voting on one post multiple times.
//This layer of protection is called a foreign key constraint.
Vote.belongsTo(User, {
    foreignKey: 'user_id'
  });
  
  Vote.belongsTo(Post, {
    foreignKey: 'post_id'
  });
  
  User.hasMany(Vote, {
    foreignKey: 'user_id'
  });
  
  Post.hasMany(Vote, {
    foreignKey: 'post_id'
  });

// -------------------------------------     MANY TO MANY RELATIONSHIPS

//With these two .belongsToMany() methods in place, we're allowing both the User and Post models to query each other's information in the context of a vote. If we want to see which users voted on a single post, we can now do that. If we want to see which posts a single user
// voted on, we can see that too. This makes the data more robust and gives us more capabilities for visualizing this data on the client-side. - many to many relationship
User.belongsToMany(Post, {
    through: Vote,
    as: 'voted_posts',
    foreignKey: 'user_id' // We state what we want the foreign key to be in Vote
});

//We instruct the application that the User and Post models will be connected through the Vote model
Post.belongsToMany(User, {
    through: Vote,
    as: 'voted_posts', //name of the Vote model should be displayed as voted_posts when queried on, making it a little more informative.
    foreignKey: 'post_id'
});

// --------------------- Comment model example - Note that we don't have to specify Comment as a through table like we did for Vote. This is because we don't need to access Post through Comment; we just want to see the user's comment and which post it was for. Thus, the query will be slightly different.
Comment.belongsTo(User, {
  foreignKey: 'user_id'
});

Comment.belongsTo(Post, {
  foreignKey: 'post_id'
});

User.hasMany(Comment, {
  foreignKey: 'user_id'
});

Post.hasMany(Comment, {
  foriegnKey: 'post_id'
});

module.exports = { User, Post, Vote, Comment }; 