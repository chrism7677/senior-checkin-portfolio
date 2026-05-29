const mongoose = require("mongoose");

const seniorProfileSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true,
        minlength: 4
    },

    phone: {
        type: String,
        required: true,
        match: /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/
    },

    contactName: {
        type: String,
        required: true
    },

    contactEmail: {
        type: String,
        required: true
    },

    contactPreference: {
        type: String,
        required: true,
        enum: ["phone", "text", "email"]
    }

});

module.exports = mongoose.model(
    "SeniorProfile",
    seniorProfileSchema
);