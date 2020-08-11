const express = require("express");
const router = express.Router({ mergeParams: true }); // to get the req.params.id
const Campground = require("../models/campground");
const Comment = require("../models/comment");

/* ==================== Comments Routes ==================== */
// New - Show create new comment form
router.get("/new", isLoggedIn, (req, res) => {
  // find campground by id, and send that to the template
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/newComment", { campground: campground });
    }
  });
});

// Create - post a new comment on the campground
router.post("/", isLoggedIn, (req, res) => {
  // lookup campground  using ID
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      // console.log(req.body.comment);
      // create new comment
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          console.log(err);
        } else {
          // connect new comment to campground
          campground.comments.push(comment);
          campground.save();
          // redirect to the that campground
          res.redirect(`/campgrounds/${campground._id}`);
        }
      });
    }
    // console.log(campground);
  });
});

// Middleware authenticated
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/signin");
}

module.exports = router;
