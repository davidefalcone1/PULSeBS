"use strict";
jest.setMock("../db", require("../__mocks__/db.mock"));
const testHelper = require('./testHelper');
const app = require('../app');
const request = require('supertest');
const BookingData = require('../dao/BookingData');
const { getLectureFromBooking } = require("./testHelper");
const { TestScheduler } = require("jest");
const { sendNotification } = require("../emailAPI");
jest.mock("../emailAPI", function () {
    return {
        sendNotification: function () { }
    }
});

describe("/users/authenticate", () => {
    const url = "/users/authenticate";
    beforeAll(async () => {
        await testHelper.initDB();
        await testHelper.insertStudent();
    });
    afterAll(async () => {
        await testHelper.cleanDB();
    });
    test("username is undefined", done => {
        request(app).post(url).send({
            username: undefined,
            password: "adminadmin"
        }).expect(500, done);
    });
    test("password is undefined", done => {
        request(app).post(url).send({
            username: "davide.falcone@studenti.polito.it",
            password: undefined
        }).expect(500, done);
    });
    test("user does not exist", done => {
        request(app).post(url).send({
            username: "davidcone@studenti.polito.it",
            password: "adminadmin"
        }).expect(401, done);
    });
    test("invalid password", done => {
        request(app).post(url).send({
            username: "davide.falcone@studenti.polito.it",
            password: "adminain"
        }).expect(401, done);
    });
    test("login successful", done => {
        request(app).post(url).send({
            username: "davide.falcone@studenti.polito.it",
            password: "adminadmin"
        }).expect(200, done);
    });
});

describe("/logout", () => {
    let userCookie;
    beforeAll(async () => {
        await testHelper.initDB();
        await testHelper.insertStudent();
        const response = await request(app).post('/users/authenticate').send({
            username: 'davide.falcone@studenti.polito.it',
            password: 'adminadmin'
        });
        userCookie = response.headers['set-cookie'];
    });
    afterAll(async () => {
        await testHelper.cleanDB();
    });
    test("logout", done => {
        request(app).post('/logout').set('Cookie', userCookie).expect(200, done);
    });
});

describe('/deleteBooking/:lessonID', () => {
    const url = '/deleteBooking/';
    let userCookie, lecture;
    beforeAll(async () => {
        await testHelper.initDB();
        const student = await testHelper.insertStudent();
        const teacher = await testHelper.insertTeacher();
        const course = await testHelper.insertCourse('Software engineering 2', teacher);
        lecture = await testHelper.insertCourseSchedule(course);
        await testHelper.enrollStudentToCourse(student, course);
        await testHelper.insertBooking(student, lecture);
        const response = await request(app).post('/users/authenticate').send({
            username: 'davide.falcone@studenti.polito.it',
            password: 'adminadmin'
        });
        userCookie = response.headers['set-cookie'];
    });
    afterAll(async () => {
        await testHelper.cleanDB();
    });
    test("lesson exists", done => {
        request(app).delete(url + lecture).set('Cookie', userCookie).expect(200, done);
    });
    test("lesson does not exists", done => {
        request(app).delete(url + '288').set('Cookie', userCookie).expect(500, done);
    });
});

describe('/myBookableLessons', () => {
    const url = '/myBookableLessons';
    let userCookie;
    beforeEach(async () => {
        await testHelper.initDB();
        const user = await testHelper.insertStudent();
        const teacher = await testHelper.insertTeacher();
        const course = await testHelper.insertCourse('Software engineering 2', teacher);
        await testHelper.insertCourseSchedule(course);
        await testHelper.enrollStudentToCourse(user, course);
        const response = await request(app).post('/users/authenticate').send({
            username: 'davide.falcone@studenti.polito.it',
            password: 'adminadmin'
        });
        userCookie = response.headers['set-cookie'];
    });
    afterEach(async () => {
        await testHelper.cleanDB();
    });
    test('', done => {
        request(app).get(url).set('Cookie', userCookie).expect(200, done);
    });
});

describe('/myBookedLessons', () => {
    const url = '/myBookedLessons';
    let userCookie, student, lecture;
    beforeEach(async () => {
        await testHelper.initDB();
        student = await testHelper.insertStudent();
        const teacher = await testHelper.insertTeacher();
        const course = await testHelper.insertCourse('Software engineering 2', teacher);
        lecture = await testHelper.insertCourseSchedule(course);
        await testHelper.enrollStudentToCourse(student, course);
        const response = await request(app).post('/users/authenticate').send({
            username: 'davide.falcone@studenti.polito.it',
            password: 'adminadmin'
        });
        userCookie = response.headers['set-cookie'];
    });
    afterEach(async () => {
        await testHelper.cleanDB();
    });
    test('lesson booked', async () => {
        expect.assertions(1);
        await testHelper.insertBooking(student, lecture);
        await request(app).get(url).set('Cookie', userCookie).then(function (res) {
            const lectureIDs = res.body.map(booking => booking.scheduleId);
            expect(lectureIDs).toContain(lecture);
        });
    });
    test('lesson not booked', async () => {
        expect.assertions(1);
        await request(app).get(url).set('Cookie', userCookie).then(function (res) {
            const lectureIDs = res.body.map(booking => booking.scheduleId);
            expect(lectureIDs).not.toContain(lecture);
        });
    });
});

describe('/studentCourses', () => {
    const url = '/studentCourses';
    let userCookie, student, course;
    beforeAll(async () => {
        await testHelper.initDB();
        student = await testHelper.insertStudent();
        const teacher = await testHelper.insertTeacher();
        course = await testHelper.insertCourse('Software engineering 2', teacher);
        const response = await request(app).post('/users/authenticate').send({
            username: 'davide.falcone@studenti.polito.it',
            password: 'adminadmin'
        });
        userCookie = response.headers['set-cookie'];
    });
    afterAll(async () => {
        await testHelper.cleanDB();
    });
    test('not enrolled', async () => {
        expect.assertions(1);
        await request(app).get(url).set('Cookie', userCookie).then(function (res) {
            const coursesIDs = res.body.map(_course => _course.courseId);
            expect(coursesIDs).not.toContain(course);
        });
    });
    test('enrolled', async () => {
        expect.assertions(1);
        await testHelper.enrollStudentToCourse(student, course);
        await request(app).get(url).set('Cookie', userCookie).then(function (res) {
            const coursesIDs = res.body.map(_course => _course.courseId);
            expect(coursesIDs).toContain(course);
        });
    })
});

describe('/myBookableLessons', () => {
    const url = '/myBookableLessons';
    let userCookie, student, lecture, course;
    beforeAll(async () => {
        await testHelper.initDB();
        student = await testHelper.insertStudent();
        const teacher = await testHelper.insertTeacher();
        course = await testHelper.insertCourse('Software engineering 2', teacher);
        lecture = await testHelper.insertCourseSchedule(course);
        const response = await request(app).post('/users/authenticate').send({
            username: 'davide.falcone@studenti.polito.it',
            password: 'adminadmin'
        });
        userCookie = response.headers['set-cookie'];
    });
    afterAll(async () => {
        await testHelper.cleanDB();
    });
    test('not bookable', async () => {
        expect.assertions(1);
        await request(app).get(url).set('Cookie', userCookie).then(function (res) {
            const lectureIDs = res.body.map(_lecture => _lecture.lectureId);
            expect(lectureIDs).not.toContain(lecture);
        });
    });
    test('bookable', async () => {
        expect.assertions(1);
        await testHelper.enrollStudentToCourse(student, course);
        await request(app).get(url).set('Cookie', userCookie).then(function (res) {
            const lectureIDs = res.body.map(_lecture => _lecture.scheduleId);
            expect(lectureIDs).toContain(lecture);
        });
    });
});

describe('/myBookedLessons', () => {
    const url = '/myBookedLessons';
    let userCookie, student, lecture;
    beforeAll(async () => {
        await testHelper.initDB();
        student = await testHelper.insertStudent();
        const teacher = await testHelper.insertTeacher();
        const course = await testHelper.insertCourse('Software engineering 2', teacher);
        lecture = await testHelper.insertCourseSchedule(course);
        await testHelper.enrollStudentToCourse(student, course);
        const response = await request(app).post('/users/authenticate').send({
            username: 'davide.falcone@studenti.polito.it',
            password: 'adminadmin'
        });
        userCookie = response.headers['set-cookie'];
    });
    afterAll(async () => {
        await testHelper.cleanDB();
    });
    test('not booked', async () => {
        expect.assertions(1);
        await request(app).get(url).set('Cookie', userCookie).then(function (res) {
            const lectureIDs = res.body.map(booking => booking.scheduleId);
            expect(lectureIDs).not.toContain(lecture);
        });
    });
    test('booked', async () => {
        expect.assertions(1);
        await testHelper.insertBooking(student, lecture);
        await request(app).get(url).set('Cookie', userCookie).then(function (res) {
            const lectureIDs = res.body.map(booking => booking.scheduleId);
            expect(lectureIDs).toContain(lecture);
        });
    });
});

describe('/teacherCourses', () => {
    const url = '/teacherCourses';
    let userCookie, course, teacher;
    beforeAll(async () => {
        await testHelper.initDB();
        teacher = await testHelper.insertTeacher();
        const response = await request(app).post('/users/authenticate').send({
            username: 'mario.rossi@polito.it',
            password: 'adminadmin'
        });
        userCookie = response.headers['set-cookie'];
    });
    afterAll(async () => {
        await testHelper.cleanDB();
    });
    test('no courses for teacher', async () => {
        expect.assertions(1);
        await request(app).get(url).set('Cookie', userCookie).then(function (res) {
            const courseNames = res.body.map(_course => _course.courseName);
            expect(courseNames).not.toContain('Software engineering 2');
        });
    });
    test('there is a course taught by the professor', async () => {
        expect.assertions(1);
        course = await testHelper.insertCourse('Software engineering 2', teacher);
        await request(app).get(url).set('Cookie', userCookie).then(function (res) {
            const courseIDs = res.body.map(_course => _course.courseId);
            expect(courseIDs).toContain(course);
        });
    });
});

describe('/myCoursesLessons', () => {
    const url = '/myCoursesLessons';
    let userCookie, course, lecture;
    beforeAll(async () => {
        await testHelper.initDB();
        const teacher = await testHelper.insertTeacher();
        course = await testHelper.insertCourse('Software engineering 2', teacher);
        const response = await request(app).post('/users/authenticate').send({
            username: 'mario.rossi@polito.it',
            password: 'adminadmin'
        });
        userCookie = response.headers['set-cookie'];
    });
    afterAll(async () => {
        await testHelper.cleanDB();
    });
    test('no lecture', async () => {
        expect.assertions(1);
        await request(app).get(url).set('Cookie', userCookie).then(function (res) {
            expect(res.body).toHaveLength(0);
        });
    });
    test('there is a  lecture', async () => {
        expect.assertions(1);
        lecture = await testHelper.insertCourseSchedule(course);
        await request(app).get(url).set('Cookie', userCookie).then(function (res) {
            const lectureIDs = res.body.map(_lecture => _lecture.scheduleId);
            expect(lectureIDs).toContain(lecture);
        });
    });
});

describe('/bookedStudents', () => {
    const url = '/bookedStudents';
    let userCookie, lecture, student;
    beforeAll(async () => {
        await testHelper.initDB();
        const teacher = await testHelper.insertTeacher();
        student = await testHelper.insertStudent();
        const course = await testHelper.insertCourse('Software engineering 2', teacher);
        lecture = await testHelper.insertCourseSchedule(course);
        const response = await request(app).post('/users/authenticate').send({
            username: 'mario.rossi@polito.it',
            password: 'adminadmin'
        });
        userCookie = response.headers['set-cookie'];
    });
    afterAll(async () => {
        await testHelper.cleanDB();
    });
    test('no students booked', async () => {
        expect.assertions(1);
        await request(app).post(url).send({ lessonsIds: [lecture] }).set('Cookie', userCookie).then(function (res) {
            expect(res.body).toHaveLength(0);
        });
    });
    test('there is a booked student', async () => {
        expect.assertions(1);
        const booking = await testHelper.insertBooking(student, lecture);
        await request(app).post(url).send({ lessonsIds: [lecture] }).set('Cookie', userCookie).then(function (res) {
            const bookingIDs = res.body.map(_booking => _booking.id);
            expect(bookingIDs).toContain(booking);
        });
    });
});

describe('/studentsData', () => {
    const url = '/studentsData';
    let userCookie, student;
    beforeAll(async () => {
        await testHelper.initDB();
        await testHelper.insertTeacher();
        student = await testHelper.insertStudent();
        const response = await request(app).post('/users/authenticate').send({
            username: 'mario.rossi@polito.it',
            password: 'adminadmin'
        });
        userCookie = response.headers['set-cookie'];
    });
    afterAll(async () => {
        await testHelper.cleanDB();
    });
    test('no students', async () => {
        expect.assertions(1);
        await request(app).post(url).send({ studentsIds: [] }).set('Cookie', userCookie).then(function (res) {
            expect(res.body).not.toContain(student);
        });
    });
    test('there is a student', async () => {
        expect.assertions(1);
        await request(app).post(url).send({ studentsIds: [student] }).set('Cookie', userCookie).then(function (res) {
            const studentsIds = res.body.map(_student => _student.personId);
            expect(studentsIds).toContain(student);
        });
    });
});

describe('/makeLessonRemote/:courseScheduleId', () => {
    const url = '/makeLessonRemote/';
    let userCookie, lecture;
    beforeEach(async () => {
        await testHelper.initDB();
        const teacher = await testHelper.insertTeacher();
        const course = await testHelper.insertCourse('Software engineering 2', teacher);
        lecture = await testHelper.insertCourseSchedule(course);
        const response = await request(app).post('/users/authenticate').send({
            username: 'mario.rossi@polito.it',
            password: 'adminadmin'
        });
        userCookie = response.headers['set-cookie'];
    });
    afterEach(async () => {
        await testHelper.cleanDB();
    });
    test('lecture does not exist', async () => {
        expect.assertions(1);
        await request(app).put(url + 678).set('Cookie', userCookie).then(function (res) {
            expect(res.body).toEqual(0);
        });
    });
    test('lecture exist', async () => {
        expect.assertions(1);
        await request(app).put(url + lecture).set('Cookie', userCookie).then(function (res) {
            expect(res.body).toEqual(1);
        });
    });
});

describe('/cancelLesson/:courseScheduleId', () => {
    const url = '/cancelLesson/';
    let userCookie, lecture;
    beforeEach(async () => {
        await testHelper.initDB();
        const teacher = await testHelper.insertTeacher();
        const course = await testHelper.insertCourse('Software engineering 2', teacher);
        await testHelper.insertCourseSchedule(course);
        const response = await request(app).post('/users/authenticate').send({
            username: 'mario.rossi@polito.it',
            password: 'adminadmin'
        });
        userCookie = response.headers['set-cookie'];
    });
    afterEach(async () => {
        await testHelper.cleanDB();
    });
    test('lecture does not exist', async () => {
        expect.assertions(1);
        await request(app).delete(url + 678).set('Cookie', userCookie).then(function (res) {
            expect(res.body).toEqual(0);
        });
    });
});

describe('/user', () => {
    const url = '/user';
    let userCookie, teacher;
    beforeEach(async () => {
        await testHelper.initDB();
        teacher = await testHelper.insertTeacher();
        const response = await request(app).post('/users/authenticate').send({
            username: 'mario.rossi@polito.it',
            password: 'adminadmin'
        });
        userCookie = response.headers['set-cookie'];
    });
    afterEach(async () => {
        await testHelper.cleanDB();
    });
    test('user is authenticated', async () => {
        expect.assertions(1);
        await request(app).get(url).set('Cookie', userCookie).then(function (res) {
            expect(res.body.userID).toEqual(teacher);
        });
    });
    test('user not authenticated', async () => {
        await request(app).post('/logout').set('Cookie', userCookie).expect(200);
        await request(app).get(url).expect(401);
    });
});

describe('/bookLesson', () => {
    const url = '/bookLesson';
    let userCookie, lecture, student;
    beforeEach(async () => {
        await testHelper.initDB();
        const teacher = await testHelper.insertTeacher();
        student = await testHelper.insertStudent();
        const course = await testHelper.insertCourse('Software engineering 2', teacher);
        lecture = await testHelper.insertCourseSchedule(course);
        await testHelper.enrollStudentToCourse(student, course);
        const response = await request(app).post('/users/authenticate').send({
            username: 'davide.falcone@studenti.polito.it',
            password: 'adminadmin'
        });
        userCookie = response.headers['set-cookie'];
    });
    afterEach(async () => {
        await testHelper.cleanDB();
    });
    test('lecture exists', async () => {
        expect.assertions(1);
        await request(app).post(url).set('Cookie', userCookie).send({ lessonId: lecture }).expect(200);
        await request(app).get('/myBookedLessons').set('Cookie', userCookie).expect(200).then(function (res) {
            const lectureIDs = res.body.map(booking => booking.scheduleId);
            expect(lectureIDs).toContain(lecture);
        });
    });
});


