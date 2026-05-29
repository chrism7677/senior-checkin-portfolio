"use strict";

const express = require("express");
const router = express.Router();

const SeniorProfile = require("../models/SeniorProfile");

router.get("/login", (request, response) => {
  response.render("login", {
    errorMessage: null,
    formData: {}
  });
});


router.post("/login", async (request, response) => {

    const email = request.body.email;
    const password = request.body.password;
    const loginaction = request.body.loginaction;

    const user = await SeniorProfile.findOne({
        email: email,
        password: password
    });

    if (!user) {
        return response.status(401).render("login", {
        errorMessage: "Invalid login attempt.",
        formData: { email, loginaction }
        });
    }

    if (loginaction === "editprofile") {
        response.status(200).render("editProfile", { user });
    }
    if (loginaction === "alternatecheckin") {
        response.status(200).render("alternateCheckIn", { user });
    }
});

module.exports = router;