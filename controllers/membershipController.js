// controllers/membershipController.js

// handle the POST request that validates the code
// and updates the user's membership status in the database

// imports
const pool = require("../db/pool");

// membership form route
const membershipGet = (req, res) => {
  res.render("membership", { title: "Membership" });
};

module.exports = {
  membershipGet,
};
