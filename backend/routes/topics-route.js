const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const Topic = require("../models/topics-model")
router.get("/", async(req,res) => {
    const topics = Topic.find()
    res.send(topics) 
})


module.exports = router;
