// routes paths defined here, used by index.js

const express = require("express");
const topicsRoute = require("../routes/topics-routes");
const linksRoute = require("../routes/links-routes");
module.exports = function (app) {
  app.use(express.json());
  app.use("/api/topics", topicsRoute);
  app.use("/api/links", linksRoute);
};
