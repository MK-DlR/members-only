// controllers/postsController.js

// imports
const pool = require("../db/pool");

// new post form route
const newPostGet = (req, res) => {
  res.render("create-post", { title: "Create New Post" });
};

// create post handler
const newPostPost = async (req, res, next) => {
  // code
};

module.exports = {
  newPostGet,
  newPostPost,
};
