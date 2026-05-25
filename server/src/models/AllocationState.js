const mongoose = require("mongoose");

const allocationStateSchema = new mongoose.Schema(
    {
        serviceType: {
            type: String,
            required: true,
            unique: true,
            enum: ["Service 1", "Service 2", "Service 3"],
        },

        currentIndex: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "AllocationState",
    allocationStateSchema
);