// Lib
const jsonwebtoken = require("jsonwebtoken");
const { expressjwt: jwt } = require("express-jwt");
const { validationResult } = require("express-validator");
const Bcrypt = require("bcryptjs");
const Utils = require("../utils");

// constants
const { TOKEN_SECRET } = require("../constants");

// Model
const User = require("../models/user-model");

exports.signup = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const arrErr = Utils.FormatErrors(errors);
    return res
      .status(400)
      .json({ hasError: true, errors: arrErr, success: false });
  }

  const { email, password, username } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists)
    return res.status(403).json({
      hasError: true,
      errors: "Email is already taken!",
      success: false,
    });

  const data = {
    email,
    password: Bcrypt.hashSync(password),
    username,
  };

  try {
    const user = new User(data);
    const saveUser = await user.save();
    res.status(200).json({
      message: "Signup success! Please login.",
      success: true,
      hasError: false,
    });
  } catch (err) {
    res.status(500).json({
      hasError: true,
      errors: err,
      success: false,
    });
  }
};

exports.signin = async (req, res) => {
  const { email, password } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const arrErr = Utils.FormatErrors(errors);
    return res
      .status(400)
      .json({ hasError: true, errors: arrErr, success: false });
  }

  try {
    const currUser = await User.findOne({ email });
    if (!currUser) {
      return res.status(400).json({
        hasError: true,
        errors: "User does not exist",
        success: false,
      });
    } else {
      if (!Bcrypt.compareSync(password, currUser.password)) {
        res.json({ success: false, hasError: true, errors: "Wrong password" });
      } else {
        const token = jsonwebtoken.sign(
          { id: currUser._id, email: currUser.email },
          TOKEN_SECRET
        );
        res.json({ success: true, token, hasError: false });
      }
    }
  } catch (err) {
    return res.status(400).json({ hasError: true, errors: err });
  }
};
