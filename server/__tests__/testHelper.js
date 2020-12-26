"use strict";
jest.setMock("../db", require("../__mocks__/db.mock"));
const EnrollmentData = require("../dao/EnrollmentData");
const db = require("../db");

async function initDB() {
    //Insert student
    // let sql = "INSERT INTO User(UserID, FullName, UserName, Password, AccessLevel) VALUES('275330', 'John Doe', 'john@polito.it', '$2b$12$7iALJ38k/PBlAB7b8JDksu7v85z.tjnC9XfoMdUJd75bIId87Ip2S', 1)";
    // await db.pRun(sql);
    // // Insert teacher
    // sql = "INSERT INTO User(UserID, FullName, UserName, Password, AccessLevel) VALUES('141216', 'Marco', 'marco@polito.it', '$2b$12$7iALJ38k/PBlAB7b8JDksu7v85z.tjnC9XfoMdUJd75bIId87Ip2S', 2)";
    // await db.pRun(sql);
    // // Insert course
    // sql = "INSERT INTO Course(CourseName, TeacherID) VALUES('Mobile Application development', '141216')";
    // db.pRun(sql);
    // // Insert course schedule
    // sql = "INSERT INTO CourseSchedule(CourseID, CourseStatus, CourseType, TimeStart, TimeEnd, OccupiedSeat, MaxSeat, Classroom) VALUES(1, 1, 1, '2020-11-09T14:00:00', '2020-11-09T15:30:00', 3, 50, 'A1')";
    // await db.pRun(sql);
    // // Insert booking
    // sql = "INSERT INTO Booking(CourseScheduleID, StudentID, BookStatus, Attended, Timestamp) VALUES(1, '275330', 1, 0, datetime('now', 'localtime'))";
    // await db.pRun(sql);
}

async function cleanDB(){
    let sql = "DELETE FROM sqlite_sequence";
    await db.pRun(sql);
    sql = "DELETE FROM Booking";
    await db.pRun(sql);
    sql = "DELETE FROM StudentCourse";
    await db.pRun(sql);
    sql = "DELETE FROM CourseSchedule";
    await db.pRun(sql);
    sql = "DELETE FROM GeneralCourseSchedule";
    await db.pRun(sql);
    sql = "DELETE FROM Course";
    await db.pRun(sql);
    sql = "DELETE FROM User";
    await db.pRun(sql);
    sql = "DELETE FROM Classroom";
    await db.pRun(sql);
}

async function insertBooking(user, lecture) {
    let sql = 'INSERT INTO Booking(CourseScheduleID, StudentID, BookStatus, Attended, Timestamp)' +
        " VALUES(?, ?, 1, 0, datetime('now', 'localtime'))";
    let result = await db.pRun(sql, [lecture, user]);
    if(result)
        console.log(result);
    sql = "SELECT BookID FROM Booking";
    result = await db.pAll(sql);
    return result[result.length-1].BookID;
}

async function enrollStudentToCourse(student, course) {
    let sql = 'INSERT INTO StudentCourse(CourseID, StudentID) VALUES(?, ?)';
    let result = await db.pRun(sql, [course, student]);
    if(result)
        console.log(result);
    sql = "SELECT * FROM StudentCourse";
    result = await db.pGet(sql);
    return new EnrollmentData(result.CourseID, result.StudentID);
}

async function insertStudent() {
    let sql = 'INSERT INTO User(UserID, Name, Surname, UserName, AccessLevel, Password, City, Birthday, SSN)' + 
        " VALUES('123456','Davide', 'Falcone', 'davide.falcone@studenti.polito.it', 1, '$2b$12$7iALJ38k/PBlAB7b8JDksu7v85z.tjnC9XfoMdUJd75bIId87Ip2S', 'Caserta', '1996-09-05', 'abc')";
    let result = await db.pRun(sql);
    if(result)
        console.log(result);
    sql = 'SELECT UserID FROM User ORDER BY ID';
    result = await db.pAll(sql);
    return result[result.length-1].UserID;
}

async function insertCourseSchedule(course, timeStart, timeEnd){
    let sql, result;
    if(timeStart && timeEnd){
        sql = "INSERT INTO CourseSchedule(CourseID, CourseStatus, CourseType, TimeStart, TimeEnd, OccupiedSeat, MaxSeat, Classroom)" +
          " VALUES(?, 1, 1, ?, ?, 3, 50, 'A1')";
        result = await db.pRun(sql, [course, timeStart, timeEnd]);
    }
    else{
        sql = "INSERT INTO CourseSchedule(CourseID, CourseStatus, CourseType, TimeStart, TimeEnd, OccupiedSeat, MaxSeat, Classroom)" +
          " VALUES(?, 1, 1, DATETIME('now', '+1 day', 'localtime'), DATETIME('now', '+1 day', '+1 hour', 'localtime'), 3, 50, 'A1')";
        result = await db.pRun(sql, [course]);
    }
    if(result)
        console.log(result);
    sql = 'SELECT * FROM CourseSchedule';
    result = await db.pAll(sql);
    return result[result.length-1].CourseScheduleID;
}

async function insertGeneralCourseSchedule(course, day, startTime, endTime){
    let sql, result;
    if(day && startTime && endTime){
        sql = "INSERT INTO GeneralCourseSchedule(CourseID, Day, StartTime, EndTime, Room)" +
            " VALUES(?, ?, ?, ?, 'A1')";
        result = await db.pRun(sql, [course, day, startTime, endTime]);
    }
    else {
        sql = "INSERT INTO GeneralCourseSchedule(CourseID, Day, StartTime, EndTime, Room)" +
            " VALUES(?, 'Mon', TIME('now', 'localtime'), TIME('now', '+1 hours', 'localtime'), 'A1')";
        result = await db.pRun(sql, [course]);

    }
    if(result)
        console.log(result);
    sql = 'SELECT * FROM GeneralCourseSchedule';
    result = await db.pAll(sql);
    return result[result.length-1].ID;
}

async function insertCourse(name, teacher, semester){
    let sql , result;
    if(semester){
        sql = 'INSERT INTO Course(Year, Semester, CourseName, TeacherID) VALUES(2, ?, ?, ?)';
        result = await db.pRun(sql, [semester, name, teacher]);
    }
    else{
        sql = 'INSERT INTO Course(Year, Semester, CourseName, TeacherID) VALUES(2, 1, ?, ?)';
        result = await db.pRun(sql, [name, teacher]);
    }
    if(result)
        console.log(result);
    sql = 'SELECT CourseID FROM Course';
    result = await db.pAll(sql);
    return result[result.length-1].CourseID;
}

async function insertTeacher(){
    let sql = "INSERT INTO User(UserID, Name, Surname, UserName, AccessLevel, Password, City, Birthday, SSN) VALUES('654321', 'Mario', 'Rossi', 'mario.rossi@polito.it', 2, '$2b$12$7iALJ38k/PBlAB7b8JDksu7v85z.tjnC9XfoMdUJd75bIId87Ip2S', 'Torino', '08-09-1970', 'abc')";
    let result = await db.pRun(sql);
    if(result)
        console.log(result);
    sql = 'SELECT * FROM User';
    result = await db.pAll(sql);
    return result[result.length-1].UserID;
}

async function getUserEmail(userID){
    const sql = 'SELECT UserName FROM User WHERE UserID = ?';
    const result = await db.pGet(sql, [userID]);
    return result.UserName;
}

async function getLectureFromBooking(booking){
    const sql = 'SELECT * FROM Booking WHERE BookID = ?';
    const result = await db.pGet(sql, [booking]);
    return result.CourseScheduleID;
}

async function insertClassroom(){
    let sql = "INSERT INTO Classroom(ClassroomName, MaxSeats) VALUES('A1', 80)";
    let result = await db.pRun(sql);
    sql = 'SELECT * FROM Classroom';
    result = await db.pGet(sql);
    return result.ID;
}

async function modifyBookingasPending(user,lecture) {
    let sql= "UPDATE Booking SET BookStatus = 3 WHERE StudentID=? AND CourseScheduleID=?";
    let result = await db.pRun(sql,[user,lecture]);
    if(result)
        console.log(result);
    sql = "SELECT BookID FROM Booking"
    result = await db.pAll(sql);
    return result[result.length-1].BookID;
}
module.exports = {initDB, cleanDB, insertStudent, insertGeneralCourseSchedule, insertTeacher, insertCourse, insertCourseSchedule, insertBooking, enrollStudentToCourse, getUserEmail, getLectureFromBooking, insertClassroom,modifyBookingasPending};