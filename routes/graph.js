/**
 * Routes for me(homepage) me-api.
 */
"use strict";

const express = require("express");
const router = express.Router();
const stock = require("../models/stock.js");
const server = require("../app");
const io = require("socket.io")(server, { origins: "*:*" });

router.get("/graph", function(req, res) {
    // let games = require("../products/products");
    console.log("he")
        // io.on("connect", (socket) => {
        //     console.log("e")
        //     console.info("User connected serverLOG");
        //     console.info(games.all);
        //     socket.on("message", ({ games }) => {
        //         console.log(games);
        //         io.emit("message", { games });
        //     });
        // });
        // setInterval(() => {
        //     games.all.map((game) => {
        //         game["price"] = stock.getProductStock(game);
        //         return game;
        //     });
        //     io.emit("message", games.all[0]);
        // }, 5000);

    // res.json(games);
});

module.exports = router;
