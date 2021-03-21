const mongoose = require("mongoose");
const slugify = require("../utils/slugify");
const { linkSchema } = require("./links-model");
const regex = /^[a-zA-Z0-9À-Ÿ-_]+( [a-zA-Z0-9À-Ÿ-_]+)*$/;

// disable in prod
//mongoose.set("debug", true);

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
  ancestors: {
    type: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: "Topic" },
        title: String,
        slug: String,
      },
    ],
    default: [],
  },

  children: {
    type: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: "Topic" },
        title: String,
        slug: String,
      },
    ],
    default: [],
  }, // Depth level i.e main topic(0), child topic(1), grand-child topic(2)
  depth: {
    type: Number,
    max: 1,
    default: 0,
  },
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
  { user: 1, slug: 1 },
  {
    unique: true,
    partialFilterExpression: { slug: { $type: "string" } },
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

// Handling duplicate key error
// https://thecodebarbarian.com/mongoose-error-handling.html

const handleE11000 = function (err, res, next) {
  if (err.name === "MongoError" && err.code === 11000) {
    // extracting the field where duplicate error happened at err.keyValue
    const error = new Error(
      `Duplicate key error at: ${JSON.stringify(err.keyValue)}`
    );
    error.statusCode = 409;
    next(error);
  } else {
    next();
  }
};

// *** associated middlewares *** //
// Slugify moved to frontend. add depth level (main topic or subtopic)
topicSchema.pre("save", async function (req, res, next) {
  try {
    if (!this.slug) {
      this.slug = await slugify(this.title);
    }
    this.depth = this.ancestors.length;
    // had to remove next() to catch duplicate key error
    // next()
  } catch (err) {
    next(err);
  }
});

// Duplicate key errors, see above

topicSchema.post("save", handleE11000);
topicSchema.post("update", handleE11000);
topicSchema.post("findOneAndUpdate", handleE11000);
topicSchema.post("insertMany", handleE11000);

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
