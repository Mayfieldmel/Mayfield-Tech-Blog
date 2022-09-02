const routes = require('./controllers');
const path = require('path');

// sequelize database connection
const sequelize = require('./config/connection');

// express.js server
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

// express.js & sequelize session libraries
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
  // session object
const sess = {
  secret: 'Super secret secret',
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

// formatting helpers
const helpers = require('./utils/helpers');

// handlebars.js template engine
const exphbs = require('express-handlebars');
const hbs = exphbs.create({helpers});



// express.js server middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// session middleware
app.use(session(sess));

// handlebars.js middleware
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// turn on routes
app.use(routes);

// turn on connection to db and server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});