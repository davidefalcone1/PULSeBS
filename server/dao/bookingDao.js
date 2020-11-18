'use strict'
const db = require('../db');
const LessonData = require('./LessonsData.js');
const CourseData = require('./CourseData.js');

exports.getBookableLessons = function (studentID) {
    return new Promise((resolve, reject) => {
        const sql =
            "SELECT CS.CourseScheduleID, CS.CourseId, Classroom, OccupiedSeat, MaxSeat, TimeStart, TimeEnd " +
            "FROM CourseSchedule CS, StudentCourse SC " +
            "WHERE CS.CourseID=SC.CourseID AND SC.StudentID=? AND CourseStatus=true " +
            "AND TimeStart > TIME() AND CS.CourseType=1 AND CS.CourseScheduleID NOT IN (" +
            "SELECT CourseScheduleID FROM Booking B WHERE StudentID=?)"
        db.all(sql, [studentID, studentID], function (err, rows) {
            if (err) {
                reject();
            }
            const availableLessons = rows.map((row) => new LessonData(row.CourseScheduleID, row.CourseID,
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
            "AND TimeStart > TIME() AND CS.CourseType=1 AND CS.CourseScheduleID IN (" +
            "SELECT CourseScheduleID FROM Booking WHERE StudentID=?)"
        db.all(sql, [studentID, studentID], function (err, rows) {
            if (err) {
                reject();
            }
            const myLessons = rows.map((row) =>
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
        const sql = "INSERT INTO Booking(CourseScheduleID, StudentID, BookStatus, attended) VALUES(?, ?, 1, 0)";
        db.run(sql, [lessonID, studentID], function (err, row) {
            if (err)
                reject('Error');
            resolve('Success');
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