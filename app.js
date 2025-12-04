// app.js

require("dotenv").config();

// imports
// core
const express = require("express");
const path = require("path");
// authentication
const session = require("express-session");
const passport = require("passport");
// require routers
const authRouter = require("./routes/auth");

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
app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

app.use("/", authRouter);

/*
const usersRouter = require("./routes/users"); // users resource
const postsRouter = require("./routes/posts"); // posts resource

app.use("/users", usersRouter);
app.use("/posts", postsRouter);
*/

// membership page route
app.get("/membership", (req, res) => {
  res.render("membership", { title: "Membership" });
});

// all posts page route
app.get("/posts", (req, res) => {
  res.render("posts", { title: "All Posts" });
});

// create posts page route
app.get("/create-post", (req, res) => {
  res.render("create-post", { title: "New Post" });
});

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
