"use strict";

jest.setMock("../db", require("../__mocks__/db.mock"));
const testHelper = require('./testHelper');
const teacherDao = require('../dao/teacherDao');
const bookingData = require('../dao/BookingData');
const db = require("../db");
const BookingData = require("../dao/BookingData");


describe("getBookedStudents", () => {
    let lecture, student;
    beforeAll(async () => {
        await testHelper.initDB();
        student = await testHelper.insertStudent();
        const teacher = await testHelper.insertTeacher();
        const course = await testHelper.insertCourse('Software engineering 2', teacher);
        lecture = await testHelper.insertCourseSchedule(course);
        await testHelper.enrollStudentToCourse(student, course);
    });
    afterAll(async () => {
        await testHelper.cleanDB();
    });
    test("No students booked", () => {
        expect.assertions(1);
        return teacherDao.getBookedStudents([lecture])
            .then((bookedStudents) => expect(bookedStudents).toHaveLength(0));
    });
    test("One student is booked", async () => {
        expect.assertions(1);
        testHelper.insertBooking(student, lecture);
        return teacherDao.getBookedStudents([lecture])
            .then((bookedStudents) => {
                const IDs = bookedStudents.map(s => s.studentId);
                expect(IDs).toContain(student);
            });
    });
});

describe("getTeacherCourses", () => {
    let teacher, course;
    beforeAll(async () => {
        await testHelper.initDB();
        teacher = await testHelper.insertTeacher();
        course = await testHelper.insertCourse('Software engineering 2', teacher);
    });
    afterAll(async () => {
        await testHelper.cleanDB();
    });
    test("The course inserted figures in the ones led by the teacher", async () => {
        expect.assertions(1);
        return teacherDao.getTeacherCourses(teacher).then((teacherCourses) => {
            const CourseIDs = teacherCourses.map(c => c.courseId);
            expect(CourseIDs).toContain(course);
        });
    });
});

describe("getCourseStatistics", () => {
    let teacher, course;
    beforeAll(async () => {
        await testHelper.initDB();
        teacher = await testHelper.insertTeacher();
        course = await testHelper.insertCourse('Software engineering 2', teacher);
    });
    afterAll(async () => {
        await testHelper.cleanDB();
    });
    test("The course inserted figures in the ones led by the teacher", async () => {
        expect.assertions(1);
        return teacherDao.getCoursesStatistics(teacher).then((teacherCourses) => {
            const CourseIDs = teacherCourses.map(c => c.courseId);
            expect(CourseIDs).toContain(course);
        });
    });
});

describe("getMyCoursesLessons", () => {
    let teacher, course, lecture;
    beforeAll(async () => {
        await testHelper.initDB();
        teacher = await testHelper.insertTeacher();
        course = await testHelper.insertCourse('Software engineering 2', teacher);
        lecture = await testHelper.insertCourseSchedule(course);
    });
    afterAll(async () => {
        await testHelper.cleanDB();
    });
    test("The lecture inserted figures in the ones led by the teacher", async () => {
        expect.assertions(1);
        return teacherDao.getMyCoursesLessons(teacher).then((teacherLessons) => {
            const LessonsIDs = teacherLessons.map(c => c.scheduleId);
            expect(LessonsIDs).toContain(lecture);
        });
    });
});

describe("getLessonsStatistics", () => {
    let teacher, course, lecture;
    beforeAll(async () => {
        await testHelper.initDB();
        teacher = await testHelper.insertTeacher();
        course = await testHelper.insertCourse('Software engineering 2', teacher);
        lecture = await testHelper.insertCourseSchedule(course);
    });
    afterAll(async () => {
        await testHelper.cleanDB();
    });
    test("The lecture inserted figures in the ones led by the teacher", async () => {
        expect.assertions(1);
        return teacherDao.getLessonsStatistics(teacher).then((teacherLessons) => {
            const LessonsIDs = teacherLessons.map(c => c.scheduleId);
            expect(LessonsIDs).toContain(lecture);
        });
    });
});

describe("getStudentsData", () => {
    let students = new Array();
    beforeEach(async () => {
        await testHelper.initDB();
        students[0] = await testHelper.insertStudent();
    });
    afterEach(async () => {
        await testHelper.cleanDB();
    });
    test('The students data retrieved are the ones expected', () => {
        expect.assertions(1);
        return teacherDao.getStudentsData(students).then((users) => {
            const usersIDs = users.map(u => u.personId);
            expect(usersIDs).toContain(students[0]);
        });
    });
});


describe("cancelAllBooking", () => {
    let lecture, student, booking;
    beforeAll(async () => {
        await testHelper.initDB();
        student = await testHelper.insertStudent();
        const teacher = await testHelper.insertTeacher();
        const course = await testHelper.insertCourse('Software engineering 2', teacher);
        lecture = await testHelper.insertCourseSchedule(course);
        await testHelper.enrollStudentToCourse(student, course);
        booking = await testHelper.insertBooking(student, lecture);
    });
    afterAll(async () => {
        await testHelper.cleanDB();
    });
    test("The booking is cancelled", async () => {
        expect.assertions(1);
        await teacherDao.cancelAllBooking(lecture);
        const BookStatus = await testHelper.getBookStatusFromBooking(booking);
        expect(BookStatus).toEqual("4");
    });
});

describe("setStudentAsPresent", () => {
    let lecture, student;
    beforeAll(async () => {
        await testHelper.initDB();
        student = await testHelper.insertStudent();
        const teacher = await testHelper.insertTeacher();
        const course = await testHelper.insertCourse('Software engineering 2', teacher);
        lecture = await testHelper.insertCourseSchedule(course);
        await testHelper.enrollStudentToCourse(student, course);
        await testHelper.insertBooking(student, lecture);
    });
    afterAll(async () => {
        await testHelper.cleanDB();
    });
    test("The student is set as present", async () => {
        expect.assertions(1);
        await teacherDao.setStudentAsPresent(lecture, student);
        const attended = await testHelper.getStudentStatusAboutBooking(lecture, student);
        expect(attended).toEqual("1");
    });
});

describe("setStudentAsNotPresent", () => {
    let lecture, student;
    beforeAll(async () => {
        await testHelper.initDB();
        student = await testHelper.insertStudent();
        const teacher = await testHelper.insertTeacher();
        const course = await testHelper.insertCourse('Software engineering 2', teacher);
        lecture = await testHelper.insertCourseSchedule(course);
        await testHelper.enrollStudentToCourse(student, course);
        await testHelper.insertBooking(student, lecture);
    });
    afterAll(async () => {
        await testHelper.cleanDB();
    });
    test("The student is set as not present", async () => {
        expect.assertions(1);
        await teacherDao.setStudentAsNotPresent(lecture, student);
        const attended = await testHelper.getStudentStatusAboutBooking(lecture, student);
        expect(attended).toEqual("0");
    });
});


describe("updateLessonType", () => {
    let teacher, course, lecture;
    beforeAll(async () => {
        await testHelper.initDB();
        teacher = await testHelper.insertTeacher();
        course = await testHelper.insertCourse('Software engineering 2', teacher);
        lecture = await testHelper.insertCourseSchedule(course);
    });
    afterAll(async () => {
        await testHelper.cleanDB();
    });
    test("The lesson type is updated", async () => {
        expect.assertions(1);
        await teacherDao.updateLessonType(lecture, "0");
        const lessonType = await testHelper.getLessonType(lecture);
        expect(lessonType).toEqual("0");
    });
});

describe("updateLessonStatus", () => {
    let teacher, course, lecture;
    beforeAll(async () => {
        await testHelper.initDB();
        teacher = await testHelper.insertTeacher();
        course = await testHelper.insertCourse('Software engineering 2', teacher);
        lecture = await testHelper.insertCourseSchedule(course);
    });
    afterAll(async () => {
        await testHelper.cleanDB();
    });
    test("The lesson status is updated", async () => {
        expect.assertions(1);
        await teacherDao.updateLessonStatus(lecture, "0");
        const lessonType = await testHelper.getLessonStatus(lecture);
        expect(lessonType).toEqual("0");
    });
});

