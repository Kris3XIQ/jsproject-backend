/**
 * Routes for users me-api.
 */
"use strict";
const SECRET_KEY = process.env.SECRET_KEY;

const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userFunc = require("../models/user");

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get("/", (req, res) => {
    data = {
        "name": "HEJ"
    };
    res.send(data);
});

router.post("/checkbalance", (req, res) => {
    const email = req.body.email;
    userFunc.getFunds([email], (err, funds) => {
        if (err) {
            return res.status(500).send("Something on the serer went wrong");
        }
        res.status(200)
            .send(funds);
    });
});

router.post("/getfunds", (req, res) => {
    const email = req.body.email;
    var accountInfo = {
        "funds": "",
        "stocks": {},
        "cod": {},
        "cyberpunk": {},
        "d2": {},
        "nw": {},
        "stellaris": {},
        "wow": {}
    };
    userFunc.getFunds([email], (err, funds) => {
        if (err) {
            return res.status(500).send("Something on the serer went wrong");
        }
        accountInfo.funds = funds;
        userFunc.getStocks([email], (err, stocks) => {
            if (err) {
                return res.status(500).send("Something on the serer went wrong");
            }
            accountInfo.stocks = stocks;
            userFunc.getCOD([email], (err, codInfo) => {
                if (err) {
                    return res.status(500).send("Something on the serer went wrong");
                }
                accountInfo.cod = codInfo;
                userFunc.getCyberpunk([email], (err, cyberpunkInfo) => {
                    if (err) {
                        return res.status(500).send("Something on the serer went wrong");
                    }
                    accountInfo.cyberpunk = cyberpunkInfo;
                    userFunc.getD2([email], (err, d2Info) => {
                        if (err) {
                            return res.status(500).send("Something on the serer went wrong");
                        }
                        accountInfo.d2 = d2Info;
                        userFunc.getNW([email], (err, nwInfo) => {
                            if (err) {
                                return res.status(500).send("Something on the serer went wrong");
                            }
                            accountInfo.nw = nwInfo;
                            userFunc.getStellaris([email], (err, stellarisInfo) => {
                                if (err) {
                                    return res.status(500).send("Something on the serer went wrong");
                                }
                                accountInfo.stellaris = stellarisInfo;
                                userFunc.getWoW([email], (err, wowInfo) => {
                                    if (err) {
                                        return res.status(500).send("Something on the serer went wrong");
                                    }
                                    accountInfo.wow = wowInfo;
                                    res.status(200)
                                        .send(accountInfo);
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});

router.post("/addfunds", (req, res) => {
    const email = req.body.email;
    const funds = req.body.funds;
    userFunc.verifyUserFunds(email, (err, userFunds) => {
        if (err) {
            return res.status(500).send("Something on the server went wrong!");
        }
        userFunc.updateFunds([email, funds], (err) => {
            if (err) {
                return res.status(500).send("Something on the serer went wrong");
            }
        });
    });
});

router.post("/sellstock", (req, res) => {
    const email = req.body.email;
    const stock = req.body.stock;
    const funds = req.body.price;
    // userFunc.verifyUserFunds(email, (err, userFunds) => {
    //     if (err) {
    //         return res.status(500).send("Something on the server went wrong!");
    //     }
    //     console.log("VERIFY")
    userFunc.updateFunds([email, funds], (err) => {
        if (err) {
            return res.status(500).send("Something on the serer went wrong");
        }
        userFunc.verifyUserStocks([email, stock], (err, row) => {
            if (err) {
                return res.status(500).send("Something on the serer went wrong");
            }
            console.log(row);
            userFunc.sellStock([email, stock, -1], (err) => {
                if (err) {
                    return res.status(500).send("Something on the serer went wrong");
                }
                return res.status(200);
            });
        });
    });
    // });
});

router.get("/register", (req, res) => {
    let response = "Not logged in";

    if (req.cookies.accessToken == "true") {
        response = "Yup! You're logged in";
    }
    res.send(response);
});

router.post("/register", (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = bcrypt.hashSync(req.body.password);

    // Call createAccount function to register a new account
    userFunc.createAccount([name, email, password], (err) => {
        if (err) {
            return res.status(500).send("Something on the server went wrong!");
        }
        userFunc.verifyUser(email, (err, user) => {
            if (err) {
                return res.status(500).send("Something on the server went wrong!");
            }
            const expiresIn = 24 * 60 * 60;
            const accessToken = jsonwebtoken.sign({ id: user.id }, SECRET_KEY, {
                expiresIn: expiresIn
            });

            // Everything went through, send OK status
            res.status(200)
                .cookie("accessToken", accessToken, { maxAge: expiresIn, httpOnly: true })
                .send({
                    "user": user,
                    "access_token": accessToken,
                    "expires_in": expiresIn,
                    "accessToken": accessToken
                });
        });
    });
});

router.get("/login", (req, res) => {
    let response = "Not logged in";

    if (req.cookies.accessToken == "true") {
        response = "Yup! You're logged in";
    }
    res.send(response);
});

router.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    userFunc.verifyUser(email, (err, user) => {
        if (err) {
            return res.status(500).send("Something on the server went wrong!");
        }
        // If user doesnt exist in the database
        if (!user) {
            return res.status(404).send("User doesnt exist!");
        }
        const compare = bcrypt.compareSync(password, user.password);

        // Compare password with the registered account, throw 401 if it doesnt
        if (!compare) {
            return res.status(401).send("Password doesnt match!");
        }
        const expiresIn = 24 * 60 * 60;
        const accessToken = jsonwebtoken.sign({ id: user.id }, SECRET_KEY, {
            expiresIn: expiresIn
        });

        // Everything went through, send OK status
        res.cookie("accessToken", accessToken, { httpOnly: true });
        res.status(200)
            .cookie("accessToken", accessToken, { maxAge: expiresIn, httpOnly: true })
            .send({ "user": user, "access_token": accessToken, "expires_in": expiresIn });
    });
});

module.exports = router;
