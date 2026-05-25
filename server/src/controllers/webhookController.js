const Provider = require("../models/Provider");
const WebhookLog = require("../models/WebhookLog");

const resetQuotaWebhook = async (req, res) => {
    try {

        const { eventId } = req.body;

        const existingEvent =
            await WebhookLog.findOne({ eventId });

        if (existingEvent) {

            return res.status(200).json({
                success: true,
                message:
                    "Webhook already processed (idempotent)",
            });
        }

        await Provider.updateMany(
            {},
            {
                usedQuota: 0,
            }
        );

        await WebhookLog.create({
            eventId,
        });

        res.status(200).json({
            success: true,
            message:
                "Provider quotas reset successfully",
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    resetQuotaWebhook,
};