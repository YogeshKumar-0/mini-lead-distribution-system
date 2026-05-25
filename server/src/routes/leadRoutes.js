const express = require("express");

const {
    createLead,
} = require("../controllers/leadController");

const router = express.Router();

router.post("/create", createLead);

module.exports = router;