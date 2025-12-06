// controllers/postsController.js

// imports
const { body, validationResult } = require("express-validator");
const pool = require("../db/pool");

// create post form route
const newPostGet = (req, res) => {
  // check if user is logged in
  if (!req.user) {
    return res.redirect("/log-in");
  }
  res.render("create-post", { title: "Create New Post" });
};

// validation rules
const validatePost = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 255 })
    .withMessage("Title must be 100 characters or less"),
  body("text")
    .trim()
    .notEmpty()
    .withMessage("Post content is required")
    .isLength({ max: 5000 })
    .withMessage("Post must be 5000 characters or less"),
];

// create post handler
const newPostPost = [
  validatePost,
  async (req, res, next) => {
    // check if user is logged in
    if (!req.user) {
      return res.redirect("/login");
    }

    // check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("create-post", {
        title: "Create New Post",
        errors: errors.array(),
        formData: req.body, // preserve form data
      });
    }

    try {
      // get author_id from logged-in user
      const authorId = req.user.id;

      // insert new post (let database handle timestamp)
      await pool.query(
        "INSERT INTO messages (title, text, author_id) VALUES ($1, $2, $3)",
        [req.body.title, req.body.text, authorId]
      );

      res.redirect("/");
    } catch (error) {
      console.error("Post error:", error);
      next(error);
    }
  },
];

// delete post handler
const deletePost = async (req, res) => {
  // check if user is logged in
  if (!req.user) {
    return res.redirect("/login");
  } else if (!req.user.admin) {
    // check if user is admin
    res.status(403).send("User is not authorized");
  } else {
    const postId = req.params.id;
    try {
      // delete message
      await pool.query("DELETE FROM messages WHERE id = $1", [postId]);
      // redirect back to index page
      res.redirect("/");
    } catch (err) {
      res.status(500).send("Error deleting post");
    }
  }
};

module.exports = {
  newPostGet,
  newPostPost,
  deletePost,
};
