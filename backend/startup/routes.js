// routes paths defined here, used by index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const usersRoute = require("../routes/users-routes");
const topicsRoute = require("../routes/topics-routes");
const linksRoute = require("../routes/links-routes");
// enable CORS, change in production to real URL
const corsOptions = {
  origin: process.env.LOCAL_FRONTEND_URL,
  optionsSuccessStatus: 200,
};
module.exports = function (app) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors(corsOptions));
  app.use("/api/users", usersRoute);
  app.use("/api/topics", topicsRoute);
  app.use("/api/links", linksRoute);
};
