'use strict'
const db = require('../db');

exports.deleteBooking = (bookingID) => {
    return new Promise ((resolve, reject) => {
        if(!bookingID){
            reject('Missing data');
        }

        const sql = `UPDATE Booking 
        SET BookStatus = 2 
        WHERE BookID = ?`;

        db.run(sql, bookingID, (err) => {
            if(err){
                reject(err);
            }
            else {
                resolve(null);
            }
        });
    });
}