"use strict";
jest.setMock("../db", require("../db.mock"));
const db = require("../db");
const bookingDao = require('./bookingDao');

function initDB() {
    //reset ids
    let sql = "DELETE FROM sqlite_sequence";
    db.run((sql), function (err, rows){
        if(err)
            console.log(err);
    });
    //Insert student
    sql = "INSERT INTO User(UserID, FullName, UserName, Password, AccessLevel) VALUES('275330', 'John Doe', 'john@polito.it', '$2b$12$7iALJ38k/PBlAB7b8JDksu7v85z.tjnC9XfoMdUJd75bIId87Ip2S', 1)";
    db.run((sql), function (err, rows){
        if(err)
            console.log(err);
    });
    //Insert teacher
    sql = "INSERT INTO User(UserID, FullName, UserName, Password, AccessLevel) VALUES('141216', 'Marco', 'marco@polito.it', '$2b$12$7iALJ38k/PBlAB7b8JDksu7v85z.tjnC9XfoMdUJd75bIId87Ip2S', 2)";
    db.run((sql), function (err, rows){
        if(err)
            console.log(err);
    });
    //Insert course
    sql = "INSERT INTO Course(CourseName, TeacherID) VALUES('Mobile Application development', '141216')";
    db.run((sql), function (err, rows){
        if(err)
            console.log(err);
    });
    //Insert course schedule
    sql = "INSERT INTO CourseSchedule(CourseID, CourseStatus, CourseType, TimeStart, TimeEnd, OccupiedSeat, MaxSeat, Classroom) VALUES(1, 1, 1, '2020-11-09T14:00:00', '2020-11-09T16:00:00', 3, 50, 'A1')";
    db.run((sql), function (err, rows){
        if(err)
            console.log(err);
    });
    //Insert booking
    sql = "INSERT INTO Booking(CourseScheduleID, StudentID, BookStatus, Attended) VALUES(1, '275330', 1, 0)";
    db.run((sql), function (err, rows){
        if(err)
            console.log(err);
    });
}

function cleanDB(){
    let sql = "DELETE FROM Booking";
    db.run((sql), function (err, rows){
        if(err)
            console.log(err);
    });
    sql = "DELETE FROM CourseSchedule";
    db.run((sql), function (err, rows){
        if(err)
            console.log(err);
    });
    sql = "DELETE FROM Course";
    db.run((sql), function (err, rows){
        if(err)
            console.log(err);
    });
    sql = "DELETE FROM User";
    db.run((sql), function (err, rows){
        if(err)
            console.log(err);
    });
}

describe("deleteBooking", ()=>{
    beforeEach(()=>{
        initDB();
    });
    afterEach(()=>{
        cleanDB();
    });
    it("booking exists", ()=>{
        expect.assertions(1);
        return bookingDao.deleteBooking(1).then((result)=>expect(result).toBeNull());
    });
    it("booking does not exist", ()=>{
        expect.assertions(1);
        return bookingDao.deleteBooking(1333)
            .catch(function(e){
                return expect(e).toEqual("NO BOOKING");
            });
    });
});