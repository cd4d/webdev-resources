const mongoose = require("mongoose");
const Joi = require("joi");
//  See https://gist.github.com/dperini/729294 for regexp URL matcher
const urlRegex = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i;

const linkSchema = new mongoose.Schema({
  description: {
    type: String,
    minlength: 2,
    maxlength: 255,
    unique: true,
    match: /^[a-zA-Z0-9_-]+( [a-zA-Z0-9_-]+)*$/,
  },
  url: {
    type: String,
    minlength: 10,
    maxlength: 255,
    unique: true,
    match: urlRegex,
  },
});

exports.linkSchema = linkSchema;
