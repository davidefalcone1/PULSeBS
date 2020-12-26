'use strict'
const db = require('../db');
const LessonData = require('./LessonsData.js');
const CourseData = require('./CourseData.js');
const moment = require('moment');
const path = require('path');
const { jsPDF } = require("jspdf");
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

exports.getBookableLessons = function (studentID) {
    return new Promise((resolve, reject) => {
        const sql =
            "SELECT CS.CourseScheduleID, CS.CourseId, Classroom, OccupiedSeat, MaxSeat, TimeStart, TimeEnd, CourseStatus, CourseType " +
            "FROM CourseSchedule CS, StudentCourse SC " +
            "WHERE CS.CourseID=SC.CourseID AND SC.StudentID=? AND CourseStatus=true " +
            "AND CS.CourseType=1 AND CS.CourseScheduleID NOT IN (" +
            "SELECT CourseScheduleID FROM Booking B WHERE StudentID=? AND BookStatus <> 2)" +
            "ORDER BY TimeStart ASC";
        db.all(sql, [studentID, studentID], function (err, rows) {
            if (err) {
                reject();
            }
            const availableLessons = rows.filter(row => checkStart(row.TimeStart))
                .map((row) => new LessonData(row.CourseScheduleID, row.CourseID,
                    row.TimeStart, row.TimeEnd, row.OccupiedSeat, row.MaxSeat,
                    row.CourseStatus, row.CourseType, row.Classroom));
            resolve(availableLessons);
        });
    });
}

exports.getBookedLessons = function (studentID) {
    return new Promise((resolve, reject) => {
        const sql =
            "SELECT CS.CourseScheduleID, CS.CourseId, Classroom, OccupiedSeat, MaxSeat, TimeStart, TimeEnd, CourseStatus, CourseType " +
            "FROM CourseSchedule CS, StudentCourse SC " +
            "WHERE CS.CourseID=SC.CourseID AND SC.StudentID=? AND CourseStatus=true " +
            "AND CS.CourseType=1 AND CS.CourseScheduleID IN (" +
            "SELECT CourseScheduleID FROM Booking WHERE StudentID=? AND BookStatus = 1)" +
            "ORDER BY TimeStart ASC";
        db.all(sql, [studentID, studentID], function (err, rows) {
            if (err) {
                reject();
                return;
            }
            const myLessons = rows.filter(row => checkStart(row.TimeStart))
                .map((row) =>
                    new LessonData(row.CourseScheduleID, row.CourseID,
                        row.TimeStart, row.TimeEnd, row.OccupiedSeat,
                        row.MaxSeat, row.CourseStatus, row.CourseType, row.Classroom));
            resolve(myLessons);
        });
    });
}

exports.getPendingWaitingBookings = function (studentID) {
    return new Promise((resolve, reject) => {
        const sql =
            "SELECT CS.CourseScheduleID, CS.CourseId, Classroom, OccupiedSeat, MaxSeat, TimeStart, TimeEnd, CourseStatus, CourseType " +
            "FROM CourseSchedule CS, StudentCourse SC " +
            "WHERE CS.CourseID=SC.CourseID AND SC.StudentID=? AND CourseStatus=true " +
            "AND CS.CourseType=1 AND CS.CourseScheduleID IN (" +
            "SELECT CourseScheduleID FROM Booking WHERE StudentID=? AND BookStatus = 3)" +
            "ORDER BY TimeStart ASC";
        db.all(sql, [studentID, studentID], function (err, rows) {
            if (err) {
                reject();
            }
            const myLessons = rows.filter(row => checkStart(row.TimeStart))
                .map((row) =>
                    new LessonData(row.CourseScheduleID, row.CourseID,
                        row.TimeStart, row.TimeEnd, row.OccupiedSeat,
                        row.MaxSeat, row.CourseStatus, row.CourseType));
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

        //check if the student is already on the waiting list
        let sql = `
        SELECT COUNT(*) as count
        FROM Booking 
        WHERE CourseScheduleID = ? AND StudentID = ? AND BookStatus = 3`
        db.get(sql, [lessonID, studentID], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            if (row.count < 1) {

                // 1 CHECK IF THE STUDENT CAN BOOK OR HAS TO BE PUT INTO THE WAITNING LIST
                sql = 'SELECT OccupiedSeat, MaxSeat ' +
                    'FROM CourseSchedule ' +
                    'WHERE CourseScheduleID = ?';
                db.get(sql, [lessonID], (error, tuple) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    else {

                        if (tuple === undefined) {
                            reject("Some error occurred, server request failed!");
                            return;
                        }

                        //flag to understand if the student has to wait
                        const waiting = tuple.OccupiedSeat === tuple.MaxSeat;

                        // 2 CHECK IF THERE ARE PREVIOUSLY CANCELED BOOKING (STATUS = 2)
                        sql = 'SELECT BookID ' +
                            'FROM Booking ' +
                            'WHERE CourseScheduleID = ? AND StudentID = ? AND BookStatus = 2';
                        db.get(sql, [lessonID, studentID], (error_code, row_value) => {
                            if (error_code) {
                                reject(error_code);
                                return;
                            }
                            else {
                                const previousBookingID = row_value ? row_value.BookID : undefined; //used also to understand if there is an existing deleted booking
                                const status = waiting ? 3 : 1; //status = 3 if waiting, 1 otherwise
                                const now = moment().format('YYYY:MM:DDTHH:mm:ss');

                                // UPDATE PREVIOUS INSERTED BOOKING
                                if (previousBookingID) {
                                    sql = 'UPDATE Booking ' +
                                        'SET BookStatus = ?, Timestamp = ? ' +
                                        'WHERE BookID = ?';
                                    db.run(sql, [status, now, previousBookingID], (err_code, tuple_value) => {
                                        if (err_code) {
                                            reject(err_code);
                                            return;
                                        }
                                    });
                                }
                                // INSERT NEW BOOKING
                                else {

                                    sql = 'INSERT INTO Booking (CourseScheduleID, StudentID, BookStatus, attended, Timestamp) ' +
                                        'VALUES (?, ?, ?, 0, ?) ';
                                    db.run(sql, [lessonID, studentID, status, now], (err_code, tuple_value) => {
                                        if (err_code) {
                                            reject(err_code);
                                            return;
                                        }
                                    });
                                }
                                //IF THE BOOKING HAS BEEN COMPLETED (STATUS = 1, NOT IN WAITING LIST!) UPDATE THE
                                //COURSESCHEDULE COLUMN OCCUPIEDSEATS
                                if (!waiting) {
                                    sql = 'UPDATE CourseSchedule ' +
                                        'SET OccupiedSeat = OccupiedSeat + 1 ' +
                                        'WHERE CourseScheduleID = ?';

                                    db.run(sql, [lessonID], (err_code) => {
                                        if (err_code) {
                                            reject(err_code);
                                            return;
                                        }
                                        else {
                                            resolve(true);
                                            return;
                                        }
                                    });
                                }
                                else {
                                    resolve(false);
                                }
                            }
                        });
                    }
                });

            } else {
                resolve(false);
            }

        })
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

        db.run(sql, [lessonID, studentID], function (err) {
            if (err) {
                reject(err);
                return;
            }
            else {
                if (this.changes === 0) {
                    reject('NO BOOKING');
                    return;
                }
                sql = `UPDATE CourseSchedule 
                        SET OccupiedSeat = OccupiedSeat - 1
                        WHERE CourseScheduleID = ?`;
                db.run(sql, [lessonID], (error) => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve('Success');
                    }
                })

            }
        });
    });
}

exports.checkWaitingList = function (lessonID) {
    return new Promise((resolve, reject) => {

        //find information about student (student with most priority) in waiting list if any
        let sql = `
        SELECT * FROM Booking
        WHERE CourseScheduleID = ? AND BookStatus = 3
        ORDER BY Timestamp ASC LIMIT 1`
        db.get(sql, [lessonID], function (err, row) {
            if (err) {
                reject(err);
                return;
            }
            if (row) {

                // if there is someone in waiting queue, set his status to 1
                sql = `
                UPDATE Booking
                SET BookStatus = 1
                WHERE BookID = ?`;
                db.run(sql, [row.BookID], function (error) {
                    if (error) {
                        reject(error);
                        return;
                    }
                    //then increase the occupied seat
                    sql = `
                    UPDATE CourseSchedule 
                    SET OccupiedSeat = OccupiedSeat + 1
                    WHERE CourseScheduleID = ?`;
                    db.run(sql, [lessonID], (error_code) => {
                        if (error_code) { reject(error_code); } else { resolve({ studentID: row.StudentID, lectureID: row.CourseScheduleID }); }
                    });
                });
            } else {
                resolve(0);
            }

        })
    })
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

exports.generateStudentTracing = function (studentID, downloadType) {
    return new Promise((resolve, reject) => {
        let fileLocation;
        const sql = `
        SELECT Course.CourseName, CourseSchedule.TimeStart, Booking.StudentID, User.Name, User.Surname, User.UserName,User.City,user.Birthday,user.SSN
        FROM CourseSchedule JOIN Booking
        ON CourseSchedule.CourseScheduleID = Booking.CourseScheduleID JOIN User
        ON Booking.StudentID = User.UserID JOIN Course
        ON CourseSchedule.CourseID = Course.CourseID
        WHERE Attended != 0 AND Booking.CourseScheduleID IN
        (SELECT Booking.CourseScheduleID FROM Booking WHERE StudentID = ? AND Attended =1)`;

        db.all(sql, [studentID], function (err, rows) {
            if (err) {
                reject(err);
                return;
            }
            // Filter/Find the appropriate data from DB based on the positive student
            const contactList = rows.filter(function (el) { return el.StudentID !== studentID });


            switch (downloadType) {
                case 'pdf'://If A PDF file Needed
                    try {
                        fileLocation = path.resolve(__dirname, '../files').concat('\\studentTracing.pdf');
                        const doc = new jsPDF({ putOnlyUsedFonts: true, orientation: "landscape", format: 'a3' });
                        doc.setTextColor(0, 0, 0);
                        doc.text(3, 10, `All possible contacts for the student with ID:`);
                        doc.setTextColor(255, 0, 0);
                        doc.text(113, 10, `${studentID}`);
                        doc.setTextColor(0, 0, 0);
                        doc.table(5, 25, contactList, ["CourseName", "TimeStart", "StudentID", "Name", "Surname", "UserName", "City", "Birthday", "SSN"], { autoSize: true });
                        doc.save(fileLocation);
                        resolve('studentTracing.pdf');
                        break;
                    } catch (err) {
                        reject(err);
                        return;
                    }
                case 'csv'://If A CSV file Needed
                    try {
                        fileLocation = path.resolve(__dirname, '../files').concat('\\studentTracing.csv');
                        const csvWriter = createCsvWriter({
                            path: './files/studentTracing.csv',
                            header: [
                                { id: 'CourseName', title: 'CourseName' },
                                { id: 'TimeStart', title: 'TimeStart' },
                                { id: 'StudentID', title: 'StudentID' },
                                { id: 'Name', title: 'Name' },
                                { id: 'Surname', title: 'Surname' },
                                { id: 'UserName', title: 'UserName' },
                                { id: 'City', title: 'City' },
                                { id: 'Birthday', title: 'Birthday' },
                                { id: 'SSN', title: 'SSN' }
                            ]
                        });
                        csvWriter.writeRecords(rows).then(() => resolve('studentTracing.csv'));
                        break;
                    } catch (err) {
                        reject(err);
                        return;
                    }
                default://If the file type requested is wrong
                    reject('File type is incorrect!')
            }
        });
    });
}

exports.generateTeacherTracing = function (teacherID, downloadType) {
    return new Promise((resolve, reject) => {
        let fileLocation;
        const sql = `
        SELECT Course.CourseName,CourseSchedule.TimeStart,Booking.StudentID,User.Name,User.Surname,User.UserName,User.City,User.Birthday,User.SSN
        FROM CourseSchedule JOIN Booking
        ON CourseSchedule.CourseScheduleID = Booking.CourseScheduleID JOIN User
        ON User.UserID = Booking.StudentID JOIN Course
        ON CourseSchedule.CourseID = Course.CourseID
        WHERE Booking.Attended=1 AND CourseSchedule.CourseID IN
        (SELECT Course.CourseID FROM User JOIN Course
        ON User.UserID = Course.TeacherID
        WHERE User.UserID = ? AND User.AccessLevel = 2 AND User.TestResult = 1)`;

        db.all(sql, [teacherID], function (err, rows) {
            if (err) {
                reject(err);
                return;
            }
            switch (downloadType) {
                case 'pdf'://If A PDF file Needed
                    try {
                        fileLocation = path.resolve(__dirname, '../files').concat('\\teacherTracing.pdf');
                        const doc = new jsPDF({ putOnlyUsedFonts: true, orientation: "landscape", format: 'a3' });
                        doc.setTextColor(0, 0, 0);
                        doc.text(3, 10, `All possible contacts for the teacher with ID:`);
                        doc.setTextColor(255, 0, 0);
                        doc.text(113, 10, `${teacherID}`);
                        doc.setTextColor(0, 0, 0);
                        doc.table(5, 25, rows, ["CourseName", "TimeStart", "StudentID", "Name", "Surname", "UserName", "City", "Birthday", "SSN"], { autoSize: true });
                        doc.save(fileLocation);
                        resolve('teacherTracing.pdf');
                        break;
                    } catch (err) {
                        reject(err);
                        return;
                    }
                case 'csv'://If A CSV file Needed
                    try {
                        fileLocation = path.resolve(__dirname, '../files').concat('\\teacherTracing.csv');
                        const csvWriter = createCsvWriter({
                            path: './files/teacherTracing.csv',
                            header: [
                                { id: 'CourseName', title: 'CourseName' },
                                { id: 'TimeStart', title: 'TimeStart' },
                                { id: 'StudentID', title: 'StudentID' },
                                { id: 'Name', title: 'Name' },
                                { id: 'Surname', title: 'Surname' },
                                { id: 'UserName', title: 'UserName' },
                                { id: 'City', title: 'City' },
                                { id: 'Birthday', title: 'Birthday' },
                                { id: 'SSN', title: 'SSN' }
                            ]
                        });
                        csvWriter.writeRecords(rows).then(() => resolve('teacherTracing.csv'));
                        break;
                    } catch (err) {
                        reject(err);
                        return;
                    }
                default://If the file type requested is wrong
                    reject('File type is incorrect!')
            }
        });
    });
}

const checkStart = (startDate) => {
    const now = moment();
    return moment(startDate).isAfter(now);
}