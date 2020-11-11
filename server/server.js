"use strict";

const express = require("express");//import express
const morgan = require("morgan"); // logging middleware
const dao = require("./dao/dao");
const userDao = require('./dao/userDao');
const jwt = require('express-jwt');
const jsonwebtoken = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const emailAPI = require('./emailAPI');
const bookingDao = require('./dao/bookingDao')
const jwtSecret = '123456789';
const expireTime = 300; //seconds

const app = express();
const port = 3001;


app.use(morgan("tiny"));// Set-up logging
app.use(express.json());// Process body content


app.get('/', (req, res) => {
    res.send('Hello SoftENG members!');
});

// LOGIN API
app.post('/users/authenticate', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username) {
        res.status(500).json({ error: 'Missing username' });
    }
    if (!password) {
        res.status(500).json({ error: 'Missing password' });
    }

    try {
        const user = await userDao.getUser(username, password);
        if (user === undefined) {
            res.status(401).send({ error: 'Invalid username' });
        }
        else {
            if (!userDao.checkPassword(user, password)) {
                res.status(401).send({ error: 'Invalid password' });
            }
            else {
                // AUTHENTICATION SUCCESS
                const token = jsonwebtoken.sign({ user: user.id }, jwtSecret, { expiresIn: expireTime });
                res.cookie('token', token, { httpOnly: true, sameSite: true, maxAge: 1000 * expireTime });
                res.status(200).json({ id: user.userID, name: user.username, accessLevel: user.accessLevel });
            }
        }

    }
    catch (error) {
        res.status(500).json({ msg: "Server error!" });
    }
});

app.use(cookieParser());

app.post('/logout', (req, res) => {
    res.clearCookie('token').end();
});

// For the rest of the code, all APIs require authentication
app.use(
    jwt({
        secret: jwtSecret,
        algorithms: ['RS256'],
        getToken: req => req.cookies.token
    })
);

//PLACE HERE ALL APIs THAT REQUIRE AUTHENTICATION

// DELETE A BOOKING 
app.delete('/deleteBooking/:bookingID', (req, res) => {
    const bookingID = req.params.bookingID;
    bookingDao.deleteBooking(bookingID)
        .then(() => res.status(204).end())
        .catch((err) => res.status(500).json({ error: 'Server error: ' + err }));
});

/////////////////////////////////////////////////////////////////////////////////////////////////
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});