const mongoose = require("mongoose");
const validator = require("validator");
const passportLocalMongoose = require("passport-local-mongoose");
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    validate: [validator.isEmail, "Invalid e-mail."],
  },
  username: {
    // must be 'username' for passport
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  password: {
    type: String,

    minlength: 5,
    maxlength: 1024,
  },
  isAdmin: { type: Boolean, default: false },
});
userSchema.plugin(passportLocalMongoose);
const User = mongoose.model("User", userSchema);

exports.userSchema = userSchema;
exports.User = User;
