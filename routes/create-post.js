// routes/create-post.js

// imports
const express = require("express");
const router = express.Router();
const passport = require("passport");
const postsController = require("../controllers/postsController");
const { body } = require("express-validator");
const { requireMember } = require("../middleware/auth");

// create post form route
router.get("/create-post", requireMember, postsController.newPostGet);

router.post("/create-post", requireMember, postsController.newPostPost);

module.exports = router;
