const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/userModel");

/* ==================== Root Route ==================== */
router.get("/", (req, res) => {
  res.render("home");
});

/* ==================== Users Authenticated Routes ==================== */
// Show - show user sign up form
router.get("/signup", (req, res) => {
  res.render("users/signUp");
});

// Create - post(create) a new user
router.post("/signup", (req, res) => {
  let newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      // console.log(err);
      req.flash('error', err.message);
      return res.render("users/signUp");
    }
    passport.authenticate("local")(req, res, () => {
      req.flash('success', 'Welcome to QurinyCamp! ' + user.username);
      res.redirect("/campgrounds");
    });
  });
});

// Show - show user sign in form
router.get("/signin", (req, res) => {
  res.render("users/signIn");
});

// Signin
router.post(
  "/signin",
  passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/signin",
  }),
  (req, res) => { }
);

// Logout
router.get("/logout", (req, res) => {
  req.logout();
  req.flash('success', "Logged out!")
  res.redirect("/");
});

module.exports = router;
