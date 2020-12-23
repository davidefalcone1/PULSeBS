"use strict";
/* I used setTimeout() because test start to run before DB initialization ends.
    Another solution is to substitute sqlite3 node module with sqlite node module,
    since the latter supports await/async mechanisms */
jest.setMock("../db", require("../__mocks__/db.mock"));
const testHelper = require("./testHelper");
const bookingDao = require('../dao/bookingDao');

const db = require("../db");

describe("deleteBooking", () => {
    let booking, student;
    beforeEach(async () => {
        await testHelper.initDB();
        student = await testHelper.insertStudent();
        const teacher = await testHelper.insertTeacher();
        const course = await testHelper.insertCourse('Software engineering 2', teacher);
        const lecture = await testHelper.insertCourseSchedule(course);
        await testHelper.enrollStudentToCourse(student, course);
        booking = await testHelper.insertBooking(student, lecture);
    });
    afterEach(async () => {
        await testHelper.cleanDB();
    });
    test("booking exists", () => {
        expect.assertions(1);
        expect(bookingDao.deleteBooking(booking, student)).resolves.toEqual("Success");
    });
    test("booking does not exist", async () => {
        expect.assertions(1);
        expect(bookingDao.deleteBooking(345, student)).rejects.toEqual('NO BOOKING');
    });
});

describe("bookLesson", () => {
    let lecture;
    beforeEach(async () => {
        await testHelper.initDB();
        const user = await testHelper.insertStudent();
        const teacher = await testHelper.insertTeacher();
        const course = await testHelper.insertCourse('Software engineering 2', teacher);
        lecture = await testHelper.insertCourseSchedule(course);
        await testHelper.enrollStudentToCourse(user, course);
    });
    afterEach(async () => {
        await testHelper.cleanDB();
    });
    test("the lesson exists and can be booked", async () => {
        expect.assertions(1);
        await expect(bookingDao.bookLesson('123456', lecture)).resolves.toEqual(true);
    });
    test("the lesson does not exist and can't be booked", async () => {
        expect.assertions(1);
        await expect(bookingDao.bookLesson('123456', 134)).rejects.toEqual('Some error occurred, server request failed!');
    });
});

describe("getBookedLessons", () => {
    let booking,student;
    beforeEach(async () => {
        await testHelper.initDB();
        student = await testHelper.insertStudent();
        const teacher = await testHelper.insertTeacher();
        const course = await testHelper.insertCourse('Software engineering 2', teacher);
        const lecture = await testHelper.insertCourseSchedule(course);
        await testHelper.enrollStudentToCourse(student, course);
        booking = await testHelper.insertBooking(student, lecture);
    });
    afterEach(async () => {
        await testHelper.cleanDB();
    });
    test('The booked lesson figures', ()=>{
        expect.assertions(1);
        bookingDao.getBookedLessons(student).then((lessons)=>{
            const lessonsIDs=lessons.map(lessons=>lessons.CourseScheduleID);
            expect(lessonsIDs).toContain(lecture);
        });
    });
});

describe("getStudentCourses", ()=>{
    let student;
    beforeEach(async () => {
        await testHelper.initDB();
        student = await testHelper.insertStudent();
        const teacher = await testHelper.insertTeacher();
        const course = await testHelper.insertCourse('Software engineering 2', teacher);
        await testHelper.enrollStudentToCourse(student, course);
    });
    afterEach(async () => {
        await testHelper.cleanDB();
    });
    test('The inserted course figures', ()=>{
        expect.assertions(1);
        bookingDao.getStudentCourses(student).then((courses)=>{
            const courseIDs=courses.map(courses=>courses.CourseID);
            expect(courseIDs).toContain(course);
        });
    });
});

describe("getBookableLessons", () => {
    let student,lecture;
    beforeEach(async () => {
        await testHelper.initDB();
        student = await testHelper.insertStudent();
        const teacher = await testHelper.insertTeacher();
        const course = await testHelper.insertCourse('Software engineering 2', teacher);
        lecture = await testHelper.insertCourseSchedule(course);
        await testHelper.enrollStudentToCourse(student, course);
    });
    afterEach(async () => {
        await testHelper.cleanDB();
    });
    test('The bookable lesson figures', ()=>{
        expect.assertions(1);
        bookingDao.getBookableLessons(student).then((lessons)=>{
            const lessonsIDs=lessons.map(lessons=>lessons.CourseScheduleID);
            expect(lessonsIDs).toContain(lecture);
        });
    });
});
 