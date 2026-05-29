/*
Christopher Miller - Final Project - Website for the Senior Check-In App 
app.js: Express app only
*/


const express = require("express");
const path = require("path");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "templates"));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// routes
app.use("/", require("./routes/signupRoutes"));
app.use("/", require("./routes/loginRoutes"));
app.use("/", require("./routes/editprofileRoutes"));
app.use("/", require("./routes/checkinRoutes"));
app.use("/", require("./routes/adminRoutes"));

app.get("/", (req, res) => {
  res.render("index");
});

module.exports = app;

