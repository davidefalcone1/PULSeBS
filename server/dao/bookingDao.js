'use strict'
const db = require('../db');

exports.deleteBooking = (bookingID) => {
    return new Promise((resolve, reject) => {
        if (!bookingID) {
            reject('Missing data');
        }

        let sql = `UPDATE Booking 
                   SET BookStatus = 2 
                   WHERE BookID = ?`;

        db.run(sql, [bookingID], (err) => {
            if (err) {
                reject(err);
            }
            else {
                sql = `SELECT CourseScheduleID 
                       FROM Booking  
                       WHERE BookID = ?`;

                db.get(sql, [bookingID], (err, row) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        sql = `UPDATE CourseSchedule 
                               SET OccupiedSeat = OccupiedSeat - 1
                               WHERE CourseScheduleID = ?`;
                        db.run(sql, [row.CourseScheduleID], (err) => {
                            if (err) {
                                reject(err);
                            }
                            else {
                                resolve(null);
                            }
                        })
                    }
                });

            }
        });
    });
}