"use strict";
/* I used setTimeout() because test start to run before DB initialization ends.
    Another solution is to substitute sqlite3 node module with sqlite node module,
    since the latter supports await/async mechanisms */
jest.setMock("../db", require("../__mocks__/db.mock"));
const db = require("../db");
const bookingDao = require('../dao/bookingDao');

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
    // Insert booking
    sql = "INSERT INTO Booking(CourseScheduleID, StudentID, BookStatus, Attended) VALUES(1, '275330', 1, 0)";
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

describe("deleteBooking", ()=>{
    beforeEach(async()=>{
        initDB();
    });
    afterEach(async ()=>{
        cleanDB();
    });
    test("booking exists", ()=>{                                                                                                                            
        setTimeout(1000, ()=>{
            expect.assertions(1);
            return bookingDao.deleteBooking(1, '275330').then((result)=>expect(result).toBeNull());
        });
    });
    test("booking does not exist", async()=>{
        setTimeout(1000, ()=>{
            expect.assertions(1);
            expect(bookingDao.deleteBooking(454, '275330')).rejects.toEqual('NO BOOKING');
        });
    });
});

describe("bookLesson", ()=>{
    beforeEach(async()=>{
        initDB();
    });
    afterEach(async ()=>{
        cleanDB();
    });
    test("the lesson exists and can be booked", ()=>{
        setTimeout(1000, ()=>{
            expect.assertions(1);
            return bookingDao.bookLesson(275330,1).then((result)=>expect(result).toEqual('Success'));
        });
    });
    test("the lesson does not exist and can't be booked", ()=>{
        setTimeout(1000, async()=>{
            expect.assertions(1);
            await expect(bookingDao.bookLesson(275330,454)).rejects.toEqual('Error');
        });
    });
});