if (process.env.NODE_ENV !== "production") require("dotenv").config();
const express = require("express");
const app = express();
// Returns a function, (app) is the parameter passed

// use development middlewares (morgan http request logger)
if (process.env.NODE_ENV === "dev") {
  require("./startup/dev")(app);
}
// use production middlewares (helmet etc)
if (process.env.NODE_ENV === "prod") {
  require("./startup/prod")(app);
}
require("./startup/connect-db")();
require("./startup/auth-session")(app);
require("./startup/routes")(app);

require("./startup/errors")(app); // error handling middleware must come last

// Path to frontend for production
// https://stackoverflow.com/questions/36504768/deploy-the-backend-and-frontend-on-the-same-heroku-app-dyno
const path = require("path");
// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, "frontend/build")));
// Anything that doesn't match the above, send back index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/frontend/build/index.html"));
});

const server = require("./startup/connect-server")(app);

module.exports = server;
