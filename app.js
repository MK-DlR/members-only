// app.js

require("dotenv").config();

// imports
// core
const express = require("express");
const path = require("path");
// authentication
const session = require("express-session");
const passport = require("passport");
// database/postgreSQL
const pool = require("./db/pool");

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

/*
const authRouter = require("./routes/auth"); // authentication
const usersRouter = require("./routes/users"); // users resource
const postsRouter = require("./routes/posts"); // posts resource

app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/posts", postsRouter);
*/

// sign up form route
app.get("/sign-up", (req, res) => {
  res.render("sign-up", { title: "Sign Up" });
});

// sign-up handler — inserts a new user into the DB
app.post("/sign-up", async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await pool.query("INSERT INTO users (username, password) VALUES ($1, $2)", [
      req.body.username,
      hashedPassword,
    ]);
    res.redirect("/");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// verify password matches the repeat
app.post(
  "/sign-up",
  body("password").isLength({ min: 5 }),
  body("passwordConfirmation").custom((value, { req }) => {
    return value === req.body.password;
  }),
  (req, res) => {
    // Handle request
  }
);

// login page route
app.get("/log-in", (req, res) => {
  res.render("log-in", { title: "Log In" });
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
