const mongoose = require("mongoose");

const checkInSchema = new mongoose.Schema({
    seniorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SeniorProfile",
        required: true,
        unique: true
    },    
    checkInTime: {
        type: Date,
        default: Date.now
    },

    status: {
        type: String,
        required: true,
        enum: [
            "informational",
            "alert",
            "emergency"
        ]
    },
    notes: String
});

module.exports = mongoose.model(
    "CheckIn",
    checkInSchema
);

