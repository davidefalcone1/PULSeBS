"use strict";

const app = require('app');
const port = 3001;

// set automatc email sending to professors
dailyMailer.setDailyMail();

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});