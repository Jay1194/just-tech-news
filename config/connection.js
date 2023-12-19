// import the sequelize constructor from the library
const Sequelize = require('sequelize');

// don't have to save the require('dotenv') to a variable? All we need it to do here is execute when we use connection.js and all of the data in the .env file will be made available at process.env.<ENVIRONMENT-VARIABLE-NAME>.
require('dotenv').config();

// create connection to our database, pass in your MYSQL information for username and password - new Sequelize() function accepts the database name, MySQL username, and MySQL password (respectively) as parameters,
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306  
});

// export the connection
module.exports = sequelize;
