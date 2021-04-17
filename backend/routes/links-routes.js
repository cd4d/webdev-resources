const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const { Topic } = require("../models/topics-model");
const {
  linkPatchValidationRules,
  linkPostValidationRules,
  validate,
} = require("../middlewares/express-validator-middleware");
const checkAllowedUpdates = require("../middlewares/allowed-updates");
const {
  findUser,
  checkAdmin,
  getUserTopic,
} = require("../middlewares/user-middleware");
const { getLinkPreview } = require("../utils/get-link-preview");
const linkPreviewGenerator = require("link-preview-generator");

// build linkpreview for guest user

router.post("/link-preview", async (req, res, next) => {
  const response = await getLinkPreview(req.body.url).catch((err) => {});
  response && res.send(response);
});

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
      throw error;
    }
  } catch (err) {
    if (!err.statusCode) err.statusCode = 400;
    next(err);
  }
});

router.get("/link/:linkId", findUser, async (req, res, next) => {
  try {
    const topic = await Topic.find({
      "links._id": req.params.linkId,
      user: req.body.user,
    });
    // result is an array, check if array is not empty and contains links
    if (Array.isArray(topic) && topic.length && topic[0].links) {
      const link = topic[0].links.find(
        (el) => el._id.toString() === req.params.linkId
      );
      if (!link) throw new Error("Link not found");

      res.send(link);
    } else {
      const error = new Error("Link requested not found");
      error.statusCode = 404;
      throw error;
    }
  } catch (err) {
    if (!err.statusCode) err.statusCode = 400;
    next(err);
  }
});

router.post("/", findUser, async (req, res, next) => {
  if (req.body.topic) {
    const topic = req.body.topic;
    let linkProvided = req.body;
    //console.log("link req.body: ", req.body);
    //  Get open graph preview
    const openGraphData = await getLinkPreview(req.body.url).catch((err) => {});
    if (openGraphData) {
      linkProvided = { ...req.body, ...openGraphData };
    }

    try {
      const newLink = await Topic.findOneAndUpdate(
        { _id: topic, user: req.body.user },
        { $addToSet: { links: linkProvided } },
        { new: true }
      );
      if (!newLink) throw new Error("Link not found");
      res.send(newLink);
    } catch (err) {
      console.log("error post link");
      if (!err.statusCode) err.statusCode = 404;
      next(err);
    }
  }
});

// delete link, topic id must be provided in body as well
router.delete("/", findUser, async (req, res, next) => {
  try {
    const deletedLink = await Topic.findOneAndUpdate(
      {
        _id: req.body.topicId,
        "links._id": req.body.linkId,
        user: req.body.user,
      },
      { $pull: { links: { _id: req.body.linkId } } },
      { new: true }
    );
    if (!deletedLink) throw new Error("Link not found");
    res.send(deletedLink);
  } catch (err) {
    console.log("error deleting link");
    if (!err.statusCode) err.statusCode = 404;
    next(err);
  }
});
router.patch(
  "/:linkId",
  checkAllowedUpdates(["topic", "url", "summary"]),
  linkPatchValidationRules(),
  validate,
  findUser,
  async (req, res, next) => {
    // check if link is part of user data
    try {
      const link = await Topic.findOne({
        "links._id": req.params.linkId,
        user: req.body.user,
      });
      if (!link) throw new Error("Link was not found");
    } catch (err) {
      if (!err.statusCode) err.statusCode = 404;
      return next(err);
    }

    // append 'links.$.' in front of updated data i.e links.$.title : req.body.title
    let newData = req.body;
    let updatedData = {};
    let openGraphData = null;
    // update open graph data if url updated
    if (req.body.url) {
      const response = await getLinkPreview(req.body.url).catch((err) => {});
      if (response) {
        newData = { ...req.body, ...response };
      }
    }
    console.log("edit link openGraphData: ", openGraphData);
    for (let [key, value] of Object.entries(newData)) {
      updatedData["links.$." + key] = value;
    } // adding the _id field
    updatedData["links.$._id"] = req.params.linkId;
    // updates the link if topic is not changed
    if (!Object.keys(req.body).includes("topic")) {
      try {
        console.log("updating link");
        const updatedLink = await Topic.findOneAndUpdate(
          { "links._id": req.params.linkId, user: req.body.user },
          updatedData,
          { new: true }
        );
        if (!updatedLink) throw new Error("Link was not updated");

        res.send(updatedLink);
      } catch (err) {
        return next(err);
      }
    } else {
      try {
        // check if new topic belongs to user
        const topic = await getUserTopic(
          req.body.user,
          "getOneTopic",
          req.body.topic
        );
        if (!topic) {
          throw new Error("Wrong topic");
        } else {
          // updates the link itself first
          await Topic.findOneAndUpdate(
            { "links._id": req.params.linkId, user: req.body.user },
            updatedData,
            { new: true }
          ).exec();
          // then move the link  from old topic
          await Topic.bulkWrite([
            {
              updateOne: {
                filter: { "links._id": req.params.linkId },
                update: {
                  $pull: {
                    links: {
                      _id: mongoose.Types.ObjectId(req.params.linkId),
                    },
                  },
                },
              },
            },
            {
              // then add it to new topic
              updateOne: {
                filter: { _id: mongoose.Types.ObjectId(req.body.topic) },
                update: { $addToSet: { links: req.body } },
              },
            },
          ]).then((result) => {
            res.send(result);
          });
        }
      } catch (err) {
        if (!err.statusCode) err.statusCode = 400;
        next(err);
      }
    }
  }
);

module.exports = router;
