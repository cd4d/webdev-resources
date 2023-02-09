if (process.env.NODE_ENV !== "production") require("dotenv").config();

// Session handling
const session = require("express-session");
// const MongoStore = require("connect-mongo")(session);

const MongoStore = require("connect-mongo");

// change to prod db
// const sessionStore = new MongoStore({
//   url: process.env.DB_DEV,
//   collection: "sessions",
// });
let DB_URL;
if (process.env.NODE_ENV !== "production") {
  DB_URL = process.env.DB_DEV;
} else {
  DB_URL = process.env.DB_PROD;
}
const sessionStore = MongoStore.create({
  mongoUrl: encodeURI(DB_URL),
  collection: "sessions",
  client: "client"
});
module.exports = function (app) {
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: sessionStore,
      cookie: { sameSite: "strict" },
    })
  );
};
