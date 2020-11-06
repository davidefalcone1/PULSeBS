"use strict";

const express = require("express");//import express
const morgan = require("morgan"); // logging middleware
const dao = require("./dao/dao.js");

const app = express();
const port = 3001;


app.use(morgan("tiny"));// Set-up logging
app.use(express.json());// Process body content


app.get('/', (req, res) => {
    res.send('Hello SoftENG members!');
});

app.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    try {
        const user = await dao.login(username, password);
        res.status(200).json({ user });
    }
    catch (e) {
        res.status(500).json({ msg: "Invalid Login!" });
    }
});


/////////////////////////////////////////////////////////////////Ticket APIs
app.get('/tickets', async (req, res) => {
    try {
        const tickets = await dao.getAllTickets();
        res.status(200).json({ ticketsList: tickets });
    }
    catch (err) {
        res.status(500).json({ msg: "Service listing error!" });
    }
});

app.post('/tickets', async (req, res) => {
    const SERVICE_ID = req.body.SERVICE_ID;
    try {
        const maxTicketNumber = await dao.findMaxTicketNumber();
        const queueLenght = await dao.calculateQueueLength(SERVICE_ID);
        const TICKET_NUMBER = maxTicketNumber + 1;
        const result = await dao.createTicket(TICKET_NUMBER, SERVICE_ID);

        res.status(200).json({ recoredId: result, ticketNumber: TICKET_NUMBER, queueLenght: queueLenght });
    }
    catch (err) {
        res.status(500).json({ msg: "Ticket generation error!" });
    }
});

app.put('/tickets/:id', async (req, res) => {
    const TICKET_ID = req.params.id;
    const COUNTER_ID = req.body.COUNTER_ID;
    try {
        const ticket = await dao.getTicketById(TICKET_ID);
        if (!ticket)
            res.status(404).json({ msg: "Ticket id not found!" });
        else {
            await dao.terminateTicket(TICKET_ID);
            res.status(200).json({ msg: "Ticket is updated!" });
        }
    }
    catch (err) {
        res.status(500).json({ msg: "Update ticket error!" });
    }
});

/////////////////////////////////////////////////////////////////Service APIs
app.get('/services', async (req, res) => {
    try {
        const services = await dao.getAllServices();
        res.status(200).json({ servicesList: services });
    }
    catch (err) {
        res.status(500).json({ success: err, msg: "Service listing error!" });
    }
});

/////////////////////////////////////////////////////////////////Counters APIs
app.get('/counters', async (req, res) => {
    try {
        const counters = await dao.getAllCountersIds();
        res.status(200).json({ countersIdsList: counters });
    }
    catch (err) {
        res.status(500).json({ msg: "Service listing error!" });
    }
});
///////////////////////////////////////////////////////////////////Queue APIs

app.get('/queue/:counterID', (req, res) => {

    const counterID = req.params.counterID;
    dao.getNextCustomer(counterID)
        .then((ticket) => {
            if (!ticket) {
                res.json(-1);
            } else {
                res.json(ticket);
            }
        })
        .catch(
            (err) => {
                res.status(500).json({ success: err, msg: 'Next customer read failed!' });
            }
        );
});
/////////////////////////////////////////////////////////////////////////////////////////////////
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});