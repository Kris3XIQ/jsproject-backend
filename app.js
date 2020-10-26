/**
 * Express server | Backend project-API
 */

"use strict";
require('dotenv').config();

const port = 3070;
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, { origins: "*:*" });
module.exports = io;
const games = require("./products/products");
const stock = require("./models/stock.js");

const middleware = require("./middleware/index");
const routeHome = require("./routes/home");
const routeAccount = require("./routes/account");
const routeGames = require("./routes/games");

const cors = require("cors");

app.use(cors());
app.use(middleware.logIncomingToConsole);
app.use("/", routeHome);
app.use("/account", routeAccount);
app.use("/games", routeGames);


var game = "";
var ticks;
io.on("connect", function(socket) {
    socket.on("set game", (setgame) => {
        game = games.all.filter(x => x.url === setgame);
        if (game.length > 0) {
            ticks = setInterval(() => {
                game[0].price = stock.getProductStock(game[0]);
                io.emit("message", game[0]);
            }, 5000);
        }
    });
    socket.on("disconnect", function() {
        console.log("disconneccted from backend");
        clearInterval(ticks);
        game = "";
    })
});


/**
 * Log app details to console when starting up.
 *
 * @return {void}
 */
function logStartUpDetailsToConsole() {
    let routes = [];

    // Find what routes are supported
    app._router.stack.forEach((middleware) => {
        if (middleware.route) {
            // Routes registered directly on the app
            routes.push(middleware.route);
        } else if (middleware.name === "router") {
            // Routes added as router middleware
            middleware.handle.stack.forEach((handler) => {
                let route;

                route = handler.route;
                route && routes.push(route);
            });
        }
    });

    console.info(`Server is listening on port ${port}.`);
    console.info("Available routes are:");
    console.info(routes);
}

server.listen(port, logStartUpDetailsToConsole);
module.exports = server;
// server.listen(port, logStartUpDetailsToConsole);
// module.exports = io;
