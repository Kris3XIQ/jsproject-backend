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

const verifyUserFunds = (email, cb) => {
    return db.get(`SELECT * FROM funds WHERE email = ?`, [email], (err, row) => {
        cb(err, row);
    });
}

const updateFunds = (funds, cb) => {
    return db.run('INSERT INTO funds (email, currency) VALUES (?,?)', funds, (err) => {
        cb(err);
    });
}

const getFunds = (email, cb) => {
    return db.get(`SELECT SUM(currency) AS currency FROM funds WHERE email = ?`, [email], (err, row) => {
        cb(err, row);
    });
};

const getCOD = (email, cb) => {
    return db.get(`SELECT stock, sum(amount) AS amount FROM stocks WHERE stock = "callofdutycw" AND email = ?;`, [email], (err, row) => {
        cb(err, row);
    });
};
const getCyberpunk = (email, cb) => {
    return db.get(`SELECT stock, sum(amount) AS amount FROM stocks WHERE stock = "cyberpunk2077" AND email = ?;`, [email], (err, row) => {
        cb(err, row);
    });
};
const getNW = (email, cb) => {
    return db.get(`SELECT stock, sum(amount) AS amount FROM stocks WHERE stock = "newworld" AND email = ?;`, [email], (err, row) => {
        cb(err, row);
    });
};
const getD2 = (email, cb) => {
    return db.get(`SELECT stock, sum(amount) AS amount FROM stocks WHERE stock = "destiny2" AND email = ?;`, [email], (err, row) => {
        cb(err, row);
    });
};
const getStellaris = (email, cb) => {
    return db.get(`SELECT stock, sum(amount) AS amount FROM stocks WHERE stock = "stellaris" AND email = ?;`, [email], (err, row) => {
        cb(err, row);
    });
};
const getWoW = (email, cb) => {
    return db.get(`SELECT stock, sum(amount) AS amount FROM stocks WHERE stock = "wow" AND email = ?;`, [email], (err, row) => {
        cb(err, row);
    });
};

// const updateFunds = (funds, cb) => {
//     let ph01 = funds[0];
//     let ph02 = funds[1];
//     console.log(ph01);
//     console.log(ph02);
//     // console.log(`${test.funds}`);
//     return db.run(`UPDATE funds SET currency = currency + ? = WHERE email LIKE ?`, funds, (err) => {
//         cb(err);
//     });
// }

const buyStock = (stocks, cb) => {
    return db.run('INSERT INTO stocks (email, stock, amount) VALUES (?,?,?)', stocks, (err) => {
        cb(err);
    });
}

const getStocks = (email, cb) => {
    return db.all(`SELECT * FROM stocks WHERE email = ?`, [email], (err, rows) => {
        cb(err, rows);
    });
}

module.exports = {
    verifyUser: verifyUser,
    createAccount: createAccount,
    updateFunds: updateFunds,
    getFunds: getFunds,
    buyStock: buyStock,
    getStocks: getStocks,
    getCOD: getCOD,
    getCyberpunk: getCyberpunk,
    getNW: getNW,
    getD2: getD2,
    getStellaris: getStellaris,
    getWoW: getWoW,
    verifyUserFunds: verifyUserFunds
};
