"use strict";

const express = require("express");
const router = express.Router();

const SeniorProfile = require("../models/SeniorProfile");


router.post("/editprofile", async (request, response) => {

    const appInfo = {
        name: request.body.name,
        email: request.body.email,
        password: request.body.password,
        phone: request.body.phone,
        contactName: request.body.careCircleName,
        contactEmail: request.body.careCircleEmail,
        contactPreference: request.body.delivery
    }; 

    let updateProfileResult;
    let statusCode = 500; // Internal Server Error set as default

    try {
        /* API usage requirement, use the disify API to check if the email is disposable before updating the account */
        const apiResponse = await fetch(`https://disify.com/api/email/${appInfo.email}`)
        if (!apiResponse.ok) {
            throw new Error("Disify API request failed");
        }
        const emailData = await apiResponse.json();

        if (!emailData.disposable && emailData.format !== false) {
            const result = await SeniorProfile.updateOne( 
                { email: request.body.originalEmail },
                {
                    name: appInfo.name,
                    email: appInfo.email,
                    password: appInfo.password,
                    phone: appInfo.phone,
                    contactName: appInfo.contactName,
                    contactEmail: appInfo.contactEmail,
                    contactPreference: appInfo.contactPreference
                }
            );

            if (result.matchedCount === 0) {
                updateProfileResult = "<h2>No account was found to update.</h2>";
                statusCode = 500; // Internal Server Error, user logged in so an account should have been found.
            }
            else if (result.modifiedCount === 0) {
                updateProfileResult = "<h2>Account found, but no information changed.</h2>";
                statusCode = 200; // No changes were made, but the request was successful and the account exists.
            }
            else {
                statusCode = 200; // Updated
                updateProfileResult = `
                    <section class="result-box success-message">
                        <h2>Account successfully updated.</h2>
                        <div>
                            This includes the new or existing email address passing the validation request:
                            ${appInfo.email}
                        </div>
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
            }
        } else {
                updateProfileResult = `
                    <section class="result-box error-message">
                        <h2>Account not updated.</h2>
                        <div>The email address ${appInfo.email} was detected as disposable.</div>
                        <div>Please use a non-disposable email address to update your account.</div>
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
        }
    } catch (err) {
        console.log(err);
        
        if (err.code === 11000) {
            updateProfileResult = `
                <section class="result-box error-message">
                    <h2>Email address already registered.</h2>
                    <div>Please update your account with a different email address.</div>
                </section>
            `;
            statusCode = 409; // Conflict
        } else if (err.name === "ValidationError") {
            updateProfileResult = `
                <h2>Invalid phone number format. Please use format 123-456-7890.</h2>
            `;
            statusCode = 400;
        } else {
            updateProfileResult = "<h2>Error updating account</h2>";
            statusCode = 500; // Internal Server Error
        }
    }
    response.status(statusCode).render("signupUpdateResult", {result: updateProfileResult});
});


module.exports = router;

