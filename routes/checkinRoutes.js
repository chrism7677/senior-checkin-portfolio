"use strict";


const express = require("express");
const router = express.Router();

const CheckIn = require("../models/CheckIn");


router.post("/alternateCheckIn", async (request, response) => {

    let alternateCheckInResult;
    let statusCode = 500; // Internal Server Error set as default

    const checkInInfo = {
        seniorId: request.body.originalId,
        status: request.body.checkintype,
        notes: request.body.checkInInformation
    };
    
    try {
        await CheckIn.findOneAndUpdate(
            { seniorId: checkInInfo.seniorId },
            {
                seniorId: checkInInfo.seniorId,
                checkInTime: new Date(),
                status: checkInInfo.status,
                notes: checkInInfo.notes
            },
            {
                upsert: true,
                returnDocument: "after"
            }
        );
        alternateCheckInResult = `
            <h2>Alternate check-in successful</h2>
            <a href="/">Return Home</a>
        `;
        statusCode = 200; // OK
    } catch (err) {
        console.log(err);
            alternateCheckInResult = `
            <h2>Error creating alternate check-in. Please try again.</h2>
            <a href="/">Return Home</a>
        `;
        statusCode = 500; // Internal Server Error, they logged in so an account should have been found, but something went wrong with the check-in creation or update.
    }
    response.status(statusCode).send(alternateCheckInResult);
});


module.exports = router;

