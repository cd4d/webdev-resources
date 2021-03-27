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
  lastLogin: { type: Date, default: null },
});

// index to ensure unique value for the same user , can be disabled in prod with {autoindex: false}.
// Ignoring null values: https://stackoverflow.com/questions/35755628/unique-index-in-mongodb-3-2-ignoring-null-values

userSchema.index(
  { username: 1 },
  {
    unique: true,
    partialFilterExpression: { username: { $type: "string" } },
  }
);
userSchema.index(
  { email: 1 },
  {
    unique: true,
    partialFilterExpression: { email: { $type: "string" } },
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

// Duplicate key errors, see above

userSchema.post("save", handleE11000);
userSchema.post("update", handleE11000);
userSchema.post("findOneAndUpdate", handleE11000);

userSchema.plugin(passportLocalMongoose);
const User = mongoose.model("User", userSchema);

exports.userSchema = userSchema;
exports.User = User;
