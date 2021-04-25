// https://www.digitalocean.com/community/tutorials/how-to-use-winston-to-log-node-js-applications
if (process.env.NODE_ENV !== "production") require("dotenv").config();
const winston = require("winston");
// define the custom settings for each transport (file, console)
const options = {
  errorFile: {
    level: "error",
    filename: "./logs/errors.log",
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
  infoFile: {
    level: "info",
    filename: "./logs/infos.log",
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
  console: {
    level: "debug",
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

// instantiate a new Winston Logger with the settings defined above
const logger = winston.createLogger({
  transports: [
    new winston.transports.File(options.errorFile),
    new winston.transports.File(options.infoFile),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: "./logs/exceptions.log" }),
  ],
  exitOnError: false, // do not exit on handled exceptions
});

if (process.env.NODE_ENV !== "production") {
  logger.add(new winston.transports.Console(options.console));
}

// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
  write: function (message, encoding) {
    // use the 'info' log level so the output will be picked up by both transports (file and console)
    logger.info(message);
  },
};

module.exports = logger;
