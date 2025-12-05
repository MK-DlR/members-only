// middleware/auth.js

// check if user is logged in before accessing certain routes
function requireAuth(req, res, next) {
  if (!req.user) {
    return res.redirect("/log-in");
  }
  next();
}

// check if user is a member before accessing certain routes
function requireMember(req, res, next) {
  if (!req.user) {
    return res.redirect("/log-in");
  }
  if (req.user.membership === false) {
    return res.redirect("/membership");
  }
  next();
}

module.exports = { requireAuth, requireMember };
