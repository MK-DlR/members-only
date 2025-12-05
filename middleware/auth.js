// middleware/auth.js

// authentication middleware

// check if user is logged in before accessing certain routes
function requireAuth(req, res, next) {
  if (!req.user) {
    return res.redirect("/log-in");
  }
  next();
}

module.exports = { requireAuth };
