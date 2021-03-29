const express = require("express");
const router = express.Router();
const { signup, signin } = require("../controllers/userController");
// const JWTStrategy = require("passport-jwt").Strategy;
const jwt = require("jsonwebtoken");

//passport
const passport = require("passport");

router;
router.post(
  "/signup",
  // passport.authenticate("local", { seesion: false }),
  signup
);

router.post(
  "/signin",
  passport.authenticate("local", { session: false }),
  signin
);

module.exports = router;
