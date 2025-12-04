// routes/auth.js

// imports
const express = require("express");
const router = express.Router();
const passport = require("passport");
const authController = require("../controllers/authController");
const { body } = require("express-validator");

// sign up form route
router.get("/sign-up", authController.signUpGet);

// verify password matches the repeat
router.post(
  "/sign-up",
  body("fname")
    .trim()
    .isLength({ min: 1, max: 50 })
    .escape()
    .withMessage("First name is required"),

  body("lname")
    .trim()
    .isLength({ min: 1, max: 50 })
    .escape()
    .withMessage("Last name is required"),

  body("username")
    .trim()
    .isLength({ min: 3, max: 30 })
    .isAlphanumeric()
    .withMessage("Username must be 3-30 alphanumeric characters"),

  body("password")
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must be at least 8 characters with uppercase, lowercase, and number"
    ),

  // verify password matches the repeat
  body("passwordConfirmation")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords must match"),

  authController.signUpPost
);

// log in page route
router.get("/log-in", authController.logInGet);

// log in POST route - authenticate and redirect back to /log-in
router.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/log-in",
    failureRedirect: "/log-in",
  })
);

// log out route — uses req.logout callback-style API and redirects to home
router.get("/log-out", authController.logOut);

module.exports = router;
