/* ================================================ */
// IMPORT PACKAGES AND MODULES
/* ================================================ */
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Campground = require("./models/campground");
const Comment = require("./models/comment");
const seedDB = require("./seeds");
const app = express();
const port = 3000;

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
// Use body parser module through the bodyParser variable
app.use(bodyParser.urlencoded({ extended: true }));
// Set Up ejs package to read ejs extension file
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

// Seedding the database
// seedDB();

/* ================================================ */
// ROUTES
/* ================================================ */
// Root route
app.get("/", (req, res) => {
  res.render("home");
});
/* ==================== Campground Routes ==================== */
// INDEX - Campgrounds route
app.get("/campgrounds", (req, res) => {
  // Get all campground from data base
  Campground.find({}, (err, allCampgrounds) => {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/campgrounds", { campgrounds: allCampgrounds });
    }
  });
});
// CREATE - Add new campground to campgrounds route
app.post("/campgrounds", (req, res) => {
  // Get data from form and add to campgrounds
  var name = req.body.name,
    image = req.body.image,
    desc = req.body.description,
    newCampground = { name: name, image: image, description: desc };
  // Create a new campground and save it to data base
  Campground.create(newCampground, (err, newlyCreated) => {
    if (err) {
      console.log(err);
    } else {
      // redirect back to campgrounds page
      res.redirect("/campgrounds");
    }
  });
});
// NEW - Display add new campground route
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/newCampground");
});
// SHOW - Show one campgorund with id for all the information of it
app.get("/campgrounds/:id", (req, res) => {
  // Find the campgorund with the provided id
  Campground.findById(req.params.id)
    .populate("comments")
    .exec((err, foundCampground) => {
      if (err) {
        console.log(err);
      } else {
        console.log(foundCampground);
        // Render show template with that campground
        res.render("campgrounds/infoCampground", {
          campground: foundCampground,
        });
      }
    });
});
// ==================== COMMENTS ROUTES ====================
app.get("/campgrounds/:id/comments/new", (req, res) => {
  // Find campground by Id
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/newComment", { campground: campground });
    }
  });
});
app.post("/campgrounds/:id/comments", (req, res) => {
  // Lookup campground using Id
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      // Create new comment
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          console.log(err);
        } else {
          // Connect new comment to campground data base
          campground.comments.push(comment);
          campground.save();
          // Redirect to campground show page
          res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  });
});

// ==================== LISTEN TO THE SERVER ====================
app.listen(port, () => {
  console.log("YalpCamp Server is Running");
});
