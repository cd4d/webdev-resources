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

router.get("/", async (req, res) => {
  try {
    const allLinks = await Topic.find({ links: { $exists: true, $ne: [] } });
    res.send(allLinks);
  } catch (err) {
    res.status(400).send(err);
  }
});
// TODO add topic to patch, post request
router.get("/topic/:topicId", async (req, res) => {
  try {
    // find the topic then send only the links
    const topic = await Topic.findById(req.params.topicId);
    if (topic && topic.links) {
      res.send(topic.links);
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get("/link/:linkId", async (req, res) => {
  try {
    const topic = await Topic.find({ "links._id": req.params.linkId });
    if (topic) {
      const link = topic[0].links.find(
        (el) => el._id.toString() === req.params.linkId
      );
      res.send(link);
    }
  } catch (err) {
    res.status(404).send(err);
  }
});

router.post(
  "/",
  checkAllowedUpdates(["topic", "url", "description"]),
  linkPostValidationRules(),
  validate,
  async (req, res) => {
    const topic = req.body.topic;
    try {
      await Topic.findOneAndUpdate(
        { _id: topic },
        { $addToSet: { links: req.body } },
        (err, doc) => {
          if (!err) {
            res.send(doc);
          } else {
            console.log(err);
            res.status(404).send(err);
          }
        }
      );
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
);

router.patch(
  "/link/:linkId",
  checkAllowedUpdates(["topic", "url", "description"]),
  linkPatchValidationRules(),
  validate,
  async (req, res, done) => {
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
          if (err) res.status(404).send(err);
          res.send(doc);
        }
      );
    } catch (err) {
      res.status(400).send(err);
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
          // console.log(result);
          done();
        });
      } catch (err) {
        res.status(400).send(err);
      }
      done();
      
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
