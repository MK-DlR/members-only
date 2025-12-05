// routes/membership.js

// imports
const express = require("express");
const router = express.Router();
const passport = require("passport");
const memberController = require("../controllers/membershipController");
const { body } = require("express-validator");

// membership form route
router.get("/membership", memberController.membershipGet);

router.post("/membership", memberController.membershipPost);

module.exports = router;
