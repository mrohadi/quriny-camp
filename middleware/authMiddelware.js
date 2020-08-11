const Campground = require("../models/campgroundModel");
const Comment = require("../models/commentModel");

// All middleware
const middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function (req, res, next) {
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, (err, campground) => {
      if (err) {
        console.log(err);
        res.redirect("back");
      } else {
        // check is the user own the campground
        if (campground.author.id.equals(req.user._id)) {
          next();
        } else {
          // otherwise, redirect
          res.redirect("back");
        }
      }
    });
  } else {
    // if not, redirect
    res.redirect("back");
  }
};

middlewareObj.checkCommentOwnership = function (req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, comment) => {
      if (err) {
        console.log(err);
        res.redirect("back");
      } else {
        // check is the user own the comment
        if (comment.author.id.equals(req.user._id)) {
          next();
        } else {
          // otherwise, redirect
          res.redirect("back");
        }
      }
    });
  } else {
    // if not, redirect
    res.redirect("back");
  }
};

middlewareObj.isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/signin");
};

module.exports = middlewareObj;
