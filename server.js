/*
Christopher Miller - Final Project - Website for the Senior Check-In App 
server.js: Production Startup: Connect to MongoDB Atlas and start Express server
*/


require("dotenv").config();

const mongoose = require("mongoose");
const app = require("./app");
const SeniorProfile = require("./models/SeniorProfile");

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_CONNECTION_STRING);

    await SeniorProfile.init();

    console.log("MongoDB connection successful");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error("Startup failed:", err);
    process.exit(1);
  }
}

startServer();

