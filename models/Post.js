// import the elements that we'll need to build the Post model. This will include the connection to MySQL we stored in the connection.js file as well as Model and Datatypes we'll use from the sequelize package
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

//create our Post model
class Post extends Model {
    static upvote(body, models) { // Model method - built-in static keyword to indicate that the upvote method is one that's based on the Post model and not an instance method like we used earlier with the User model. This exemplifies Sequelize's heavy usage of object-oriented principles and concepts.
    //we can now execute Post.upvote() as if it were one of Sequelize's other built-in methods. With this upvote method, we'll pass in the value of req.body (as body) and an object of the models (as models) as parameters. Because this method will handle the complicated voting query in the /api/posts/upvote route, let's implement that query's code here.
    return models.Vote.create({
        users_id: body.user_d,
        post_id: body.post_id
    }).then(() => {
        return Post.findOne({
            where: {
              id: body.post_id
            },
            attributes: [
              'id',
              'post_url',
              'title',
              'created_at',
              [
                sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'),
                'vote_count'
              ]
            ]
          });
        })
    }
}

//create fields/columns for Post model - In the first parameter for the Post.init function, we define the Post schema
Post.init(
    {
        // We've identified the id column as the primary key and set it to auto-increment.
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        //we define the title column as a String value
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        //we include the post_url field, which is also defined as a String. Sequelize has the ability to offer validation in the schema definition. Here, we ensure that this url is a verified link by setting the isURL property to true.
        post_url: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isURL: true
            }
        },
        // column determines who posted the news article.
        // Using the references property, we establish the relationship between this post and the user by creating a reference to the User model, specifically to the id column that is defined by the key property, which is the primary key. The user_id is conversely defined as the foreign key and will be the matching link.
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'user',
                key: 'id'
            }
        }
    },
    {
        //In the second parameter of the init method, we configure the metadata, including the naming conventions.
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'post'
    }
);

//we can use the Post model, we need to require it in models/index.js and export it 
module.exports = Post;