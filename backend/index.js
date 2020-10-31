require("dotenv").config();
const express = require("express");
const app = express();
// Returns a function, (app) is the parameter passed
// require("./startup/logging")(app);

// use development middlewares (morgan http request logger)
if (process.env.NODE_ENV === "dev") {
  require("./startup/dev")(app);
}
// use production middlewares (helmet etc)
if (process.env.NODE_ENV === "production") {
  require("./startup/prod")(app);
}
require("./startup/routes")(app);
require("./startup/errors")(app);
require("./startup/connect-db")();

const server = require("./startup/connect-server")(app);

module.exports = server;
