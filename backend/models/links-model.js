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
    unique: true,
    match: regex,
    index: true,
    sparse: true,
  },
  url: {
    type: String,
    minlength: 10,
    maxlength: 255,
    required: true,
    unique: true,
    sparse: true,
    validate(value) {
      if (!validator.isURL(value)) {
        throw new Error("Invalid url");
      }
    },
  },
});

// TODO validation of links url in patch request
// linkSchema.pre("findOneAndUpdate", async function (next) {
//   console.log(this);
//   try {
//     validateLink(this);
//     next();
//   } catch (err) {
//     console.log(err);
//   }
// });
const Link = mongoose.model("Link", linkSchema)
exports.linkSchema = linkSchema;
exports.Link = Link