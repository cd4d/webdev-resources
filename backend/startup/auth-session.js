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
  DB_URL = `mongodb+srv://${process.env.DB_ADMIN}:${encodeURIComponent(process.env.DB_PASSWORD)}@${process.env.DB_PROD}`;
}
const sessionStore = MongoStore.create({
  mongoUrl: process.env.DB_URL_NO_SRV,
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
