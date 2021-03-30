// errors handling middleware
const logger = require("./logging");

module.exports = function (app) {
  app.use((err, req, res, next) => {
    const status = err.statusCode || 500;
    const message = err.message;
    logger.error(
      `${status} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
    );
    res.status(status).send({ ...err, status: status, message: message });
  });
};
