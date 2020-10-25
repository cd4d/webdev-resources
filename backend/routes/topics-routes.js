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

router.get("/", async (req, res) => {
  try {
    const topics = await Topic.find().exec();
    res.send(topics);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);
    res.send(topic);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/", topicPostValidationRules(), validate, async (req, res) => {
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
    res.status(500).send(err);
  }
});

router.patch(
  "/:id",
  checkAllowedUpdates(["title", "links", "description"]),
  topicPatchValidationRules(),
  validate,
  async (req, res) => {
    try {
      // grab the list of updated fields
      const updates = Object.keys(req.body);
      const topic = await Topic.findById(req.params.id);
      if (!topic) return res.status(404).send();

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
          res.status(400).send(err);
        }
      }
      await topic.save();
      res.send(topic);
    } catch (err) {
      res.status(400).send(err);
    }
  }
);

router.delete("/:id", async (req, res) => {
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
      res.status(400).send(err);
    }
    res.send(deletedTopic);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
