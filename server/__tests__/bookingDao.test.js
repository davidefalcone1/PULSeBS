"use strict";
jest.setMock("../db", require("../__mocks__/db.mock"));
const testHelper = require("./testHelper");
const bookingDao = require('../dao/bookingDao');


describe("getBookableLessons", () => {
    let student, lecture;
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
    test('The bookable lesson figures', () => {
        expect.assertions(1);
        bookingDao.getBookableLessons(student).then((lessons) => {
            const lessonsIDs = lessons.map(_lessons => _lessons.scheduleId);
            expect(lessonsIDs).toContain(lecture);
        });
    });
});

describe("getBookedLessons", () => {
    let student, lecture;
    beforeEach(async () => {
        await testHelper.initDB();
        student = await testHelper.insertStudent();
        const teacher = await testHelper.insertTeacher();
        const course = await testHelper.insertCourse('Software engineering 2', teacher);
        lecture = await testHelper.insertCourseSchedule(course);
        await testHelper.enrollStudentToCourse(student, course);
        await testHelper.insertBooking(student, lecture);
    });
    afterEach(async () => {
        await testHelper.cleanDB();
    });
    test('The booked lesson figures', () => {
        expect.assertions(1);
        bookingDao.getBookedLessons(student).then((lessons) => {
            const lessonsIDs = lessons.map(_lessons => _lessons.scheduleId);
            expect(lessonsIDs).toContain(lecture);
        });
    });
});

describe("getPendingWaitingBookings", () => {
    let student, lecture;
    beforeEach(async () => {
        await testHelper.initDB();
        student = await testHelper.insertStudent();
        const teacher = await testHelper.insertTeacher();
        const course = await testHelper.insertCourse('Software engineering 2', teacher);
        lecture = await testHelper.insertCourseSchedule(course);
        await testHelper.enrollStudentToCourse(student, course);
        await testHelper.insertBooking(student, lecture);
        await testHelper.modifyBookingasPending(student, lecture);
    });
    afterEach(async () => {
        await testHelper.cleanDB();
    });
    test("the lesson specified is pending", async () => {
        expect.assertions(1);
        bookingDao.getPendingWaitingBookings(student).then((bookings) => {
            const bookingsIDs = bookings.map(_bookings => _bookings.scheduleId);
            expect(bookingsIDs).toContain(lecture);
        })
    });
});

describe("getStudentCourses", () => {
    let student, course;
    beforeEach(async () => {
        await testHelper.initDB();
        student = await testHelper.insertStudent();
        const teacher = await testHelper.insertTeacher();
        course = await testHelper.insertCourse('Software engineering 2', teacher);
        await testHelper.enrollStudentToCourse(student, course);
    });
    afterEach(async () => {
        await testHelper.cleanDB();
    });
    test('The inserted course figures', () => {
        expect.assertions(1);
        bookingDao.getStudentCourses(student).then((courses) => {
            const courseIDs = courses.map(_courses => _courses.courseId);
            expect(courseIDs).toContain(course);
        });
    });
});

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
    let lecture, course, user1;
    beforeEach(async () => {
        //await testHelper.initDB();
        user1 = await testHelper.insertStudent();
        const teacher = await testHelper.insertTeacher();
        course = await testHelper.insertCourse('Software engineering 2', teacher);
        lecture = await testHelper.insertCourseSchedule(course);
        await testHelper.enrollStudentToCourse(user1, course);
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
    test('student put in waiting list', async(done)=>{
        expect.assertions(2);
        await expect(bookingDao.bookLesson('123456', lecture)).resolves.toEqual(true);
        await testHelper.insertStudent('2');
        await testHelper.enrollStudentToCourse('2', course);
        await expect(bookingDao.bookLesson('2', lecture)).resolves.toEqual(false);
        done();
    });
});

describe("getLectureDataById", () => {
    let lecture;
    beforeEach(async () => {
        await testHelper.initDB();
        await testHelper.insertStudent();
        const teacher = await testHelper.insertTeacher();
        const course = await testHelper.insertCourse('Software engineering 2', teacher);
        lecture = await testHelper.insertCourseSchedule(course);
    });
    afterEach(async () => {
        await testHelper.cleanDB();
    });
    test("The data of the lecture are the ones expected", () => {
        expect.assertions(1);
        bookingDao.getLectureDataById(lecture).then((row) => {
            expect(row.CourseName).toEqual('Software engineering 2');
        });
    });
});

describe("checkWaitingList", () => {
    let lecture, student;
    beforeEach(async () => {
        await testHelper.initDB();
        student = await testHelper.insertStudent();
        const teacher = await testHelper.insertTeacher();
        const course = await testHelper.insertCourse('Software engineering 2', teacher);
        lecture = await testHelper.insertCourseSchedule(course);
        await testHelper.enrollStudentToCourse(student, course);
        await testHelper.insertBooking(student, lecture);
        await testHelper.modifyBookingasPending(student, lecture);
    });
    afterEach(async () => {
        await testHelper.cleanDB();
    });
    test("pending student becomes booked student", () => {
        expect.assertions(2);
        bookingDao.checkWaitingList(lecture).then(async (row) => {
            const userName = row.studentID;
            const lesson = row.lectureID;
            expect(userName).toEqual(student);
            expect(lesson).toEqual(lecture);
        }).catch(error => {
            console.log(error);
        });
    });
});

describe("generateStudentTracing", () => {
    let student;
    beforeEach(async () => {
        await testHelper.initDB();
        student = await testHelper.insertStudent();
        const teacher = await testHelper.insertTeacher();
        const course = await testHelper.insertCourse('Software engineering 2', teacher);
        const lecture = await testHelper.insertCourseSchedule(course);
        await testHelper.enrollStudentToCourse(student, course);
        await testHelper.insertBooking(student, lecture);
    });
    afterEach(async () => {
        await testHelper.cleanDB();
    });
    test("The pdf file retrieved are the ones needed", async () => {
        try {
            expect.assertions(1);
            const result = await bookingDao.generateStudentTracing(student, 'pdf');
            expect(result).toBe(student+'_studentTracing.pdf');
        } catch (error) {
            console.log(error);
        }
    });
    /*test("The csv file retrieved are the ones needed", async ()=>{
        try {
            expect.assertions(1);
            const result = await bookingDao.generateStudentTracing(student,'csv');
            expect(result).toBe('studentTracing.csv');
        } catch (error) {
            console.log(error);
        }
    });*/
});

describe("generateTeacherTracing", () => {
    let teacher;
    beforeEach(async () => {
        await testHelper.initDB();
        const student = await testHelper.insertStudent();
        teacher = await testHelper.insertTeacher();
        const course = await testHelper.insertCourse('Software engineering 2', teacher);
        const lecture = await testHelper.insertCourseSchedule(course);
        await testHelper.enrollStudentToCourse(student, course);
        await testHelper.insertBooking(student, lecture);
    });
    afterEach(async () => {
        await testHelper.cleanDB();
    });
    test("The file retrieved are the ones needed", async (done) => {
        expect.assertions(1);
        try {
            const result = await bookingDao.generateTeacherTracing(teacher, 'pdf');
            expect(result).toBe(teacher+'_teacherTracing.pdf');
            done();
        } catch (error) {
            console.log(error);
        }
    });
});


