'use strict';
const { default: LessonData } = require('./LessonsData.js');
const db = require('../db');

exports.getBookableLessons = function (studentID){
    return new Promise((resolve, reject)=>{
        const sql = 
            "SELECT CourseScheduleID, CourseId, Classroom, OccupiedSeat, MaxSeat, TimeStart, TimeEnd" +
            "FROM Course C, CourseSchedule CS, User U, StudentCourse SC" +
            "WHERE C.CourseID=CS.CourseID AND SC.CourseID=C.CourseID AND SC.StudentID=U.UserID AND CourseStatus=true" +
            "AND TimeStart < TIME() AND U.UserID=? AND CS.CourseType=1 AND CS.CourseScheduleID NOT IN " +
            "SELECT CourseScheduleID FROM Booking B WHERE StudentID=?"
        db.all(sql, [studentID, studentID], function (err, rows) {
            if(err){
                reject();
            }
            const availableLessons = rows.map((row)=>new LessonData(row.CourseScheduleID, row.CourseId, 
                row.TimeStart, row.TimeEnd, row.OccupiedSeat, row.MaxSeat - row.OccupiedSeat, row.Classroom));
            resolve(availableLessons);
        });
    });
}

exports.getBookedLessons = function (studentID){
    return new Promise((resolve, reject)=>{
        const sql = 
            "SELECT CourseScheduleID, CourseId, Classroom, OccupiedSeat, MaxSeat, TimeStart, TimeEnd" +
            "FROM Course C, CourseSchedule CS, User U, StudentCourse SC" +
            "WHERE C.CourseID=CS.CourseID AND SC.CourseID=C.CourseID AND SC.StudentID=U.UserID AND CourseStatus=true" +
            "AND TimeStart < TIME() AND U.UserID=? AND CS.CourseType=1 AND CS.CourseScheduleID IN " +
            "SELECT CourseScheduleID FROM Booking B WHERE StudentID=?"
        db.all(sql, [studentID, studentID], function (err, rows) {
            if(err){
                reject();
            }
            const myLessons = rows.map((row)=>new LessonData(row.CourseScheduleID, row.CourseId, 
                row.TimeStart, row.TimeEnd, row.OccupiedSeat, row.MaxSeat - row.OccupiedSeat, row.Classroom));
            resolve(myLessons);
        });
    });
}

exports.getStudentCourses = function(studentID){
    return new Promise((resolve, reject)=>{
        const sql = 
            "SELECT CourseId, CourseName, TeacherId FROM Course C, StudentCourse SC WHERE C.CourseId = SC.CourseId AND SC.StudentID = ";
        db.all(sql, [studentID], function (err, rows) {
            if(err){
                reject();
            }
            const myCourses = rows.map((row)=>new CourseData(row.CourseId, row.CourseName, 
                row.TeacherId));
            resolve(myCourses);
        });
    });
}

exports.bookLesson = function(studentID, lessonID){
    return new Promise((resolve, reject)=>{
        const sql = "INSERT INTO Booking(CourseScheduleID, StudentID, BookStatus, attended) VALUES(?, ?, 1, false)";
        db.run(sql, [studentID, lessonID], function (err) {
            if(err)
                reject(err);
            resolve();
        })
    });
}