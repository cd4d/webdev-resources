const express = require("express")
const app = express();

// Returns a function, (app) is the parameter passed
require("./startup/routes")(app)
require("./startup/connect-db")()
// uncomment in prod
// require("./startup/prod")(app)


const server = require('./startup/connect-server')(app)

module.exports = server