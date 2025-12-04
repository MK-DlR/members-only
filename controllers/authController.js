// controllers/authController.js

// imports
const { body, validationResult, matchedData } = require("express-validator");
const bcrypt = require("bcryptjs");
const pool = require("../db/pool");

// sign up form route
const signUpGet = (req, res) => {
  res.render("sign-up", { title: "Sign Up" });
};

// sign-up handler — inserts a new user into the DB
const signUpPost = async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await pool.query("INSERT INTO users (username, password) VALUES ($1, $2)", [
      req.body.username,
      hashedPassword,
    ]);
    res.redirect("/");
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// login page route
const logInGet = (req, res) => {
  res.render("log-in", { title: "Log In" });
};

// log-out route — uses req.logout callback-style API and redirects to home
const logOut = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

module.exports = {
  signUpGet,
  signUpPost,
  logInGet,
  logOut,
};
