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
  // check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render("sign-up", {
      title: "Sign Up",
      errors: errors.array(),
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    await pool.query(
      "INSERT INTO users (fname, lname, username, password, membership) VALUES ($1, $2, $3, $4, $5)",
      [req.body.fname, req.body.lname, req.body.username, hashedPassword, false]
    );

    res.redirect("/");
  } catch (error) {
    console.error("Sign up error:", error);
    console.error("Error details:", error.message);
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
