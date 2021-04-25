// routes paths defined here, used by index.js
if (process.env.NODE_ENV !== "production") require("dotenv").config();
const express = require("express");
const cors = require("cors");
const usersRoute = require("../routes/users-routes");
const topicsRoute = require("../routes/topics-routes");
const linksRoute = require("../routes/links-routes");
// enable CORS, change in production to real URL

// authorized list of origins
const whiteList = [
  process.env.LOCAL_BACKEND_URL,
  process.env.LOCAL_FRONTEND_URL,
];
// https://stackoverflow.com/questions/42589882/nodejs-cors-middleware-origin-undefined
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whiteList.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log(origin, "not allowed");
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
  credentials: true,
};

module.exports = function (app) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors(corsOptions));

  app.use("/api/users", usersRoute);
  app.use("/api/topics", topicsRoute);
  app.use("/api/links", linksRoute);
};
