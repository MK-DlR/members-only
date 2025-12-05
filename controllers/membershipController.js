// controllers/membershipController.js

// imports
const pool = require("../db/pool");

// membership form route
const membershipGet = (req, res) => {
  res.render("membership", { title: "Membership" });
};

// membership handler
const membershipPost = async (req, res, next) => {
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
};

module.exports = {
  membershipGet,
  membershipPost,
};
