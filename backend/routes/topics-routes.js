const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const { Topic } = require("../models/topics-model");
const { buildAncestors } = require("../utils/tree-structure");
const slugify = require("../utils/slugify");
const checkAllowedUpdates = require("../middlewares/allowed-updates");
const {
  topicPostValidationRules,
  topicPatchValidationRules,
  validate,
} = require("../middlewares/express-validator-middleware");
const checkUser = require("../middlewares/check-user");

router.get("/", async (req, res, next) => {
  try {
    const topics = await Topic.find().exec();
    topics ? res.send(topics) : res.status(404).send("No topics found.");
  } catch (err) {
    //res.status(500).send(err);
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
});

router.get("/:id", checkUser, async (req, res, next) => {
  console.log(req.session);
  try {
    req.body.currentUser &&
    req.session.passport &&
    req.body.currentUser === req.session.passport.user
      ? console.log("A user is logged in:", req.session.passport.user)
      : console.log("No user logged in");
    console.log(req.body);
    const topic = await Topic.findById(req.params.id);
    res.send(topic);
  } catch (err) {
    // res.status(500).send(err);
    if (!err.statusCode) err.statusCode = 404;
    next(err);
  }
});

router.post(
  "/",
  topicPostValidationRules(),
  validate,
  async (req, res, next) => {
    const { title, links, description, parent } = req.body;
    const topic = new Topic({
      title: title,
      links: links,
      description: description,
      parent: parent,
    });
    try {
      let newTopic = await topic.save();
      if (parent) await buildAncestors(newTopic._id, parent);
      res.status(201).send(newTopic);
    } catch (err) {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    }
  }
);

router.patch(
  "/:id",
  checkAllowedUpdates(["title", "links", "description"]),
  topicPatchValidationRules(),
  validate,
  async (req, res, next) => {
    try {
      // grab the list of updated fields
      const updates = Object.keys(req.body);
      const topic = await Topic.findById(req.params.id);
      if (!topic) {
        const error = new Error("Topic not found");
        error.statusCode = 404;
        next(error);
      } //return res.status(404).send();

      // replace all the fields
      updates.forEach((update) => {
        topic[update] = req.body[update];
      });

      // update the title in child elements
      if (updates.includes("title")) {
        try {
          await Topic.updateMany(
            { "ancestors._id": mongoose.Types.ObjectId(topic._id) },
            {
              $set: {
                "ancestors.$.title": topic.title,
                "ancestors.$.slug": slugify(topic.title),
              },
            }
          );
        } catch (err) {
          if (!err.statusCode) err.statusCode = 400;
          next(err);
        }
      }
      await topic.save();
      res.send(topic);
    } catch (err) {
      if (!err.statusCode) err.statusCode = 400;
      next(err);
    }
  }
);

router.delete("/:id", async (req, res, next) => {
  try {
    let deletedTopic = await Topic.findByIdAndDelete(req.params.id);
    // delete the topic from children elements
    try {
      await Topic.updateMany(
        { "ancestors._id": mongoose.Types.ObjectId(deletedTopic._id) },
        {
          $pull: { ancestors: { _id: deletedTopic._id } },
        }
      );
    } catch (err) {
      if (!err.statusCode) err.statusCode = 400;
      next(err);
    }
    res.send(deletedTopic);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
});

module.exports = router;
