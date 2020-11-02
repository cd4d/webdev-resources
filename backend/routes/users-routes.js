require("dotenv").config();
const express = require("express");
const router = express.Router();

const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const { User } = require("../models/users-model");



// https://github.com/jaredhanson/passport/issues/51#issuecomment-418313158
router.use(passport.initialize());
router.use(passport.session());

passport.use(User.createStrategy());

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

router.post("/register", async (req, res) => {
  await User.register(
    { username: req.body.username, email: req.body.email },
    req.body.password,
    (err, user) => {
      if (err) {
        console.log(err);
        res.status(400).send("Error at registration.");
      } else {
        passport.authenticate("local")(req, res, () => {
          res.status(200).send("User successfully registered.");
        });
      }
    }
  );
});

router.post("/login", (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });
  req.login(user, (err) => {
    if (err) {
      res.status(401).send("Login failed");
    } else {
      passport.authenticate("local")(req, res, () => {
        res.status(200).send("User logged in.");
      });
    }
  });
});

module.exports = router;
