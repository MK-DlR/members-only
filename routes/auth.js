// routes/auth.js

// imports
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { body } = require("express-validator");

// sign up form route
router.get("/sign-up", authController.signUpGet);

// verify password matches the repeat
router.post(
  "/sign-up",
  body("password").isLength({ min: 5 }),
  body("passwordConfirmation").custom((value, { req }) => {
    return value === req.body.password;
  }),
  authController.signUpPost
);

// login page route
router.get("/log-in", authController.logInGet);

// log-out route — uses req.logout callback-style API and redirects to home
router.get("/log-out", authController.logOut);

module.exports = router;
