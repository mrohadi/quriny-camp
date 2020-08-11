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
      console.log(err);
      return res.render("users/signUp");
    }
    passport.authenticate("local")(req, res, () => {
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
  (req, res) => {}
);

// Logout
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

// Middleware authenticated
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/signin");
}

module.exports = router;
