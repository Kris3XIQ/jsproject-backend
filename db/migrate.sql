CREATE TABLE IF NOT EXISTS users (
    id integer PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(60) NOT NULL,
    UNIQUE(email)
);

CREATE TABLE IF NOT EXISTS funds (
    id integer PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    currency INT(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS stocks (
    id integer PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    stock VARCHAR(255) NOT NULL,
    amount INT(50) NOT NULL
);

