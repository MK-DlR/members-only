// config/passport.js

const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const pool = require("../db/pool");

function initialize(passport) {
  // verify user credentials
  const authenticateUser = async (username, password, done) => {
    try {
      const { rows } = await pool.query(
        "SELECT * FROM users WHERE username = $1",
        [username]
      );

      const user = rows[0];

      // check if user exists
      if (!user) {
        return done(null, false, { message: "No user with that username" });
      }

      // check if password matches
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return done(null, false, { message: "Incorrect password" });
      }

      // success
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  };

  passport.use(new LocalStrategy(authenticateUser));

  // store user id in session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // retrieve user from session
  passport.deserializeUser(async (id, done) => {
    try {
      const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [
        id,
      ]);
      done(null, rows[0]);
    } catch (err) {
      done(err);
    }
  });
}

module.exports = initialize;
