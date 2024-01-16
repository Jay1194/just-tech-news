let sequelize;

if (process.env.JAWSDB_URL) {
  sequelize = new sequelize(process.env.JAWSDB_URL);

} else {
sequelize = new sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, { //When the app is deployed, it will have access to Heroku's process.env.JAWSDB_URL variable and use that value to connect. Otherwise, it will continue using the localhost configuration.
  host: 'localhost',
  dialect: 'mysql',
  port: 3306
});
}