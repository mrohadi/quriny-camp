/* ==================== IMPORT PACKAGES ==================== */
const express = require("express");
const bodyParser = require('body-parser');
// const path = require('path');
// const favicon = require('express-favicon');
const app = express();
const port = process.env.PORT || 3000;

/* ==================== EXPRESS CONFIGURATION ==================== */
// to parser the req.body data 
app.use(bodyParser.urlencoded({ extended: true }));
// set the page, so we don't need to include .ejs in our render response
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

/* ==================== ROUTES ==================== */
const campgrounds = [
  {
    name: "Salmon Creek",
    image:
      "https://images.unsplash.com/photo-1471115853179-bb1d604434e0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
  },
  {
    name: "Granit Heel",
    image:
      "https://images.unsplash.com/photo-1471115853179-bb1d604434e0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
  },
  {
    name: "Mountain Rest",
    image:
      "https://images.unsplash.com/photo-1471115853179-bb1d604434e0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
  },
];

// root route
app.get("/", (req, res) => {
  res.render("home");
});
// show campgrounds route
app.get("/campgrounds", (req, res) => {
  res.render("campgrounds", { campgrounds: campgrounds });
});
// post a new campground route
app.post('/campgrounds', (req, res) => {
  // get data from form and add it to campground array
  const { name, image } = req.body
  const newCampground = { name: name, image: image };
  campgrounds.push(newCampground);
  // redirect back to campgrounds page
  res.redirect('/campgrounds')
})
// route for show post new campground page
app.get('/campgrounds/new', (req, res) => {
  res.render('newCampground');
})

/* ==================== LISTENING TO THE SERVER ==================== */
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
