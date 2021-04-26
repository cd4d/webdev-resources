if (process.env.NODE_ENV !== "production") require("dotenv").config();

let port = process.env.BACKEND_PORT;
if (port == null || port == "") {
  port = 3000;
}
module.exports = function (app) {
  const server = app.listen(port, console.log("Listening on port " + port));
  return server;
};
