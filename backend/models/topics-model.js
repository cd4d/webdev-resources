const mongoose = require("mongoose");
const slugify = require("../utils/slugify");
// https://medium.com/swlh/crud-operations-on-mongodb-tree-data-structure-f5afaeca1550
const topicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 75,
    trim: true,
  },
  slug: {
    type: String,
    index: true
  },
  links: Array,
  description: {
    type: String,
    minlength: 2,
    maxlength: 255,
    trim: true,
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
// generates URL slug
topicSchema.pre("save", async function (next)  {
  try {
    this.slug = await slugify(this.title);
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});

const Topic = mongoose.model("Topic", topicSchema);

module.exports = Topic;
