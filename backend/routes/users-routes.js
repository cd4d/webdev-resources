require("dotenv").config();
const express = require("express");
const router = express.Router();

const passport = require("passport");

const { User } = require("../models/users-model");
const checkAllowedUpdates = require("../middlewares/allowed-updates");
const {
  userPostValidationRules,
  userPatchValidationRules,
  validate,
} = require("../middlewares/express-validator-middleware");
const { findUser, checkAdmin } = require("../middlewares/user-middleware");
const generateResetToken = require("../utils/generate-reset-token");
const dayjs = require("dayjs");
const sendResetEmail = require("../utils/send-reset-email");
// router.use instead of app.use
// see https://github.com/jaredhanson/passport/issues/51#issuecomment-418313158
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

router.post(
  "/register",
  userPostValidationRules(),
  validate,
  async (req, res, next) => {
    try {
      // password confirm
      if (req.body.password !== req.body.confirmPassword) {
        const error = new Error("Passwords don't match.");
        error.statusCode = 400;
        throw error;
      }
      await User.register(
        { username: req.body.username, email: req.body.email },
        req.body.password,
        (err, user) => {
          if (err) {
            // const error = new Error("Error at registration.");
            // error.statusCode = 400;
            // throw error;
            res.status(400).send("Error at registration.");
          } else {
            passport.authenticate("local")(req, res, () => {
              res.status(200).send("User successfully registered.");
            });
          }
        }
      );
    } catch (err) {
      next(err);
    }
  }
);

router.post("/login", (req, res, next) => {
  const today = dayjs().format();
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });
  // passport provides 401 error for wrong credentials
  req.login(user, () => {
    passport.authenticate("local")(req, res, async () => {
      // update last login date
      await User.findOneAndUpdate(
        { username: req.body.username },
        { lastLogin: dayjs().format() },
        (err) => {
          if (err) res.status(500).send("Cannot login");

          res
            .status(200)
            .send({
              loggedUser: req.body.username,
              message: "User logged in.",
            });
        }
      );
    });
  });
});

router.get("/logout", function (req, res) {
  req.logout();
  res.clearCookie('connect.sid');
  res.send("Logged out.");
  // res.redirect('/');
});

router.patch(
  "/:id",
  checkAllowedUpdates(["username", "email", "password", "confirmPassword"]),
  userPatchValidationRules(),
  validate,
  findUser,
  async (req, res, next) => {
    // grab the list of updated fields, filtering for user
    let updatedData = {};
    for (let [key, value] of Object.entries(req.body)) {
      if (key !== "user") {
        updatedData[key] = value;
      }
    }

    try {
      // password confirm
      if (req.body.password && req.body.password !== req.body.confirmPassword) {
        const error = new Error("Passwords don't match.");
        error.statusCode = 400;
        throw error;
      }
      // match user requesting with user id in url
      if (req.params.id === req.body.user) {
        const user = await User.findOneAndUpdate(
          { _id: req.body.user },
          updatedData
        );
        console.log("user update:", user);
        if (!user) throw new Error("Error at updating user info");
        res.send(user);
      } // wrong user requesting update
      else {
        const error = new Error("No user found.");
        error.statusCode = 404;
        throw error;
      }
    } catch (err) {
      if (!err.statusCode) err.statusCode = 400;
      next(err);
    }
  }
);

// https://stackoverflow.com/questions/20277020/how-to-reset-change-password-in-node-js-with-passport-js#27580553

// requesting password reset, sending reset link by email
router.post("/reset-password", async (req, res, next) => {
  // check if user already logged in
  if (req.isAuthenticated()) res.status(400).send("Already logged in"); //return res.redirect("/");
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) throw new Error("User not found");

    // create reset token based on date and user data
    const today = dayjs().format();
    const hashedDate = Buffer.from(today).toString("base64");

    // hashing user data with secret salt
    const userHash = generateResetToken(user, today);
    // TODO: send link by email
    const resetLink = new URL(
      req.protocol +
        "://" +
        req.get("host") +
        req.baseUrl +
        "/password-change/" +
        user._id +
        "/" +
        hashedDate +
        "-" +
        userHash
    );

    sendResetEmail({ username: user.username, resetLink: resetLink });
    res.status(200).send({
      userId: user._id,
      requestedDate: today,
      hashedDate: hashedDate,
      hash: userHash,
      resetLink: resetLink,
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 404;
    next(err);
  }
});

// unique link for resetting password
router.get(
  "/password-change/:userId/:requestedDate-:hash",
  async (req, res, next) => {
    try {
      // checking if link is out of date
      const requestedDateString = Buffer.from(
        req.params.requestedDate,
        "base64"
      ).toString("utf8");
      const requestedDate = dayjs(requestedDateString);
      const now = dayjs();
      const timeSince = now.diff(requestedDate, "hours");
      // 1 hour expiration
      if (timeSince > 1) {
        throw new Error("Link is not valid");
      }
      // get the user
      const user = await User.findById(req.params.userId);
      if (!user) {
        const error = { statusCode: 404, message: "User invalid." };
        throw error;
      }
      // hashing provided data and compare it to provided hash

      const generatedHash = generateResetToken(user, requestedDateString);

      console.log("hashes:", req.params.hash, generatedHash);
      if (req.params.hash !== generatedHash) {
        throw new Error("Link is not valid.");
      }
      // TODO redirect to passport change form
      res.send("ok");
    } catch (err) {
      next(err);
    }
  }
);

// get current user for frontend, only username & email. null by default
router.get("/current", findUser, async (req, res, next) => {
  try {
    console.log("req body", req.body);
    const currentUser = await User.findById(req.body.user, {
      _id: 0,
      username: 1,
      email: 1,
    });

    res.send({ currentUser });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 404;
    next(err);
  }
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

// get all users, for admin/testing only
router.get("/", checkAdmin, async (req, res, next) => {
  try {
    const allUsers = await User.find();
    res.send(allUsers);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 404;
    next(err);
  }
});

module.exports = router;
