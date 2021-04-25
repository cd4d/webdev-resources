// Generate a password reset token from hashing user provided data

if (process.env.NODE_ENV !== "prod") require("dotenv").config();
const crypto = require("crypto");

module.exports = function (user, requestDate) {
  const userData = {
    resetDate: requestDate,
    id: user._id,
    lastLogin: user.lastLogin,
    password: user.password,
    email: user.email,
    username: user.username,
  };
  const userHash = crypto
    .createHmac("sha256", process.env.SESSION_SECRET)
    .update(JSON.stringify(userData))
    .digest("base64");
  return userHash
};
