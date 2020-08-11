const express = require("express");
const router = express.Router();
const Campground = require("../models/campgroundModel");

/* ==================== Campground Routes ==================== */
// Index - show campgrounds route
router.get("/", (req, res) => {
  // console.log(req.user);
  // get all campground from data base
  Campground.find({}, (err, campgrounds) => {
    if (err) {
      console.log(err);
    } else {
      // render the campgrounds
      res.render("campgrounds/campgrounds", {
        campgrounds: campgrounds,
        currentUser: req.user,
      });
    }
  });
});

// Create - post a new campground route
router.post("/", isLoggedIn, (req, res) => {
  // get data from form and add it to campground array
  const { name, image, description } = req.body;
  const author = {
    id: req.user._id,
    username: req.user.username,
  };
  // console.log(req.user);
  const newCampground = {
    name: name,
    image: image,
    description: description,
    author: author,
  };
  // create a new campground and save it to data base
  Campground.create(newCampground, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      // redirect back to campgrounds page
      // console.log(campground);
      res.redirect("/campgrounds");
    }
  });
});

// New - route for show post new campground page
router.get("/new", isLoggedIn, (req, res) => {
  res.render("campgrounds/newCampground");
});

// Show - Show info about one campground
router.get("/:id", (req, res) => {
  // find the campground with provided ID
  Campground.findById(req.params.id)
    .populate("comments")
    .exec((err, foundCampground) => {
      if (err) {
        console.log(err);
      } else {
        // console.log(foundCampground);
        // Render show template with that campground
        res.render("campgrounds/infoCampground", {
          campground: foundCampground,
        });
      }
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
