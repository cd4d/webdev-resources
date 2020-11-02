// middleware that check if a request comes from a logged-in user

module.exports = (req, res, next) => {
  if (req.session && req.session.passport && req.session.passport.user) {
    console.log("User found", req.session.passport.user);
    req.body.currentUser = req.session.passport.user;
    return next();
  } else{
    req.body.currentUser = "defaultUser"
  }
  next();
};
