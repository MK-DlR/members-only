// controllers/adminController.js

// imports
const pool = require("../db/pool");

// admin form route
const adminGet = (req, res) => {
  res.render("admin", { title: "Administrator Access" });
};

// admin handler
const adminPost = async (req, res, next) => {
  try {
    // success
    if (
      req.body.admin_code === process.env.ADMIN_CODE &&
      req.isAuthenticated()
    ) {
      // update admin status
      await pool.query("UPDATE users SET admin = $1 WHERE id = $2", [
        true,
        req.user.id,
      ]);

      res.render("admin", {
        title: "Administrator Access",
        success: [{ msg: "Administrator access successfully activated!" }],
      });
    } else if (req.body.admin_code != process.env.ADMIN_CODE) {
      // failure, wrong code
      res.render("admin", {
        title: "Administrator Access",
        errors: [{ msg: "Not a valid administrator access code." }],
      });
    } else {
      // failure, not logged in
      res.render("admin", {
        title: "Administrator Access",
        errors: [{ msg: "Please log in first." }],
      });
    }
  } catch (error) {
    console.error("Administrator access error:", error);
    next(error);
  }
};

module.exports = {
  adminGet,
  adminPost,
};
