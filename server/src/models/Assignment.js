const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
    {
        leadId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Lead",
            required: true,
        },

        providerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Provider",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

assignmentSchema.index(
    {
        leadId: 1,
        providerId: 1,
    },
    {
        unique: true,
    }
);

module.exports = mongoose.model("Assignment", assignmentSchema);