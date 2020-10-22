/**
 * Models handling the CRUD elements of the database, including users.
 */
"use strict";

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./db/texts.sqlite");

const verifyUser = (email, cb) => {
    return db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, row) => {
        cb(err, row);
    });
};

const createAccount = (user, cb) => {
    return db.run('INSERT INTO users (name, email, password) VALUES (?,?,?)', user, (err) => {
        cb(err);
    });
};

module.exports = {
    verifyUser: verifyUser,
    createAccount: createAccount
};
