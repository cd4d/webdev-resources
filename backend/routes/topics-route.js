const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const Topic = require("../models/topics-model");
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
      console.log("get request");
    res.send(topics);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/", async (req, res) => {
  const topic = new Topic({ title: req.body.title });
  try {
    let newTopic = await topic.save();
    res.status(201).send(newTopic);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
