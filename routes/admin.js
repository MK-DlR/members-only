// routes/admin.js

// imports
const express = require("express");
const router = express.Router();
const passport = require("passport");
const adminController = require("../controllers/adminController");
const { body } = require("express-validator");
const { requireMember } = require("../middleware/auth");

// admin form route
router.get("/admin", requireMember, adminController.adminGet);

router.post("/admin", requireMember, adminController.adminPost);

module.exports = router;
