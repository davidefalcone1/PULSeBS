'use strict'
const db = require('../db');

exports.deleteBooking = (lessonID, studentID) => {
    return new Promise((resolve, reject) => {
        if (!lessonID || !studentID) {
            reject('Missing data');
        }

        let sql = `UPDATE Booking 
                   SET BookStatus = 2 
                   WHERE CourseScheduleID = ? AND StudentID`;

        db.run(sql, [lessonID, studentID], (err) => {
            if (err) {
                reject(err);
            }
            else {
                sql = `UPDATE CourseSchedule 
                        SET OccupiedSeat = OccupiedSeat - 1
                        WHERE CourseScheduleID = ?`;
                db.run(sql, [lessonID], (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(null);
                }
            })

            }
        });
    });
}