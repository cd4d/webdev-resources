const mongoose = require("mongoose");
const Joi = require("joi");
const validator = require("validator")

//  See https://gist.github.com/dperini/729294 for regexp URL matcher
const regex = /^[a-zA-Z0-9À-Ÿ-_]+( [a-zA-Z0-9À-Ÿ-_]+)*$/



const linkSchema = new mongoose.Schema({
  description: {
    type: String,
    minlength: 2,
    maxlength: 255,
    unique: true,
    match: regex,
    index: true,
    sparse:true
  },
  url: {
    type: String,
    minlength: 10,
    maxlength: 255,
    unique: true,
    sparse:true,
    validate(value){
      if(!validator.isURL(value)){
        throw new Error("Invalid url")
      }
    }
  },
});

exports.linkSchema = linkSchema;
