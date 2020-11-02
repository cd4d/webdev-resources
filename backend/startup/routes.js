// routes paths defined here, used by index.js

const express = require("express");

const usersRoute = require("../routes/users-routes");
const topicsRoute = require("../routes/topics-routes");
const linksRoute = require("../routes/links-routes");

module.exports = function (app) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/api/users", usersRoute);
  app.use("/api/topics", topicsRoute);
  app.use("/api/links", linksRoute);
};
