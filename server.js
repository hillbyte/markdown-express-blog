const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
let app = express();
const HANDLEBARS = require("handlebars");
const moment = require("moment");
require("dotenv").config();

var MomentHandler = require("handlebars.moment");
MomentHandler.registerHelpers(HANDLEBARS);

//register handlebars helper for core js
HANDLEBARS.registerHelper("trimstring", (str) => {
  return str.slice(6);
});
// HANDLEBARS.registerHelper("dateFormat", function (date, options) {
//   const formatToUse =
//     (arguments[1] && arguments[1].hash && arguments[1].hash.format) ||
//     "DD/MM/YYYY";
//   return moment(date).format(formatToUse);
// });

//? mongodb conn
//let db_name = "mongodb://localhost:27017/nodejsblog";
let db_name = "";
mongoose.connect(
  process.env.DB_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) throw err;
    console.log("db connected");
  }
);
//*set default template engine into express app for renderring dynamic engine
app.set("view engine", "handlebars");
app.engine("handlebars", exphbs());

//? serving static file
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/node_modules"));

//*parse req body from form
app.use(express.urlencoded({ extended: true })); //build-in middleware
//html does not support put and delete that's why need method-override
app.use(methodOverride("_method"));
//*for home page
app.get("/", (req, res) => {
  // res.render("./home");
  res.redirect("/posts/fetch-post", 301, () => {});
});

//==all post call here
let post = require("./Routes/post");
app.use("/posts", post);
app.listen(process.env.PORT || 8000, (err) => {
  if (err) throw err;
  console.log("Server at 8000");
});
