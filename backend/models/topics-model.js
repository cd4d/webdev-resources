const mongoose = require("mongoose");
const Joi = require("joi")
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


// user input validation before sending data
function validateTopic(topic) {
  const validatorSchema = Joi.object({
    title: Joi.string().alphanum().min(2).max(75).required,
    description: Joi.string().alphanum().min(2).max(255),
    links: Joi.array()
  })
  return validatorSchema.validate(topic)
}
// *** associated middlewares *** //
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
// validation
topicSchema.pre("save", async function (next)  {
  try {
    validateTopic(this)
    next();
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
});

const Topic = mongoose.model("Topic", topicSchema);



exports.topicSchema = topicSchema;
exports.Topic = Topic;
