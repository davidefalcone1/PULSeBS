'use strict'

const db = require('../db');
const ClassroomData = require ('./ClassroomData');
const CourseData = require('./CourseData');
const UserData = require('./UserData');
const LessonsData = require('./LessonsData');

exports.getClassrooms = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM Classroom';
        db.all(sql, [], (err, rows) => {
            if(err){
                reject(err);
            }
            else {
                const classes = rows.map(row => new ClassroomData(row.ID, row.ClassroomName, row.MaxSeats));
                resolve(classes);
            }
        });
    });
}

exports.getCourses = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT CourseID, CourseName, TeacherID FROM Course';
        db.all(sql, [], (err, rows) => {
            if(err){
                reject(err);
            }
            else {
                const courses = rows.map(row => new CourseData(row.CourseID, row.CourseName, row.TeacherID));
                resolve(courses);
            }
        });
    });
}

exports.getUsers = (userType) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT ID, UserID, Name, Surname, UserName ' +
        'FROM User ' +
        'WHERE AccessLevel = ?';
        db.all(sql, [userType], (err, rows) => {
            if(err){
                reject(err);
            }
            else {
                const students = rows.map(row => new UserData(row.ID, row.UserID, row.Name + ' ' + row.Surname, row.UserName));
                resolve(students);
            }
        });
    });
}

exports.getLessons = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * ' 
        + 'FROM CourseSchedule';
        db.all(sql, [], (err, rows) => {
            if(err){
                reject(err);
            }
            else {
                const courses = rows.map(row => new LessonsData(row.CourseScheduleID, row.CourseID, row.TimeStart, row.TimeEnd, row.OccupiedSeat, row.MaxSeat, row.CourseStatus, row.CourseType, row.Classroom));
                resolve(courses);
            }
        });
    });
}