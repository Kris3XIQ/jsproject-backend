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
