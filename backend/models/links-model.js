const mongoose = require("mongoose");
const validator = require("validator");

//  See https://gist.github.com/dperini/729294 for regexp URL matcher
const regex = /^[a-zA-Z0-9À-Ÿ-_]+( [a-zA-Z0-9À-Ÿ-_]+)*$/;

const linkSchema = new mongoose.Schema({
  topic: { type: mongoose.Types.ObjectId },
  description: {
    type: String,
    minlength: 2,
    maxlength: 255,
    required: true,
    match: regex,
  },
  url: {
    type: String,
    minlength: 10,
    maxlength: 255,
    required: true,

    validate: [validator.isURL, "Invalid URL"],
  },
});

const Link = mongoose.model("Link", linkSchema);
exports.linkSchema = linkSchema;
exports.Link = Link;
