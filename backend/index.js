require("dotenv").config();
const express = require("express");
const app = express();
// Returns a function, (app) is the parameter passed

// use development middlewares (morgan http request logger)
if (process.env.NODE_ENV === "dev") {
  require("./startup/dev")(app);
}
// use production middlewares (helmet etc)
if (process.env.NODE_ENV === "production") {
  require("./startup/prod")(app);
}

require("./startup/auth-session")(app);
require("./startup/routes")(app);
require("./startup/connect-db")();
require("./startup/errors")(app); // error handling middleware must come last

const server = require("./startup/connect-server")(app);

module.exports = server;
