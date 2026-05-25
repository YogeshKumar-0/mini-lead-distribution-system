const express = require("express");

const {
    resetQuotaWebhook,
} = require("../controllers/webhookController");

const router = express.Router();

router.post("/reset-quota", resetQuotaWebhook);

module.exports = router;