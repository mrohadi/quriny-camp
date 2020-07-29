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

|  Naem  |      Path      | HTTP Verb |                    Description                     |
| :----: | :------------: | :-------: | :------------------------------------------------: |
| INDEX  |     /dogs      |    GET    |             Display a list of all dog              |
|  NEW   |   /dogs/new    |    GET    |          Dispaly a form to make a new dog          |
| CREATE |     /dogs      |   POST    |              Add new dog to data base              |
|  SHOW  |   /dogs/:id    |    GET    |              Show info about one dog               |
|  EDIT  | /dogs/:id/edit |    GET    |             Show edit form for one dog             |
| UPDATE |   /dogs/:id    |    PUT    | Update a particular dog, and redirect to somewhere |
| DELETE |   /dogs/:id    |   DELTE   | Delte a particular dog, and redirect to somewhere  |
