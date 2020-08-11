/* ================================================ */
// IMPORT PACKAGES AND MODULES
/* ================================================ */
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const Campground = require("./models/campground");
const Comment = require("./models/comment");
const User = require("./models/user");
// const seedDB = require("./seeds");
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
// PASSPORT CONFIGURATION
/* ================================================ */
app.use(
  require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware to check if the user is logged in
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

/* ================================================ */
// ROUTES
/* ================================================ */
// root route
app.get("/", (req, res) => {
  res.render("home");
});

/* ==================== Campground Routes ==================== */
// Index - show campgrounds route
app.get("/campgrounds", (req, res) => {
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
  res.render("campgrounds/newCampground");
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
        // console.log(foundCampground);
        // Render show template with that campground
        res.render("campgrounds/infoCampground", {
          campground: foundCampground,
        });
      }
    });
});

/* ==================== Comments Routes ==================== */
// New - Show create new comment form
app.get("/campgrounds/:id/comments/new", isLoggedIn, (req, res) => {
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
app.post("/campgrounds/:id/comments", isLoggedIn, (req, res) => {
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

/* ==================== Users Routes ==================== */
// Show - show user sign up form
app.get("/signup", (req, res) => {
  res.render("users/signUp");
});
// Create - post(create) a new user
app.post("/signup", (req, res) => {
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
app.get("/signin", (req, res) => {
  res.render("users/signIn");
});
// Signin
app.post(
  "/signin",
  passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/signin",
  }),
  (req, res) => {}
);
// Logout
app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

// Middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/signin");
}

/* ==================== LISTENING TO THE SERVER ==================== */
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
