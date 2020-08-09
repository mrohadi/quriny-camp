/* ==================== IMPORT PACKAGES ==================== */
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const port = process.env.PORT || 3000;
const seedDB = require("./seeds.js");

// seedDB();

/* ==================== IMPORT MODULES ==================== */
const Campground = require("./models/campground");
const Comment = require("./models/campground");

/* ==================== EXPRESS CONFIGURATION ==================== */
// to parser the req.body data
app.use(bodyParser.urlencoded({ extended: true }));
// set the page, so we don't need to include .ejs in our render response
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

/* ==================== MONGOOSE ==================== */
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

/* ==================== ROUTES ==================== */
// root route
app.get("/", (req, res) => {
  res.render("home");
});
// Index - show campgrounds route
app.get("/campgrounds", (req, res) => {
  // get all campground from data base
  Campground.find({}, (err, campgrounds) => {
    if (err) {
      console.log(err);
    } else {
      // render the campgrounds
      res.render("campgrounds", { campgrounds: campgrounds });
    }
  });
});
// Create - post a new campground route
app.post("/campgrounds", (req, res) => {
  // get data from form and add it to campground array
  const { name, image, description } = req.body;
  const newCampground = { name: name, image: image, description: description };
  // create a new campground and save it to data base
  Campground.create(newCampground, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      // redirect back to campgrounds page
      res.redirect("/campgrounds");
    }
  });
});
// New - route for show post new campground page
app.get("/campgrounds/new", (req, res) => {
  res.render("newCampground");
});
// Show - Show info about one campground
app.get("/campgrounds/:id", (req, res) => {
  // find the campground with provided ID
  Campground.findById(req.params.id)
    .populate("comments")
    .exec((err, foundCampground) => {
      if (err) {
        console.log(err);
      } else {
        // Render show template with that campground
        res.render("infoCampground", { campground: foundCampground });
      }
    });
});

/* ==================== LISTENING TO THE SERVER ==================== */
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
