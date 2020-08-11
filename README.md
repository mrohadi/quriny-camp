# Quriny Camp

This app is providing a camp ground, so the use can search some of campground they likes. This app using Node.js with express framework for writing server, and mongodb by using mongoose library for the data base. EJS was used for making the all of pages in this app.

### V1

- Installing express and ejs
- Adding landing page (home page)
- Adding campground page that lists all of campgrounds
- Create header and footer templates. In views directory make a new directory named templates
- Add bootstrap
- Setup new campground POST route
- Add in body-parser to our application
- Setup route to show form
- Add basic unstyled form
- Add a better header/title
- Make campgrounds page display a grid
- Add a navbar to all templates
- Style the new campground form

### V2

- Install and configurate mongoose
- Setup campground model
- Use campground model inside of our route
- Add description to our campground model
- Show db.collections.drop()
- Add a new route/template

> RESTFUL ROUTES

In RESTFul routes, order is really matter

|  Naem  |         Path          | HTTP Verb |                        Description                        |
| :----: | :-------------------: | :-------: | :-------------------------------------------------------: |
| INDEX  |     /campgrounds      |    GET    |             Display a list of all campground              |
|  NEW   |   /campgrounds/new    |    GET    |          Dispaly a form to make a new campground          |
| CREATE |     /campgrounds      |   POST    |              Add new campground to data base              |
|  SHOW  |   /campgrounds/:id    |    GET    |              Show info about one campground               |
|  EDIT  | /campgrounds/:id/edit |    GET    |             Show edit form for one campground             |
| UPDATE |   /campgrounds/:id    |    PUT    | Update a particular campground, and redirect to somewhere |
| DELETE |   /campgrounds/:id    |   DELTE   | Delte a particular campground, and redirect to somewhere  |

### V3

- Create a models directory
- Use module.exports
- Require everything correctly

### V4

- Add the comment new and create route
- Add new comment form
- Add campgrounds and comments directory and repair the file path
- Using new strategy to group element inside form => name = "comment[text]"

### v5

- Add sidebar to info campground page
- Styling the page

### v6

- Add user authentication
