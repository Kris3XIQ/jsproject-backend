/**
 * Routes for me(homepage) me-api.
 */
"use strict";

const express = require("express");
const router = express.Router();

router.get("/", function(req, res) {
    const data = {
        creator: "Kristoffer",
        origin: "Stockholm",
        text: "Test"
    };

    res.json(data);
});

module.exports = router;
