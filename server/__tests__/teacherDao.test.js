"use strict";

jest.setMock("../db", require("../__mocks__/db.mock"));
const db = require("../db");
const teacherDao = require('../dao/teacherDao');

function initDB() {
    //Insert student
    let sql = "INSERT INTO User(UserID, FullName, UserName, Password, AccessLevel) VALUES('275330', 'John Doe', 'john@polito.it', '$2b$12$7iALJ38k/PBlAB7b8JDksu7v85z.tjnC9XfoMdUJd75bIId87Ip2S', 1)";
    db.run((sql), function (err){
        if(err)
            console.log(err);
    });
    // Insert teacher
    sql = "INSERT INTO User(UserID, FullName, UserName, Password, AccessLevel) VALUES('141216', 'Marco', 'marco@polito.it', '$2b$12$7iALJ38k/PBlAB7b8JDksu7v85z.tjnC9XfoMdUJd75bIId87Ip2S', 2)";
    db.run((sql), function (err){
        if(err)
            console.log(err);
    });
    // Insert course
    sql = "INSERT INTO Course(CourseName, TeacherID) VALUES('Mobile Application development', '141216')";
    db.run((sql), function (err){
        if(err)
            console.log(err);
    });
    // Insert course schedule
    sql = "INSERT INTO CourseSchedule(CourseID, CourseStatus, CourseType, TimeStart, TimeEnd, OccupiedSeat, MaxSeat, Classroom) VALUES(1, 1, 1, DATETIME('now', '+1 day', 'localtime'), DATETIME('now', '+1 day', '+1 hour', 'localtime'), 3, 50, 'A1')";
    db.run((sql), function (err){
        if(err)
            console.log(err);
    });
   
}

function cleanDB(){
    let sql = "DELETE FROM sqlite_sequence";
    db.run((sql), function (err){
        if(err)
            console.log(err);
    });
    sql = "DELETE FROM Booking";
    db.run((sql), function (err){
        if(err)
            console.log(err);
    });
    sql = "DELETE FROM CourseSchedule";
    db.run((sql), function (err){
        if(err)
            console.log(err);
    });
    sql = "DELETE FROM Course";
    db.run((sql), function (err){
        if(err)
            console.log(err);
    });
    sql = "DELETE FROM User";
    db.run((sql), function (err){
        if(err)
            console.log(err);
    });
}

function insertBooking(){
     // Insert booking
     const sql = "INSERT INTO Booking(CourseScheduleID, StudentID, BookStatus, Attended) VALUES(1, '275330', 1, 0)";
     db.run((sql), function (err){
         if(err)
             console.log(err);
     });
}

describe("getBookedStudents", ()=>{
    beforeAll(async()=>{
        initDB();
    });
    afterAll(async ()=>{
        cleanDB();
    });
    test("No students booked", ()=>{
        setTimeout(1000, ()=>{
            expect.assertions(1);
            return teacherDao.getBookedStudents([1])
                .then((bookedStudents)=>expect(bookedStudents).toHaveLength(0));
        });
    });
    test("One student is booked", ()=>{
        insertBooking();
        setTimeout(1000, ()=>{
            expect.assertions(1);
            return teacherDao.getBookedStudents([1])
                .then((bookedStudents)=>expect(bookedStudents[0]).toEqual({
                    BookID:1,
                    CourseScheduleID:1,
                    StudentID:1,
                    BookStatus:1,
                    Attended:1
                }));
        });
    });
});
