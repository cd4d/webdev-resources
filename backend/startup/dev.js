// packages needed for development environment
const morgan = require("morgan");
const logger = require("./logging");
// stream morgan log to be handled by winston. See startup/logging.js
module.exports = function (app) {
  console.log("Dev environment");
  app.use(morgan("combined", { stream: logger.stream }));
};
