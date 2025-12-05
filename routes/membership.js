// routes/membership.js

// imports
const express = require("express");
const router = express.Router();
const passport = require("passport");
const memberController = require("../controllers/membershipController");
const { body } = require("express-validator");
const { requireAuth } = require("../middleware/auth");

// membership form route
router.get("/membership", requireAuth, memberController.membershipGet);

router.post("/membership", requireAuth, memberController.membershipPost);

module.exports = router;
