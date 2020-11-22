"use strict";

jest.setMock("../db", require("../__mocks__/db.mock"));
const testHelper = require('./testHelper');
const teacherDao = require('../dao/teacherDao');
const bookingData = require('../dao/BookingData');

const db = require("../db");
const BookingData = require("../dao/BookingData");

async function insertBooking(){
    // Insert booking
    const sql = "INSERT INTO Booking(CourseScheduleID, StudentID, BookStatus, Attended) VALUES(2, '123456', 1, 0)";
    await db.pRun(sql);
}

describe("getBookedStudents", ()=>{
    beforeAll(async ()=>{
        await testHelper.initDB();
        await testHelper.insertUser();
        await testHelper.insertCourseSchedule();
    });
    afterAll(async ()=>{
        await testHelper.cleanDB();
    });
    test("No students booked", ()=>{
        expect.assertions(1);
        return teacherDao.getBookedStudents([2])
            .then((bookedStudents)=>expect(bookedStudents).toHaveLength(0));
    });
    test("One student is booked", async()=>{
        await insertBooking();
        expect.assertions(1);
        return teacherDao.getBookedStudents([2])
            .then((bookedStudents)=>expect(bookedStudents[0]).toEqual(new BookingData(2, 2, '123456', '1', '0')))
    });
});
