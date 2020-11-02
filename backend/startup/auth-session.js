// Session handling

const express = require("express");

const session = require("express-session");
// const MongoStore = require("connect-mongo")(session);
//const connection = require("../startup/connect-db")()

//const sessionStore = new MongoStore({ mongooseConnection: connection, collection: 'sessions' })
module.exports = function (app) {
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      //store: sessionStore
    })
  );
};
