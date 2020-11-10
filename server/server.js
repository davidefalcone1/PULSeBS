"use strict";

const express = require("express");//import express
const morgan = require("morgan"); // logging middleware
const dao = require("./dao/dao");
const userDao = require('./dao/userDao');
const lessonsDao = require('./dao/lessonDao');
const app = express();
const port = 3001;


app.use(morgan("tiny"));// Set-up logging
app.use(express.json());// Process body content


app.get('/', (req, res) => {
    res.send('Hello SoftENG members!');
});

// LOGIN API
app.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if(!username){
        res.status(500).json({ error: 'Missing username'});
    }
    if(!password){
        res.status(500).json({ error: 'Missing password'});   
    }

    try {
        const user = await userDao.getUser(username, password);
        if(user === undefined){
            res.status(404).send({error: 'Invalid username'});
        }
        else {
            if (!userDao.checkPassword(user, password)) {
                res.status(401).send({error: 'Invalid password'});
            }
            else {
                res.status(200).json({ username: user.username, accessLevel: user.accessLevel });
            }
        }
        
    }
    catch (error) {
        res.status(500).json({ msg: "Server error!" });
    }
});
// API for get bookable lectures for a given student
app.get('/lectures', async (req, res) => {
    try{
        const result = await lessonsDao.getAvailableLessons(req.user);
        res.json(result);
    }
    catch(e){
        res.status(505).end();
    }
});
// API for retrieve lessons booked by a student
app.get('/myLessons', async(req, res)=>{
    try{
        const result = await lessonsDao.getLessons(req.user);
        res.json(result);
    }
    catch(e){
        res.status(505).end();
    }
});

/////////////////////////////////////////////////////////////////////////////////////////////////
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});