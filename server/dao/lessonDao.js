'use strict';
const { default: LessonData } = require('../../client/src/API/LessonsData');
const db = require('../db');

exports.getAvailableLessons = function (studentID){
    return new Promise((resolve, reject)=>{
        const sql = 
            "SELECT CourseScheduleID, CourseName, Classroom, OccupiedSeat, MaxSeat, TimeStart, TimeEnd" +
            "FROM Course C, CourseSchedule CS, User U, StudentCourse SC" +
            "WHERE C.CourseID=CS.CourseID AND SC.CourseID=C.CourseID AND SC.StudentID=U.UserID AND CourseStatus=true" +
            "AND TimeStart < TIME() AND U.UserID=? AND CS.CourseType=1 AND CS.CourseScheduleID NOT IN " +
            "SELECT CourseScheduleID FROM Booking B WHERE StudentID=?"
        db.all(sql, [studentID, studentID], function (err, rows) {
            if(err){
                reject();
            }
            const availableLessons = rows.map((row)=>new LessonData(row.CourseScheduleID, row.CourseName, 
                row.TimeStart, row.TimeEnd, row.OccupiedSeat, row.MaxSeat - row.OccupiedSeat, row.Classroom));
            resolve(availableLessons);
        });
    });
}

exports.getLessons = function (studentID){
    return new Promise((resolve, reject)=>{
        const sql = 
            "SELECT CourseScheduleID, CourseName, Classroom, OccupiedSeat, MaxSeat, TimeStart, TimeEnd" +
            "FROM Course C, CourseSchedule CS, User U, StudentCourse SC" +
            "WHERE C.CourseID=CS.CourseID AND SC.CourseID=C.CourseID AND SC.StudentID=U.UserID AND CourseStatus=true" +
            "AND TimeStart < TIME() AND U.UserID=? AND CS.CourseType=1 AND CS.CourseScheduleID IN " +
            "SELECT CourseScheduleID FROM Booking B WHERE StudentID=?"
        db.all(sql, [studentID, studentID], function (err, rows) {
            if(err){
                reject();
            }
            const myLessons = rows.map((row)=>new LessonData(row.CourseScheduleID, row.CourseName, 
                row.TimeStart, row.TimeEnd, row.OccupiedSeat, row.MaxSeat - row.OccupiedSeat, row.Classroom));
            resolve(myLessons);
        });
    });
}