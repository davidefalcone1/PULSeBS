'use strict';
const { default: LessonData } = require('./LessonsData.js');
const { default: CourseData } = require('./CourseData.js');
const db = require('../db');

exports.getBookableLessons = function (studentID){
    return new Promise((resolve, reject)=>{
        const sql = 
            "SELECT CourseScheduleID, CourseId, Classroom, OccupiedSeat, MaxSeat, TimeStart, TimeEnd" +
            "FROM CourseSchedule CS, StudentCourse SC" +
            "WHERE CS.CourseID=SC.CourseID AND SC.StudentID=? AND CourseStatus=true" +
            "AND TimeStart > TIME() AND CS.CourseType=1 AND CS.CourseScheduleID NOT IN " +
            "SELECT CourseScheduleID FROM Booking B WHERE StudentID=?"
        db.all(sql, [studentID, studentID], function (err, rows) {
            if(err){
                reject();
            }
            const availableLessons = rows.map((row)=>new LessonData(row.CourseScheduleID, row.CourseId, 
                row.TimeStart, row.TimeEnd, row.OccupiedSeat, row.MaxSeat));
            resolve(availableLessons);
        });
    });
}

exports.getBookedLessons = function (studentID){
    return new Promise((resolve, reject)=>{
        const sql = 
            "SELECT CourseScheduleID, CourseId, Classroom, OccupiedSeat, MaxSeat, TimeStart, TimeEnd" +
            "FROM CourseSchedule CS, StudentCourse SC" +
            "WHERE CS.CourseID=SC.CourseID AND SC.StudentID=? AND CourseStatus=true" +
            "AND TimeStart > TIME() AND CS.CourseType=1 AND CS.CourseScheduleID IN " +
            "SELECT CourseScheduleID FROM Booking B WHERE StudentID=?"
        db.all(sql, [studentID, studentID], function (err, rows) {
            if(err){
                reject();
            }
            const myLessons = rows.map((row)=>new LessonData(row.CourseScheduleID, row.CourseId, 
                row.TimeStart, row.TimeEnd, row.OccupiedSeat, row.MaxSeat));
            resolve(myLessons);
        });
    });
}

exports.getStudentCourses = function(studentID){
    return new Promise((resolve, reject)=>{
        const sql = 
            "SELECT CourseId, CourseName, TeacherId FROM Course C, StudentCourse SC WHERE C.CourseId = SC.CourseId AND SC.StudentID = ?";
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