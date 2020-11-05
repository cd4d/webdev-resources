const { User } = require("../models/users-model");
const { Topic } = require("../models/topics-model");
const mongoose = require("mongoose");

// is a user is logged in, pass their id in req.body.user
const findUser = (req, res, next) => {
  if (req.session && req.session.passport && req.session.passport.user) {
    console.log("User found", req.session.passport.user);
    req.body.user = req.session.passport.user;
    return next();
  } else {
    req.body.user = null;
    return next();
  }
};

// allows only users with isAdmin: true, rejects the rest and anonymous users
const checkAdmin = async (req, res, next) => {
  try {
    if (req.session && req.session.passport && req.session.passport.user) {
      // find user with isAdmin: true
      const user = await User.findOne({
        _id: req.session.passport.user,
        isAdmin: true,
      });
      if (user) {
        return next();
      } else {
        next({ message: "User not authorized.", statusCode: 401 });
      }
    } else {
      next({ message: "No user found", statusCode: 404 });
    }
  } catch (err) {
    if (!err.statusCode) err.statusCode = 401;
    if (!err.message) err.message = "Not authorized";
    next(err);
  }
};

// not a middleware, function that checks if the topic requested belongs to the right user, or default 'null' user
// requestType can be 'getOneTopic' or 'getAllTopics'. 
const getUserTopic = async (userId, requestType, topicId = "") => {
  try {
    if (requestType === "getOneTopic") {
      const topic = await Topic.findOne({ _id: topicId, user: userId })
      return topic;
    } else if (requestType === "getAllTopics") {
      const topics = await Topic.find({ user: userId });
      return topics;
    }
  } catch (err) {
    if (!err.statusCode) err.statusCode = 401;
    if (!err.message) err.message = "Not authorized";
    return err;
  }
};

module.exports = { findUser, checkAdmin, getUserTopic };
