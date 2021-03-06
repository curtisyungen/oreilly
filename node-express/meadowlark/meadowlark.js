var express = require("express");
var fortune = require("./lib/fortune.js");
var app = express();

// set up handlebars view engine
var handlebars = require("express-handlebars").create({
  defaultLayout: "main" // unless otherwise specified, main layout will be used for any view
});

app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");

app.set("port", process.env.PORT || 3000);

// middleware location
app.use(express.static(__dirname + "/public"));

// middleware to detect test in url query string
app.use(function(req, res, next) {
  res.locals.showTests =
    app.get("env") !== "production" && req.query.test === "1";
  next();
});

// routes
app.get("/", function(req, res) {
  res.render("home");
});

app.get("/about", function(req, res) {
  res.render("about", { fortune: fortune.getFortune() });
});

// custom 404 page
app.use(function(req, res, next) {
  res.status(404);
  res.render("404");
});

// custom 500 page
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500);
  res.render("500");
});

app.listen(app.get("port"), function() {
  console.log(
    "Express started on localhost:" +
      app.get("port") +
      "; press Ctrl + C to terminate."
  );
});
