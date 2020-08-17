/* ================================================ */
// IMPORT PACKAGES AND MODULES
/* ================================================ */
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const methodOverride = require("method-override");
const dotenv = require('dotenv').config();
const User = require("./models/userModel");
const app = express();
const PORT = process.env.PORT || 5000;
// const seedDB = require("./seeds");


// Import Routes
const campgroundRoutes = require("./routes/campgroundsRoute");
const commentRoutes = require("./routes/commentsRoute");
const indexRoutes = require("./routes/indexRoute");

/* ================================================ */
// MONGOOSE CONFIGURATION
/* ================================================ */
// connect to mongodb

mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
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
app.use(methodOverride("_method"));
app.use(flash());
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
app.locals.moment = require('moment');

// Middleware to check if the user is logged in
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

/* ================================================ */
// ROUTES => Using all the routes that have been imported
/* ================================================ */
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

/* ==================== LISTENING TO THE SERVER ==================== */
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
