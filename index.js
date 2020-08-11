/* ================================================ */
// IMPORT PACKAGES AND MODULES
/* ================================================ */
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const Campground = require("./models/campground");
const Comment = require("./models/comment");
const User = require("./models/user");
// const seedDB = require("./seeds");
const app = express();
const port = 3000;

// Import Routes
const campgroundRoutes = require("./routes/campgrounds");
const commentRoutes = require("./routes/comments");
const indexRoutes = require("./routes/index");

/* ================================================ */
// MONGOOSE CONFIGURATION
/* ================================================ */
// connect to mongodb
mongoose
  .connect("mongodb://localhost:27017/quriny-camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(err => {
    console.log(err.message);
  });

/* ================================================ */
// EXPRESS CONFIGURATION
/* ================================================ */
app.use(bodyParser.urlencoded({ extended: true })); // Use body parser module through the bodyParser variable
app.set("view engine", "ejs"); // Set Up ejs package to read ejs extension file
app.use(express.static(__dirname + "/public"));
// seedDB(); // Seedding the database

/* ================================================ */
// PASSPORT CONFIGURATION
/* ================================================ */
app.use(
  require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware to check if the user is logged in
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

/* ================================================ */
// ROUTES => Using all the routes that have been imported
/* ================================================ */
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

// TODO refactor isLoggedin middleware inside all of the routes

/* ==================== LISTENING TO THE SERVER ==================== */
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
