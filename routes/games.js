/**
 * Routes for me(homepage) me-api.
 */
"use strict";

const express = require("express");
const router = express.Router();
const games = require("../products/products");
const userFunc = require("../models/user");
const bodyParser = require("body-parser");

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var io = require("../app");

router.get("/", function(req, res) {
    res.json(games);
});

router.get("/:game/graph", function(req, res) {
    console.log(req.params.game);
})

router.post("/:game/buystock", function(req, res) {
    const stock = req.params.game;
    const price = req.body.price;
    const email = req.body.email;
    userFunc.updateFunds([email, (-price)], (err) => {
        if (err) {
            return res.status(500).send("Something on the serer went wrong");
        }
        userFunc.buyStock([email, stock, 1], (err) => {
            if (err) {
                return res.status(500).send("Something on the serer went wrong");
            }
        });
    });
})


router.get("/games/graph", function(req, res) {
    // console.log("hej")
    // io.on("connect", (socket) => {
    //     console.info("User connected serverLOG");
    //     socket.on("message", ({ games }) => {
    //         io.emit("message", { games });
    //     });
    //     setInterval(() => {
    //         games.all.map((game) => {
    //             game["price"] = stock.getProductStock(game);
    //             return game;
    //         });
    //         console.log("hej")
    //         io.emit("message", games.all[0]);
    //     }, 5000);
    // });
})

module.exports = router;
