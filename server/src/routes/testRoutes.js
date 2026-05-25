const express = require("express");

const {
    generateBulkLeads,
} = require("../controllers/testController");

const router = express.Router();

router.post(
    "/generate-bulk-leads",
    generateBulkLeads
);

module.exports = router;