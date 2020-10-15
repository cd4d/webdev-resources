const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const {Topic} = require("../models/topics-model");

router.get("/", async (req, res) => {
  try {
    const topics = await Topic.find()
      // .select({
      //   _id: true,
      //   title: true,
      //   slug:true
      //   "ancestors.slug": true,
      //   "ancestors.name": true,
      // })
      .exec();
    res.send(topics);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/", async (req, res) => {
  const {title,links,description} = req.body
  const topic = new Topic({ title: title, links: links, description: description });
  try {
    let newTopic = await topic.save();
    res.status(201).send(newTopic);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
