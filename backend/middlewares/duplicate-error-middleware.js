module.exports = function (err, res, next) {
  //console.log("err: ", err);
  if (err.name === "MongoError" && err.code === 11000) {
    // extracting the field where duplicate error happened at err.keyValue
    const error = new Error();
    //let { ...error } = err.keyValue;
    console.log("E11000 error: ", err);
    if (err.keyValue) {
      error.on = Object.keys(err.keyValue);
    }

    error.message = `Duplicate key error at: ${JSON.stringify(err.keyValue)}`;
    error.statusCode = 409;
    next(error);
  } else {
    next();
  }
};
