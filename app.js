// app.js

require("dotenv").config();

// imports
// core
const express = require("express");
const path = require("path");
const pool = require("./db/pool");
// authentication
const session = require("express-session");
const passport = require("passport");
// require routers
const authRouter = require("./routes/auth");
const memberRouter = require("./routes/membership");
const adminRouter = require("./routes/admin");
const createPostRouter = require("./routes/create-post");

// passport config
const initializePassport = require("./config/passport");

// initialize app
const app = express();

// initialize passport
initializePassport(passport);

// view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// built in middleware
app.use(express.urlencoded({ extended: true })); // parse form data
app.use(express.static(path.join(__dirname, "public"))); // serve static files

// session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
  })
);

// passport
app.use(passport.initialize());
app.use(passport.session());

// custom middleware
// make user available in all ejs views
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

// routes
// home/index route (BEFORE other routes)
app.get("/", async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT messages.*, users.username 
      FROM messages 
      JOIN users ON messages.author_id = users.id 
      ORDER BY messages.created_at DESC`
    );
    res.render("index", {
      title: "Home",
      messages: result.rows,
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    next(error);
  }
});

// log-out route — uses req.logout callback-style API and redirects to home
app.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

app.use("/", authRouter);
app.use("/", memberRouter);
app.use("/", adminRouter);
app.use("/", createPostRouter);

// 404 handler, after all routes
app.use((req, res) => {
  res.status(404).render("404", { title: "404 - Page Not Found" });
});

// error handler, last
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, (error) => {
  if (error) throw error;
  console.log(`Server running on port ${PORT}`);
});
