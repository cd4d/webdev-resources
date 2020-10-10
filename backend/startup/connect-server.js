require("dotenv").config();

const port = process.env.PORT || 3000;

module.exports = function (app) {
  const server = app.listen(port, console.log("Listening on port " + port));
  return server;
};
