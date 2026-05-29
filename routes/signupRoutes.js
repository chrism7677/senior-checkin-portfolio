"use strict";

const express = require("express");
const router = express.Router();

const SeniorProfile = require("../models/SeniorProfile");


router.get("/signup", (request, response) => {
  response.render("signup");
});


router.post("/signup", async (request, response) => {

    const appInfo = {
        name: request.body.name,
        email: request.body.email,
        password: request.body.password,
        phone: request.body.phone,
        contactName: request.body.careCircleName,
        contactEmail: request.body.careCircleEmail,
        contactPreference: request.body.delivery
    };    

    let signupResult;
    let statusCode = 500; // Internal Server Error set as default

    try {
        /* API usage requirement, use the disify API to check if the email is disposable before creating the account */
        const apiResponse = await fetch(`https://disify.com/api/email/${appInfo.email}`)
        if (!apiResponse.ok) {
            throw new Error("Disify API request failed");
        }
        const emailData = await apiResponse.json();

        if (!emailData.disposable && emailData.format !== false) {
            const profile = new SeniorProfile(appInfo);
            await profile.save();
            statusCode = 201; // Created
            signupResult = `
                <section class="result-box success-message">
                    <h2>Account successfully created.</h2>
                    <div>Email address: ${appInfo.email}</div>

                    <h3>Email validation result:</h3>
                    <ul>
                        <li>Format: ${emailData.format}</li>
                        <li>Domain: ${emailData.domain}</li>
                        <li>Disposable: ${emailData.disposable}</li>
                        <li>DNS: ${emailData.dns}</li>
                        <li>WhiteList: ${emailData.whitelist}</li>
                        <li>Confidence: ${emailData.confidence}</li>
                        <li>Free: ${emailData.free}</li>
                    </ul>
                </section>
            `;

        } else {
            signupResult = `
                <section class="result-box error-message">
                    <h2>Account not created.</h2>
                    <div>The email address ${appInfo.email} was detected as disposable or invalid.</div>
                    <div>Please use a non-disposable email address to sign up.</div>

                    <h3>Email validation result:</h3>
                    <ul>
                        <li>Format: ${emailData.format}</li>
                        <li>Domain: ${emailData.domain}</li>
                        <li>Disposable: ${emailData.disposable}</li>
                        <li>DNS: ${emailData.dns}</li>
                        <li>WhiteList: ${emailData.whitelist}</li>
                        <li>Confidence: ${emailData.confidence}</li>
                        <li>Free: ${emailData.free}</li>
                    </ul>
                </section>
            `;
            statusCode = 400; // Bad Request
        }
    } catch (err) {
        console.log(err);
        
        if (err.code === 11000) {
            signupResult = `
                <section class="result-box error-message">
                    <h2>Email address already registered.</h2>

                    <div>
                        Please sign up with a different email address.
                    </div>
                </section>
            `;
            statusCode = 409; // Conflict
        } else if (err.name === "ValidationError") {
            signupResult = `
                <h2>Invalid phone number format. Please use format 123-456-7890.</h2>
            `;
            statusCode = 400;
        } else {
            signupResult = `
                <h2>Error creating account.</h2>
            `;
            statusCode = 500; // Internal Server Error
        }
    }
    response.status(statusCode).render("signupUpdateResult", {result: signupResult});
});


module.exports = router;

