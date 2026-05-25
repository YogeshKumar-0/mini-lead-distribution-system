const Lead = require("../models/Lead");

const allocateLead = require("../services/allocationService");

const createLead = async (req, res) => {
    try {

        const {
            name,
            phone,
            city,
            serviceType,
            description,
        } = req.body;

        const lead = await Lead.create({
            name,
            phone,
            city,
            serviceType,
            description,
        });

        const assignedProviders =
            await allocateLead(lead);

        // SOCKET EMIT
        const io = req.app.get("io");

        io.emit("newLeadAssigned", {
            lead,
            assignedProviders,
        });

        res.status(201).json({
            success: true,
            message: "Lead Created Successfully",
            lead,
            assignedProviders,
        });

    } catch (error) {

        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message:
                    "This phone number already submitted this service request",
            });
        }

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    createLead,
};