const path = require("path");
const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const helpers = require("./utils/helpers");
const app = express();
const PORT = process.env.PORT || 3001;

const sequelize = require("./config/connection");
const hbs = exphbs.create({ helpers });

//turn on routes - Since we set up the routes the way we did, we don't have to worry about importing multiple files for different endpoints. The router instance in routes/index.js collected everything for us and packaged them up for server. js to use.
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

const sess = {
  secret: "Super secret secret",
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

app.use(session(sess));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname))); // The express.static() method is a built-in Express.js middleware function that can take all of the contents of a folder and serve them as static assets. This is useful for front-end specific files like images, style sheets, and JavaScript files.
app.use(require("./controllers/"));

// turn on connection to db and server - importing the connection to Sequelize from config/connection.js. Then, at the bottom of the file, we use the sequelize.sync() method to establish the connection to the database. The "sync" part means that this is Sequelize taking the models and connecting them to associated database tables. If it doesn't find a table, it'll create it for you!
// The other thing to notice is the use of {force: false} in the .sync() method. This doesn't have to be included, but if it were set to true, it would drop and re-create all of the database tables on startup. This is great for when we make changes to the Sequelize models, as the database would need a way to understand that something has changed. We'll have to do that a few times throughout this project, so it's best to keep the {force: false} there for now.
sequelize.sync({ force: false }).then(() => {
  // In the sync method, there is a configuration parameter { force: false }. If we change the value of the force property to true, then the database connection must sync with the model definitions and associations. By forcing the sync method to true, we will make the tables re-create if there are any association changes.  we've updated the relationships between the tables, we need to use sequelize.sync({ force: true }) in server.js to drop the tables and recreate them!
  app.listen(PORT, () => console.log("Now listening"));
});
