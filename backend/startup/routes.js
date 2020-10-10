const express = require("express");
const topicsRoute = require("../routes/topics-route")
module.exports = function (app) {
    app.use(express.json());
    app.use("/api/topics", topicsRoute);
    
  };