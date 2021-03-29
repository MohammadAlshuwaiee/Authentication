const bcrypt = require("bcrypt");

// Database
const { User } = require("../db/models");
// jwt Token
const jwt = require("jsonwebtoken");

//Keys
const { JWT_SECRET, JWT_EXPIRATION_MS } = require("../../config/keys");

exports.signup = async (req, res, next) => {
  const { password } = req.body;
  const saltRounds = 10;
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log("exports.signup -> hashedPassword", hashedPassword);
    req.body.password = hashedPassword;
    const newUser = await User.create(req.body);
    const payload = {
      id: newUser.id,
      username: newUser.username,
      exp: Date.now() + JWT_EXPIRATION_MS,
    };
    // res.status(201).json({ message: "User created successfully" });
    const token = jwt.sign(JSON.stringify(payload), JWT_SECRET);
    res.status(201).json({ token: token });
  } catch (error) {
    next(error);
  }
};

exports.signin = async (req, res) => {
  const { user } = req;
  const payload = {
    id: user.id,
    username: user.username,
    exp: Date.now() + JWT_EXPIRATION_MS, // token will expire after 15 minutes
  };
  const token = jwt.sign(JSON.stringify(payload), JWT_SECRET);
  res.status(201).json({ token: token });
};
