const mongoose = require("mongoose");
const validator = require("validator");

//  See https://gist.github.com/dperini/729294 for regexp URL matcher
const regex = /^[a-zA-Z0-9À-Ÿ-_]+( [a-zA-Z0-9À-Ÿ-_]+)*$/;

const linkSchema = new mongoose.Schema({
  topic: { type: mongoose.Types.ObjectId },
  summary: {
    type: String,
    minlength: 2,
    maxlength: 255,
    required: true,

    index: true,
  },
  url: {
    type: String,
    minlength: 10,
    maxlength: 255,
    required: true,
    validate: [validator.isURL, "Invalid URL"],
  },
  openGraphTitle: { type: String, maxlength: 144, default: null },
  openGraphDescription: { type: String, maxlength: 255, default: null },
  openGraphSiteName: { type: String, maxlength: 255, default: null },
  openGraphDomainName: { type: String, maxlength: 255, default: null },
  openGraphImage: { type: String, maxlength: 255, default: null },
  // title: { type: String, maxlength: 144, default: null },
  // description: { type: String, maxlength: 255, default: null },
  // domain: { type: String, maxlength: 255, default: null },
  // img: { type: String, maxlength: 255, default: null },
});

const Link = mongoose.model("Link", linkSchema);
exports.linkSchema = linkSchema;
exports.Link = Link;
