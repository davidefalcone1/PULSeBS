'use strict'
const db = require('../db');
const LessonData = require('./LessonsData.js');
const CourseData = require('./CourseData.js');
const moment = require('moment');

exports.getBookableLessons = function (studentID) {
    return new Promise((resolve, reject) => {
        const sql =
            "SELECT CS.CourseScheduleID, CS.CourseId, Classroom, OccupiedSeat, MaxSeat, TimeStart, TimeEnd " +
            "FROM CourseSchedule CS, StudentCourse SC " +
            "WHERE CS.CourseID=SC.CourseID AND SC.StudentID=? AND CourseStatus=true " +
            "AND CS.CourseType=1 AND CS.CourseScheduleID NOT IN (" +
            "SELECT CourseScheduleID FROM Booking B WHERE StudentID=? AND BookStatus = 1)";
        db.all(sql, [studentID, studentID], function (err, rows) {
            if (err) {
                reject();
            }
            const availableLessons = rows.filter(row => checkStart(row.TimeStart))
                .map((row) => new LessonData(row.CourseScheduleID, row.CourseID,
                    row.TimeStart, row.TimeEnd, row.OccupiedSeat, row.MaxSeat));
            resolve(availableLessons);
        });
    });
}

exports.getBookedLessons = function (studentID) {
    return new Promise((resolve, reject) => {
        const sql =
            "SELECT CS.CourseScheduleID, CS.CourseId, Classroom, OccupiedSeat, MaxSeat, TimeStart, TimeEnd " +
            "FROM CourseSchedule CS, StudentCourse SC " +
            "WHERE CS.CourseID=SC.CourseID AND SC.StudentID=? AND CourseStatus=true " +
            "AND CS.CourseType=1 AND CS.CourseScheduleID IN (" +
            "SELECT CourseScheduleID FROM Booking WHERE StudentID=? AND BookStatus = 1)"
        db.all(sql, [studentID, studentID], function (err, rows) {
            if (err) {
                reject();
            }
            const myLessons = rows.filter(row => checkStart(row.TimeStart))
                .map((row) =>
                    new LessonData(row.CourseScheduleID, row.CourseID,
                        row.TimeStart, row.TimeEnd, row.OccupiedSeat, row.MaxSeat));
            resolve(myLessons);
        });
    });
}

exports.getStudentCourses = function (studentID) {
    return new Promise((resolve, reject) => {
        const sql =
            "SELECT C.CourseId, CourseName, TeacherId FROM Course C, StudentCourse SC WHERE C.CourseId = SC.CourseId AND SC.StudentID = ?";
        db.all(sql, [studentID], function (err, rows) {
            if (err) {
                reject();
            }
            const myCourses = rows.map((row) => new CourseData(row.CourseID, row.CourseName,
                row.TeacherId));
            resolve(myCourses);
        });
    });
}

exports.bookLesson = function (studentID, lessonID) {
    return new Promise((resolve, reject) => {

        // 1 CHECK IF THE STUDENT CAN BOOK OR HAS TO BE PUT INTO THE WAITNING LIST
        let sql = 'SELECT OccupiedSeat, MaxSeat ' +
            'FROM CourseSchedule ' +
            'WHERE CourseScheduleID = ?';
        db.get(sql, [lessonID], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            else {

                if(row === undefined){
                    reject("Some error occurred, server request failed!");
                    return;
                }
                
                //flag to understand if the student has to wait
                const waiting = row.OccupiedSeat === row.MaxSeat;

                // 2 CHECK IF THERE ARE PREVIOUSLY CANCELED BOOKING (STATUS = 2)
                sql = 'SELECT BookID ' +
                    'FROM Booking ' +
                    'WHERE CourseScheduleID = ? AND StudentID = ? AND BookStatus = 2';
                db.get(sql, [lessonID, studentID], (err, row) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    else {
                        const previousBookingID = row ? row.BookID : undefined; //used also to understand if there is an existing deleted booking
                        const status = waiting ? 3 : 1; //status = 3 if waiting, 1 otherwise

                        // UPDATE PREVIOUS INSERTED BOOKING
                        if (previousBookingID) {
                            sql = 'UPDATE Booking ' +
                                'SET BookStatus = ? ' +
                                'WHERE BookID = ?';
                            db.run(sql, [status, previousBookingID], (err, row) => {
                                if (err) {
                                    reject(err);
                                    return;
                                }
                            });
                        }
                        // INSERT NEW BOOKING
                        else {
            
                            sql = 'INSERT INTO Booking (CourseScheduleID, StudentID, BookStatus, attended) ' +
                                'VALUES (?, ?, ?, 0) ';
                            db.run(sql, [lessonID, studentID, status], (err, row) => {
                                if (err) {
                                    reject(err);
                                    return;
                                }
                            });
                        }
                        //IF THE BOOKING HAS BEEN COMPLETED (STATUS = 1, NOT IN WAITING LIST!) UPDATE THE
                        //COURSESCHEDULE TABLE OCCUPIEDSEATS
                        if (!waiting) {
                            sql = 'UPDATE CourseSchedule ' +  
                                  'SET OccupiedSeat = OccupiedSeat + 1 ' +
                                  'WHERE CourseScheduleID = ?';

                            db.run(sql, [lessonID], (err) => {
                                if (err) {
                                    reject(err);
                                    return;
                                }
                                else {
                                    resolve('Booking Confirmed');
                                    return;
                                }
                            });
                        }
                        else {
                            resolve("Waiting list");
                        }
                    }
                });
            }
        });
    });
}

exports.deleteBooking = (lessonID, studentID) => {
    return new Promise((resolve, reject) => {
        if (!lessonID || !studentID) {
            reject('Missing data');
        }

        let sql = `UPDATE Booking 
                   SET BookStatus = 2 
                   WHERE CourseScheduleID = ? AND StudentID = ?`;

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

exports.getLectureDataById = (lectureID) => {

    return new Promise((resolve, reject) => {

        if (!lectureID) {
            reject('Missing data');
        }
        else {
            const sql = `SELECT CS.TimeStart, CS.TimeEnd, C.CourseName 
                         FROM CourseSchedule CS, Course C 
                         WHERE CS.CourseScheduleID = ? AND   
                               CS.CourseID = C.CourseID`;
            db.get(sql, [lectureID], (err, row) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(row);
                }
            });
        }
    });
}

const checkStart = (startDate) => {
    const now = moment();
    return moment(startDate).isAfter(now);
}