"use strict";

const express = require("express");
const router = express.Router();

const SeniorProfile = require("../models/SeniorProfile");
const CheckIn = require("../models/CheckIn");


router.get("/admin", async (request, response) => {

    try {
        const seniors = await SeniorProfile.find({});
        const checkIns = await CheckIn.find({});

        const checkInMap = new Map();

        checkIns.forEach(checkIn => {
            checkInMap.set(checkIn.seniorId.toString(), checkIn);
        });

        const adminRows = seniors.map(senior => {
            return {
                senior: senior,
                checkIn: checkInMap.get(senior._id.toString()) || null
            };
        });

        response.status(200).render("admin", { adminRows });
    } catch (err) {
        console.log(err);
        response.status(500).send(`
            <h2>Error retrieving check-ins. Please try again later.</h2>
            <a href="/">Return Home</a>
        `);
    }
});


router.post("/admin/clear-database", async (request, response) => {
    try {
        await CheckIn.deleteMany({});
        await SeniorProfile.deleteMany({});

        response.redirect("/admin");
    } catch (error) {
        console.log(error);
        response.status(500).send("Error clearing database");
    }
});


module.exports = router;

