"use strict";

jest.setMock("../db", require("../__mocks__/db.mock"));
const testHelper = require('./testHelper');
const teacherDao = require('../dao/teacherDao');
const bookingData = require('../dao/BookingData');

const db = require("../db");
const BookingData = require("../dao/BookingData");

describe("getBookedStudents", ()=>{
    let lecture, student;
    beforeAll(async ()=>{
        await testHelper.initDB();
        student = await testHelper.insertStudent();
        const teacher = await testHelper.insertTeacher();
        const course = await testHelper.insertCourse('Software engineering 2', teacher);
        lecture = await testHelper.insertCourseSchedule(course);
        await testHelper.enrollStudentToCourse(student, course);
    });
    afterAll(async ()=>{
        await testHelper.cleanDB();
    });
    test("No students booked", ()=>{
        expect.assertions(1);
        return teacherDao.getBookedStudents([lecture])
            .then((bookedStudents)=>expect(bookedStudents).toHaveLength(0));
    });
    test("One student is booked", async()=>{
        expect.assertions(1);
        testHelper.insertBooking(student, lecture);
        return teacherDao.getBookedStudents([lecture])
            .then((bookedStudents)=>{
                const IDs = bookedStudents.map(s=>s.studentId);
                expect(IDs).toContain(student);
            });
    });
});
