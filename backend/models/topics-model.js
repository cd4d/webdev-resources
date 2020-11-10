const mongoose = require("mongoose");
const slugify = require("../utils/slugify");
const { linkSchema } = require("./links-model");
const regex = /^[a-zA-Z0-9À-Ÿ-_]+( [a-zA-Z0-9À-Ÿ-_]+)*$/;

// disable in prod
mongoose.set("debug", true);

// https://medium.com/swlh/crud-operations-on-mongodb-tree-data-structure-f5afaeca1550
const topicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 75,
    trim: true,
    match: regex,
  },
  slug: {
    type: String,
    index: true,
    //set: (value) => slugify(this.title),
  },
  description: {
    type: String,
    minlength: 1,
    maxlength: 255,
    trim: true,
    match: regex,
  }, // embedding the links schema defined in the links-model file
  links: [linkSchema],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
    ref: "User",
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
    ref: "Topic",
  },
  ancestors: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: "Topic", index: true },
      title: String,
      slug: String,
    },
  ],
});

// compound index to ensure unique value for the same user , can be disabled in prod with {autoindex: false}.
// Ignoring null values: https://stackoverflow.com/questions/35755628/unique-index-in-mongodb-3-2-ignoring-null-values

topicSchema.index(
  { user: 1, title: 1 },
  {
    unique: true,
    partialFilterExpression: { title: { $type: "string" } },
  }
);
topicSchema.index(
  { user: 1, "links.description": 1 },
  {
    unique: true,
    partialFilterExpression: { "links.description": { $type: "string" } },
  }
);
topicSchema.index(
  { user: 1, "links.url": 1 },
  {
    unique: true,
    partialFilterExpression: { "links.url": { $type: "string" } },
  }
);

// *** associated middlewares *** //
// generates URL slug
topicSchema.pre("save", async function (req, res, next) {
  try {
    this.slug = await slugify(this.title);
    next();
  } catch (err) {
    console.log("Error:", err);
    next(err)
  }
});
// Catching duplicate error, working?
topicSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoError" && error.code === 11000) {
    next(new Error("There was a duplicate key error"));
  } else {
    next(error);
  }
});
// update middleware for slug, not used anymore, using save() for patch requests
// topicSchema.pre("findOneAndUpdate", async function (next) {
//   try {
//     // only fires if title is updated
//     if (this.getUpdate().$set.title) {
//       const oldData = this.getFilter(); // grabs topic to be updated from query
//       const newTitle = this.getUpdate().$set.title;
//       const docToUpdate = await Topic.findOne(oldData).exec();
//       await Topic.updateOne(
//         { _id: docToUpdate._id },
//         { slug: slugify(newTitle) }
//       );
//     }
//     next();
//   } catch (err) {
//     console.log(err);
//   }
// });

const Topic = mongoose.model("Topic", topicSchema);

exports.topicSchema = topicSchema;
exports.Topic = Topic;
