const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const { Topic } = require("../models/topics-model");
const { buildAncestors } = require("../utils/tree-structure");
const checkAllowedUpdates = require("../middlewares/allowed-updates");

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
    const topic = await Topic.findById(req.params.id).exec();
    res.send(topic);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/", async (req, res) => {
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
  async (req, res) => {
    try {
      let newTopic = await Topic.findOneAndUpdate(
        { _id: req.params.id },
        { $set: req.body }
      );
      if (!newTopic) return res.status(404).send();
      res.send(newTopic);
    } catch (err) {
      res.status(400).send(err);
    }
  }
);

router.delete("/:id", async (req, res ) => {
  try {
    let deletedTopic = await Topic.findByIdAndDelete(req.params.id).exec()
    res.send(deletedTopic)
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
