"use strict";

const app = require('./app');
const port = 3001;

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});