'use strict';

const csv = require('csv-parser');
const fs = require('fs');

exports.readCsv = () => {
    const res = [];

    const source = './dao/sample.csv'
    const stream = fs.createReadStream(source);
    
    stream
    .pipe(csv({}))
    .on('data', (data) => res.push(data))
    .on('end', () => console.log(res));
}
