// Session handling


const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

// change to prod db
const sessionStore = new MongoStore({
  url: process.env.DB_DEV,
  collection: "sessions",
});
module.exports = function (app) {
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: sessionStore,
    })
  );
};
