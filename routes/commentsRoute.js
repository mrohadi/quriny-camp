const express = require("express");
const router = express.Router({ mergeParams: true }); // to get the req.params.id
const Campground = require("../models/campgroundModel");
const Comment = require("../models/commentModel");
const middlewareObj = require("../middleware/authMiddelware");

/* ==================== Create Comment Route ==================== */
// New - Show create new comment form
router.get("/new", middlewareObj.isLoggedIn, (req, res) => {
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
router.post("/", middlewareObj.isLoggedIn, (req, res) => {
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
          req.flash('error', "Something went wrong!")
          console.log(err);
        } else {
          // add username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          // console.log(req.user);
          comment.save(); // save the comment
          // connect new comment to campground
          campground.comments.push(comment);
          campground.save();
          //   console.log(comment);
          req.flash('success', "Successfully added comment!")
          // redirect to the that campground
          res.redirect(`/campgrounds/${campground._id}`);
        }
      });
    }
    // console.log(campground);
  });
});

/* ==================== Edit Comment Route ==================== */
// Edit - Show edit comments form
router.get(
  "/:comment_id/edit",
  middlewareObj.checkCommentOwnership,
  (req, res) => {
    Comment.findById(req.params.comment_id, (err, comment) => {
      if (err) {
        res.redirect("back");
      } else {
        res.render("comments/editComment", {
          campground_id: req.params.id,
          comment: comment,
        });
      }
    });
  }
);

// Edit - Edit comment
router.put("/:comment_id", middlewareObj.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndUpdate(
    req.params.comment_id,
    req.body.comment,
    (err, updatedComment) => {
      if (err) {
        res.redirect("back");
      } else {
        res.redirect(`/campgrounds/${req.params.id}`);
      }
    }
  );
});

/* ==================== Delete Comment Route ==================== */
// Destroy - delete the comment
router.delete(
  "/:comment_id",
  middlewareObj.checkCommentOwnership,
  (req, res) => {
    // findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, err => {
      if (err) {
        res.redirect("back");
      } else {
        req.flash('success', 'Comment deleted!');
        res.redirect(`/campgrounds/${req.params.id}`);
      }
    });
  }
);

module.exports = router;
