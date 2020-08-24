const express = require("express");
const router = express.Router();
const Campground = require("../models/campgroundModel");
const middleware = require("../middleware/authMiddelware");

/* ==================== Image Upload ==================== */
const multer = require('multer');
const storage = multer.diskStorage({
  filename: function (req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
const imageFilter = function (req, file, cb) {
  // accept image files only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};
const upload = multer({ storage: storage, fileFilter: imageFilter })

const cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: 'dzsucksxc',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/* ==================== Regex for search bar ==================== */
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

/* ==================== Campground Routes ==================== */
// Index - show all campgrounds route
router.get("/", (req, res) => {
  let noMatch = null;
  if (req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    // get all campground from data base
    Campground.find({ name: regex }, (err, campgrounds) => {
      if (err) {
        console.log(err);
      } else {
        if (campgrounds.length < 1) {
          noMatch = 'No campgrounds match!';
        }
        // render the campgrounds
        res.render("campgrounds/campgrounds", {
          campgrounds: campgrounds,
          currentUser: req.user,
          noMatch: noMatch
        });
      }
    });
  } else {
    // get all campground from data base
    Campground.find({}, (err, campgrounds) => {
      if (err) {
        console.log(err);
      } else {
        // render the campgrounds
        res.render("campgrounds/campgrounds", {
          campgrounds: campgrounds,
          currentUser: req.user,
          noMatch: noMatch
        });
      }
    });
  }
});

// Create - post a new campground route
router.post("/", middleware.isLoggedIn, upload.single('image'), function (req, res) {
  cloudinary.v2.uploader.upload(req.file.path, function (err, result) {
    if (err) {
      req.flash('error', err.message);
      return res.redirect('back');
    }
    // add cloudinary url for the image to the campground object under image property
    req.body.campground.image = result.secure_url;
    // add image's public_id to campground object
    req.body.campground.imageId = result.public_id;
    // add author to campground
    req.body.campground.author = {
      id: req.user._id,
      username: req.user.username
    }
    Campground.create(req.body.campground, function (err, campground) {
      if (err) {
        req.flash('error', err.message);
        return res.redirect('back');
      }
      res.redirect('/campgrounds/' + campground.id);
    });
  });
});

// Show - Show info about one campground
router.get("/:id", (req, res) => {
  // find the campground with provided ID
  Campground.findById(req.params.id)
    .populate("comments likes")
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

// Campground Like Route
router.post("/:id/like", middleware.isLoggedIn, function (req, res) {
  Campground.findById(req.params.id, function (err, foundCampground) {
    if (err) {
      console.log(err);
      return res.redirect("/campgrounds");
    }
    // check if req.user._id exists in foundCampground.likes
    var foundUserLike = foundCampground.likes.some(function (like) {
      return like.equals(req.user._id);
    });
    if (foundUserLike) {
      // user already liked, removing like
      foundCampground.likes.pull(req.user._id);
    } else {
      // adding the new user like
      foundCampground.likes.push(req.user);
    }
    foundCampground.save(function (err) {
      if (err) {
        console.log(err);
        return res.redirect("/campgrounds");
      }
      return res.redirect("/campgrounds/" + foundCampground._id);
    });
  });
});

/* ==================== Edit Campground Routes ==================== */
// Edit - Show edit campground form
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    res.render("campgrounds/editCampground", { campground: campground });
  });
});

// Update - Put the new campground
router.put("/:id", middleware.checkCampgroundOwnership, upload.single('image'), (req, res) => {
  // find and update the correct campground
  Campground.findById(req.params.id, async function (err, campground) {
    if (err) {
      req.flash("error", err.message);
      res.redirect("back");
    } else {
      // Check if the user want to change the image
      if (req.file) {
        try {
          // Delete the founded image
          await cloudinary.v2.uploader.destroy(campground.imageId);
          // Upload new image
          let result = await cloudinary.v2.uploader.upload(req.file.path);
          // Add cloudinary url to MongoDB 
          campground.imageId = result.public_id;
          campground.image = result.secure_url;
        } catch (err) {
          req.flash("error", err.message);
          return res.redirect("back");
        }
      }
      // Set the newest name from the form
      campground.name = req.body.name;
      // Set the newest description from the form
      campground.description = req.body.description;
      // Save the new campground to the database
      campground.save();
      req.flash("success", "Successfully Updated!");
      res.redirect("/campgrounds/" + campground._id);
    }
  });
});

/* ==================== Delete Campground Routes ==================== */
// Destroy campgrond route
router.delete('/:id', (req, res) => {
  Campground.findById(req.params.id, async (err, campground) => {
    if (err) {
      req.flash("error", err.message);
      return res.redirect("back");
    }
    try {
      await cloudinary.v2.uploader.destroy(campground.imageId);
      campground.remove();
      req.flash('success', 'Campground deleted successfully!');
      res.redirect('/campgrounds');
    } catch (err) {
      if (err) {
        req.flash("error", err.message);
        return res.redirect("back");
      }
    }
  });
});

module.exports = router;
