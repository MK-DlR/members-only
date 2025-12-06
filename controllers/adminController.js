// controllers/adminController.js

// imports
const pool = require("../db/pool");

// admin form route
const adminGet = (req, res) => {
  res.render("admin", { title: "Administrator" });
};

// admin handler
const adminPost = async (req, res, next) => {
  /*
  try {
    // success
    if (
      req.body.code === process.env.MEMBERSHIP_CODE &&
      req.isAuthenticated()
    ) {
      // update membership status
      await pool.query("UPDATE users SET membership = $1 WHERE id = $2", [
        true,
        req.user.id,
      ]);

      res.render("membership", {
        title: "Membership",
        success: [{ msg: "Membership successfully activated!" }],
      });
    } else if (req.body.code != process.env.MEMBERSHIP_CODE) {
      // failure, wrong code
      res.render("membership", {
        title: "Membership",
        errors: [{ msg: "Not a valid membership code." }],
      });
    } else {
      // failure, not logged in
      res.render("membership", {
        title: "Membership",
        errors: [{ msg: "Please log in first." }],
      });
    }
  } catch (error) {
    console.error("Membership error:", error);
    next(error);
  }
    */
  console.log("placeholder");
};

module.exports = {
  adminGet,
  adminPost,
};
