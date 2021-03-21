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
const {
  findUser,
  checkAdmin,
  getUserTopic,
} = require("../middlewares/user-middleware");

// catch indexing errors
// Topic.on("index", function (err) {
//   if (err) {
//     console.error(err);
//   }
// });

// protected route for admin user only, display all topics
router.get("/alltopics", checkAdmin, async (req, res, next) => {
  try {
    const topics = await Topic.find();
    if (!topics) {
      const error = new Error("No topics found");
      error.statusCode = 404;
      throw error;
    }
    res.send(topics);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
});

// get a single topic that must be associated with the requesting user
router.get("/:topicSlug", findUser, async (req, res, next) => {
  try {
    const topic = await getUserTopic(
      req.body.user,
      "getOneTopic",
      req.params.topicSlug
    );
    if (!topic || topic instanceof Error) {
      const error = new Error("Topic not found");
      error.statusCode = 404;
      throw error;
    }
    res.send(topic);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 404;
    next(err);
  }
});
router.get("/:id", findUser, async (req, res, next) => {
  try {
    const topic = await getUserTopic(
      req.body.user,
      "getOneTopic",
      req.params.id
    );
    if (!topic || topic instanceof Error) {
      const error = new Error("Topic not found");
      error.statusCode = 404;
      throw error;
    }
    res.send(topic);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 404;
    next(err);
  }
});

// display all the topics associated with requesting user, or all topics without user
router.get("/", findUser, async (req, res, next) => {
  try {
    let topics;
    if (req.body.user) {
      topics = await getUserTopic(req.body.user, "getAllTopics");
    } else {
      topics = await Topic.find({ user: null });
    }
    if (!topics) {
      const error = new Error("No topics found");
      error.statusCode = 404;
      throw error;
    }
    res.send(topics);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
});

router.post(
  "/",
  topicPostValidationRules(),
  validate,
  findUser,
  async (req, res, next) => {
    const { title, links, description, parent, user, _id } = req.body;
    const topic = new Topic({
      _id: _id,
      title: title,
      links: links,
      description: description,
      parent: parent,
      user: user,
    });
    try {
      let ancestors = [];
      let newTopic = null;
      // Build ancestors and children lists
      if (parent) {
        // get parent topic
        const parentTopic = await Topic.findById(parent);
        if (!parentTopic) {
          throw new Error("No parent topic found");
        } // Build ancestors list
        if (parentTopic.ancestors && parentTopic.ancestors.length < 2) {
          ancestors = buildAncestors(parentTopic);
        } else {
          throw new Error("Cannot have more than 2 ancestors");
        }
        topic.ancestors = ancestors;
        newTopic = await topic.save();
        if (!newTopic) {
          throw new Error("Could not create the topic");
        } // Build children list
        parentTopic.children.push({
          _id: newTopic._id,
          title: newTopic.title,
          slug: newTopic.slug,
        });
        // Save changes to parent topic
        await parentTopic.save();
        res.status(201).send(newTopic);
      } else {
        newTopic = await topic.save();
        res.status(201).send(newTopic);
      }
    } catch (err) {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    }
  }
);

router.patch(
  "/:topicSlug",
  checkAllowedUpdates(["title", "links", "description"]),
  topicPatchValidationRules(),
  validate,
  findUser,
  async (req, res, next) => {
    try {
      let topic;

      // Grab the list of updated fields
      const updates = Object.keys(req.body);

      // Get user or null user
      topic = await getUserTopic(
        req.body.user,
        "getOneTopic",
        req.params.topicSlug
      );

      if (!topic || typeof topic !== "object") {
        const error = new Error("Topic not found");
        error.statusCode = 404;
        throw error;
      }

      // Replace all the fields
      updates.forEach((update) => {
        topic[update] = req.body[update];
      });

      // Update the title and slug in children and ancestors elements
      if (updates.includes("title")) {
        try {
          // modify slug in topic
          topic.slug = slugify(topic.title);
          await Topic.updateMany(
            { "ancestors._id": mongoose.Types.ObjectId(topic._id) },
            {
              $set: {
                "ancestors.$.title": topic.title,
                "ancestors.$.slug": slugify(topic.title),
              },
            }
          );
          await Topic.updateMany(
            { "children._id": mongoose.Types.ObjectId(topic._id) },
            {
              $set: {
                "children.$.title": topic.title,
                "children.$.slug": slugify(topic.title),
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

router.delete("/:topicSlug", findUser, async (req, res, next) => {
  // user authorization
  try {
    const topic = await getUserTopic(
      req.body.user,
      "getOneTopic",
      req.params.topicSlug
    );

    if (!topic) {
      const error = new Error("Topic not found");
      error.statusCode = 404;
      throw error;
    }
    console.log(topic);
    // Delete the topic from ancestors and/or children elements
    try {
      // change depth level for children topics, remove ancestors and parent
      await Topic.updateMany(
        { "ancestors._id": mongoose.Types.ObjectId(topic._id) },
        {
          $pull: { ancestors: { _id: topic._id } },
          $set: { parent: null },
          $inc: { depth: -1 },
        }
      );
      await Topic.updateMany(
        { "children._id": mongoose.Types.ObjectId(topic._id) },
        {
          $pull: { children: { _id: topic._id } },
        }
      );
    } catch (err) {
      if (!err.statusCode) err.statusCode = 400;
      next(err);
    }
    const deletedTopic = await Topic.findByIdAndDelete(topic._id);

    res.send(deletedTopic);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
});

// OLD;
// patching by ID, not used by frontend
// router.patch(
//   "/:id",
//   checkAllowedUpdates(["title", "links", "description"]),
//   topicPatchValidationRules(),
//   validate,
//   findUser,
//   async (req, res, next) => {
//     try {
//       let topic;

//       // grab the list of updated fields
//       const updates = Object.keys(req.body);

//       // get user or null user
//       topic = await getUserTopic(req.body.user, "getOneTopic", req.params.id);

//       if (!topic || typeof topic !== "object") {
//         const error = new Error("Topic not found");
//         error.statusCode = 404;
//         throw error;
//       }

//       // replace all the fields
//       updates.forEach((update) => {
//         topic[update] = req.body[update];
//       });

//       // update the title in children elements
//       if (updates.includes("title")) {
//         try {
//           await Topic.updateMany(
//             { "ancestors._id": mongoose.Types.ObjectId(topic._id) },
//             {
//               $set: {
//                 "ancestors.$.title": topic.title,
//                 "ancestors.$.slug": slugify(topic.title),
//               },
//             }
//           );
//         } catch (err) {
//           if (!err.statusCode) err.statusCode = 400;
//           next(err);
//         }
//       }
//       await topic.save();
//       res.send(topic);
//     } catch (err) {
//       if (!err.statusCode) err.statusCode = 400;
//       next(err);
//     }
//   }
// );

// router.delete("/:id", findUser, async (req, res, next) => {
//
//   // user authorization
//   try {
//
//       const topic = await getUserTopic(req.body.user, "getOneTopic", req.params.id);
//
//     if (!topic) {
//       const error = new Error("Topic not found");
//       error.statusCode = 404;
//       throw error;
//     }

//     let deletedTopic = await Topic.findByIdAndDelete(req.params.id);
//     // delete the topic from children elements
//     try {
//       await Topic.updateMany(
//         { "ancestors._id": mongoose.Types.ObjectId(deletedTopic._id) },
//         {
//           $pull: { ancestors: { _id: deletedTopic._id } },
//         }
//       );
//     } catch (err) {
//       if (!err.statusCode) err.statusCode = 400;
//       next(err);
//     }
//     res.send(deletedTopic);
//   } catch (err) {
//     if (!err.statusCode) err.statusCode = 500;
//     next(err);
//   }
// });

module.exports = router;
