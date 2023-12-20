// imported the Model class and DataTypes object from Sequelize
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');

// create our User Model - Model class is what we create our own models from using the extends keyword so User inherits all of the functionality the Model class has
class User extends Model {}

// define table columns and configuration -  
User.init(
    {
        // TABLE columns DEFINITIONS GO HERE

          // define an id column
          id: {
             // use the special Sequalize DataTypes object provide what type of data it is
             type: DataTypes.INTEGER,
             // this is the equivalent of SQL's `NOT NULL` option
             allowNull: false,
             // instruct that this is the the Primary Key
             primaryKey: true,
             // turn on auto increment
             autoIncrement: true
        },

          // define a username column
          username: {
            type: DataTypes.STRING,
            allowNull: false
        },

          // define an email column
          email: {
            type: DataTypes.STRING,
            allowNull: false,
            // there cannot be duplicated email values in this table
            unique: true,
            // if allowNull is set to false, we can run our data through validators before creating the table data
            validate: {
                isEmail: true
            }  
        }, 
            
          // define a password column
          password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                // this means the pasword must be at least four characters long
                len: [4]
            }
        }
    },
    {
      // We'll be working in the User.js file, so we can modify the User model and add the appropriate hooks at opportune moments to hash the password.
      hooks: {
        // set up beforeCreate lifecycle "hook" functionality - The async keyword is used as a prefix to the function that contains the asynchronous function. - hash user new account passwords
          async beforeCreate(newUserData) {
            // await can be used to prefix the async function, which will then gracefully assign the value from the response to the newUserData's password property. The newUserData is then returned to the application with the hashed password.
            newUserData.password = await bcrypt.hash(newUserData.password, 10);
            return newUserData;
          },
          // set up beforeupdate lifecycle "hook" functionality - hash updated user passwords
          async beforeUpdate(updatedUserData) {
            updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
            return updatedUserData;
          }
      },
        // TABLE CONFIGURATION OPTIONS GO HERE ((https://sequelize.org/v5/manual/models-definition.html#configuration)) - use the .init() method to initialize the model's data and configuration, passing in two objects as arguments. The first object will define the columns and data types for those columns. The second object it accepts configures certain options for the table.

        // pass in our imported sequelize connection (the direct connection to our database)
        sequelize,

        // don't automatically create createdAt/updatedAt timestamp fields
        timestamps: false,

        // dont pluralize name of database table
        freezeTableName: true,

        // use underscores instead of camel-casing (i.e `comment_text` and not `commentText`)
        underscored: true,

        // make it so our model name stays lowercase in the database
        modalName: "user"
    }
);

module.exports = User;