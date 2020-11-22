"use strict";
jest.setMock("../db", require("../__mocks__/db.mock"));
const db = require("../db");

async function initDB() {
    //Insert student
    let sql = "INSERT INTO User(UserID, FullName, UserName, Password, AccessLevel) VALUES('275330', 'John Doe', 'john@polito.it', '$2b$12$7iALJ38k/PBlAB7b8JDksu7v85z.tjnC9XfoMdUJd75bIId87Ip2S', 1)";
    await db.pRun(sql);
    // Insert teacher
    sql = "INSERT INTO User(UserID, FullName, UserName, Password, AccessLevel) VALUES('141216', 'Marco', 'marco@polito.it', '$2b$12$7iALJ38k/PBlAB7b8JDksu7v85z.tjnC9XfoMdUJd75bIId87Ip2S', 2)";
    await db.pRun(sql);
    // Insert course
    sql = "INSERT INTO Course(CourseName, TeacherID) VALUES('Mobile Application development', '141216')";
    await db.pRun(sql);
    // Insert course schedule
    sql = "INSERT INTO CourseSchedule(CourseID, CourseStatus, CourseType, TimeStart, TimeEnd, OccupiedSeat, MaxSeat, Classroom) VALUES(1, 1, 1, '2020-11-09T14:00:00', '2020-11-09T15:30:00', 3, 50, 'A1')";
    await db.pRun(sql);
    // Insert booking
    sql = "INSERT INTO Booking(CourseScheduleID, StudentID, BookStatus, Attended) VALUES(1, '275330', 1, 0)";
    await db.pRun(sql);
}

async function cleanDB(){
    let sql = "DELETE FROM sqlite_sequence";
    await db.pRun(sql);
    sql = "DELETE FROM Booking";
    await db.pRun(sql);
    sql = "DELETE FROM CourseSchedule";
    await db.pRun(sql);
    sql = "DELETE FROM Course";
    await db.pRun(sql);
    sql = "DELETE FROM User";
    await db.pRun(sql);
}

async function insertUser() {
    const sql = 'INSERT INTO User(UserID, FullName, UserName, Password, AccessLevel)' + 
        " VALUES('123456','Davide Falcone', 'davide.falcone@studenti.polito.it', '$2b$12$7iALJ38k/PBlAB7b8JDksu7v85z.tjnC9XfoMdUJd75bIId87Ip2S', 1)";
    await db.pRun(sql);
}

async function insertCourseSchedule(){
    const sql = "INSERT INTO CourseSchedule(CourseID, CourseStatus, CourseType, TimeStart, TimeEnd, OccupiedSeat, MaxSeat, Classroom)" +
        " VALUES(1, 1, 1, DATETIME('now', '+1 day', 'localtime'), DATETIME('now', '+1 day', '+1 hour', 'localtime'), 3, 50, 'A1')";
    await db.pRun(sql);
}

module.exports = {initDB, cleanDB, insertUser, insertCourseSchedule};