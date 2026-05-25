const mongoose = require("mongoose");

const providerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },

        services: [
            {
                type: String,
            },
        ],

        monthlyQuota: {
            type: Number,
            default: 10,
        },

        usedQuota: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Provider", providerSchema);