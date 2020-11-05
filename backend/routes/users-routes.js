require("dotenv").config();
const express = require("express");
const router = express.Router();

const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const { User } = require("../models/users-model");
const checkAllowedUpdates = require("../middlewares/allowed-updates");

const {
  findUser,
  checkAdmin,
  getUserTopic,
} = require("../middlewares/user-middleware");
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

// get all users, for admin/testing only
router.get("/", async (req, res) => {
  try {
    const allUsers = await User.find();
    res.send(allUsers);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 404;
    next(err);
  }
});

router.post("/register", async (req, res) => {
  await User.register(
    { username: req.body.username, email: req.body.email },
    req.body.password,
    (err, user) => {
      if (err) {
        console.log(err);
        res.status(400).send(err, "Error at registration.");
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
      console.log("login has failed");
      res.status(401).send(err, "Login failed");
    } else {
      passport.authenticate("local")(req, res, () => {
        console.log("user is logged in");
        res.status(200).send("User logged in.");
      });
    }
  });
});

router.get("/logout", function (req, res) {
  req.logout();
  res.send("Logged out.");
  // res.redirect('/');
});

router.get("/:id", async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) throw new Error("No user found.");

    res.send(user);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 404;
    next(err);
  }
});

// TODO edit user, validate fields?

router.patch(
  "/:id",
  checkAllowedUpdates(["username", "email", "password"]),
  findUser,
  async (req, res, next) => {
    // grab the list of updated fields, filtering for user
    let updatedData = {};
    for (let [key, value] of Object.entries(req.body)) {
      if (key !== "user") {
        updatedData[key] = value;
      }
    }
    console.log("updatedData:", updatedData);
    console.log("body:", req.body);

    try {
      // match user requesting with user id in url
      if (req.params.id === req.body.user) {
        const user = await User.findOneAndUpdate(
          { _id: req.body.user },
          updatedData
        );
        if (!user) throw new Error("No user found.");
        res.send(user);
      } // user not found or wrong user
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    } catch (err) {
      if (!err.statusCode) err.statusCode = 400;
      next(err);
    }
  }
);

module.exports = router;
