const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },

        phone: {
            type: String,
            required: true,
        },

        city: {
            type: String,
            required: true,
        },

        serviceType: {
            type: String,
            required: true,
            enum: ["Service 1", "Service 2", "Service 3"],
        },

        description: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

leadSchema.index(
    {
        phone: 1,
        serviceType: 1,
    },
    {
        unique: true,
    }
);

module.exports = mongoose.model("Lead", leadSchema);