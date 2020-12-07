'use strict';
const sqlite = require('sqlite3');
const util = require('util');

const DBSOURCE = './server/db/db.test.db';

const db = new sqlite.Database(DBSOURCE, (err) => {
    if (err) {
        // Cannot open database
        console.error(err.message);
        throw err;
    }
});

db.pRun = util.promisify(db.run, db);
db.pGet = util.promisify(db.get, db);
db.pAll = util.promisify(db.all, db);

db.get("PRAGMA foreign_keys = ON");

module.exports = db;