const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const { Topic } = require("../models/topics-model");
const { Link } = require("../models/links-model");
const {
  linkPatchValidationRules,
  linkPostValidationRules,
  validate,
} = require("../middlewares/express-validator-middleware");
const checkAllowedUpdates = require("../middlewares/allowed-updates");

router.get("/", async (req, res, next) => {
  try {
    const allLinks = await Topic.find({ links: { $exists: true, $ne: [] } });
    // check if result is empty
    if (Array.isArray(allLinks) && allLinks.length) {
      res.send(allLinks);
    } else {
      const error = new Error("No links found");
      error.statusCode = 404;
      next(error);
    }
  } catch (err) {
    if (!err.statusCode) err.statusCode = 400;
    next(err);
  }
});
router.get("/topic/:topicId", async (req, res, next) => {
  try {
    // find the topic then send only the links
    const topic = await Topic.findById(req.params.topicId);
    if (topic && topic.links) {
      res.send(topic.links);
    } else {
      const error = new Error("Topic not found");
      error.statusCode = 404;
      next(error);
    }
  } catch (err) {
    if (!err.statusCode) err.statusCode = 400;
    next(err);
  }
});

router.get("/link/:linkId", async (req, res, next) => {
  try {
    const topic = await Topic.find({ "links._id": req.params.linkId });
    // result is an array, check if array is not empty and contains links
    if (Array.isArray(topic) && topic.length && topic[0].links) {
      const link = topic[0].links.find(
        (el) => el._id.toString() === req.params.linkId
      );
      res.send(link);
    } else {
      const error = new Error("Link not found");
      error.statusCode = 404;
      next(error);
    }
  } catch (err) {
    if (!err.statusCode) err.statusCode = 400;
    next(err);
  }
});

router.post(
  "/",
  linkPostValidationRules(),
  validate,
  async (req, res, next) => {
    if (req.body.topic) {
      const topic = req.body.topic;
      try {
        await Topic.findOneAndUpdate(
          { _id: topic },
          { $addToSet: { links: req.body } },
          { new: true },
          function (err, doc) {
            if (err) {
              const error = new Error("Topic not found");
              error.statusCode = 404;
              next(error);
            }
            doc ? res.send(doc) : next(err);
          }
        );
      } catch (err) {
        //res.status(400).send(err);
        if (!err.statusCode) err.statusCode = 400;
        next(err);
      }
    }
  }
);

router.patch(
  "/:linkId",
  checkAllowedUpdates(["topic", "url", "description"]),
  linkPatchValidationRules(),
  validate,
  async (req, res, next) => {
    // append 'links.$.' in front of updated data i.e links.$.title : req.body.title
    let updatedData = {};
    for (let [key, value] of Object.entries(req.body)) {
      updatedData["links.$." + key] = value;
    } // adding the _id field
    updatedData["links.$._id"] = req.params.linkId;
    try {
      await Topic.findOneAndUpdate(
        { "links._id": req.params.linkId },
        updatedData,
        { new: true },
        function (err, doc) {
          if (err) {
            // 404
            const error = new Error("Link not found");
            error.statusCode = 404;
            next(error);
          }
          doc ? res.send(doc) : next(err);
        }
      );
    } catch (err) {
      if (!err.statusCode) err.statusCode = 400;
      next(err);
    } // move link by removing from old topic adding it to new topic if topic has changed
    if (Object.keys(req.body).includes("topic")) {
      try {
        await Topic.bulkWrite([
          {
            updateOne: {
              filter: { "links._id": req.params.linkId },
              update: {
                $pull: {
                  links: { _id: mongoose.Types.ObjectId(req.params.linkId) },
                },
              },
            },
          },
          {
            updateOne: {
              filter: { _id: mongoose.Types.ObjectId(req.body.topic) },
              update: { $addToSet: { links: req.body } },
            },
          },
        ]).then((result) => {
          res.send(result);
        });
      } catch (err) {
        if (!err.statusCode) err.statusCode = 400;
        next(err);
      }
    }
  }
);

module.exports = router;

// patch alternative
// try {
//   const topic = await Topic.find({ "links._id": req.params.linkId });
//   if (!topic) return res.status(404).send();
//   const link = topic[0].links.find(
//     (el) => el._id.toString() === req.params.linkId
//   );
//   console.log(topic[0].links._id);
//   // replace all the fields
//   updates.forEach((update) => {
//     link[update] = req.body[update];
//   });
//   // TODO update the topic

// } catch (err) {
//   res.status(400).send(err);
// }
