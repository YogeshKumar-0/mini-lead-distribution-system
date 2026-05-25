const Provider = require("../models/Provider");
const Assignment = require("../models/Assignment");

const getDashboardData = async (req, res) => {
    try {

        const providers = await Provider.find();

        const dashboardData = [];

        for (const provider of providers) {

            const assignments = await Assignment.find({
                providerId: provider._id,
            }).populate("leadId");

            dashboardData.push({
                providerId: provider._id,
                providerName: provider.name,

                monthlyQuota: provider.monthlyQuota,

                usedQuota: provider.usedQuota,

                remainingQuota:
                    provider.monthlyQuota -
                    provider.usedQuota,

                leadsReceived: assignments.length,

                assignedLeads: assignments,
            });
        }

        res.status(200).json({
            success: true,
            dashboardData,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    getDashboardData,
};