require("dotenv").config();
const mongoose = require("mongoose");
let DATABASE = process.env.DB_DEV;
if (process.env.NODE_ENV === "test") {
  DATABASE = process.env.DB_TEST;
}
if (process.env.NODE_ENV === "production") {
  DATABASE = process.env.DB_PROD;
}

module.exports = function () {
  mongoose
    .connect(DATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
      // disable in prod if enabled
      //autoIndex: true,
    })
    .then(() => console.log("Connected to ${DATABASE}..."))
    .catch((err) => console.log("Could not connect to database."));
};
