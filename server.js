const path = require("path");
const express = require("express");
const session = require("express-session");
const exphbs = require("express-handlebars");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

const routes = require("./routes");
const eventRoutes = require('./routes/events');
const sequelize = require("./config/connection");
const helpers = require("./utils/helper");

const app = express();
const PORT = process.env.PORT || 3001;

const sess = {
  secret: "Super secret secret",
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
  },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

app.use(session(sess));

const hbs = exphbs.create({ helpers });

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use(routes);

// Event route
app.get('/events', (req, res) => {
  Event.findAll().then(events => {
    res.render('events', { events, loggedIn: req.session.loggedIn });
  }).catch(err => {
    console.error(err);
    res.status(500).json(err);
  });
});

app.use(eventRoutes)

router.get('/events', async (req, res) => {
  try {
      const eventsData = await Event.findAll();
      const events = eventsData.map(event => event.get({ plain: true }));
      res.render('events', { events, loggedIn: req.session.loggedIn });
  } catch (error) {
      console.error('Error fetching events:', error);
      res.status(500).send('Error fetching events');
  }
});

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () =>
    console.log(`Server is listening on http://localhost:${PORT}`)
  );
});
