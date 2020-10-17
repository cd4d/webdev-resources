// check if the fields to be updated are allowed

module.exports = (allowedUpdates) => {
    return(req,res,next) => {
        const requestedUpdates = Object.keys(req.body);
        const isValidUpdate = requestedUpdates.every((update) =>
        allowedUpdates.includes(update)
      );
      if (!isValidUpdate) {
        return res.status(400).send({ error: "invalid request" });
      }
      next()
    }
}