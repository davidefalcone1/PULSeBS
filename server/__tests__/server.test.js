"use strict";
jest.setMock("../db", require("../__mocks__/db.mock"));
const testHelper = require('./testHelper');
const app = require('../app');
const request = require('supertest');
const BookingData = require('../dao/BookingData');
const { getLectureFromBooking } = require("./testHelper");

describe("/users/authenticate", ()=>{
    const url = "/users/authenticate";
    beforeAll(async ()=>{
        await testHelper.initDB();
        await testHelper.insertStudent();
    });
    afterAll(async ()=>{
        await testHelper.cleanDB();
    });
    test("username is undefined", done=>{
        request(app).post(url).send({
            username: undefined,
            password: "adminadmin"
        }).expect(500, done);
    });
    test("password is undefined", done=>{
        request(app).post(url).send({
            username: "davide.falcone@studenti.polito.it",
            password: undefined
        }).expect(500, done);
    });
    test("user does not exist", done=>{
        request(app).post(url).send({
            username: "davidcone@studenti.polito.it",
            password: "adminadmin"
        }).expect(401, done);
    });
    test("invalid password", done=>{
        request(app).post(url).send({
            username: "davidcone@studenti.polito.it",
            password: "adminadmin"
        }).expect(401, done);
    });
    test("login successful", done=>{
        request(app).post(url).send({
            username: "davide.falcone@studenti.polito.it",
            password: "adminadmin"
        }).expect(200, done);
    });
});

describe("logout", ()=>{
    const url = "/users/authenticate";
    let userCookie;
    beforeAll(async ()=>{
        await testHelper.initDB();
        await testHelper.insertStudent();
        const response = await request(app).post('/users/authenticate').send({
            username: 'davide.falcone@studenti.polito.it',
            password: 'adminadmin'
        });
        userCookie = response.headers['set-cookie'];
    });
    afterAll(async ()=>{
        await testHelper.cleanDB();
    });
    test("logout", done=>{
        request(app).post('/logout').set('Cookie', userCookie).expect(200, done);
    });
});

describe('/deleteBooking/:lessonID', ()=>{
    const url = '/deleteBooking/';
    let userCookie, lecture;
    beforeAll(async ()=>{
        await testHelper.initDB();
        const student = await testHelper.insertStudent();
        const teacher = await testHelper.insertTeacher();
        const course = await testHelper.insertCourse('Software engineering 2', teacher);
        lecture = await testHelper.insertCourseSchedule(course);
        await testHelper.enrollStudentToCourse(student, course);
        const booking = await testHelper.insertBooking(student, lecture);
        const response = await request(app).post('/users/authenticate').send({
            username: 'davide.falcone@studenti.polito.it',
            password: 'adminadmin'
        });
        userCookie = response.headers['set-cookie'];
    });
    afterAll(async ()=>{
        await testHelper.cleanDB();
    });
    test("lesson exists", done=>{
        request(app).delete(url+lecture).set('Cookie', userCookie).expect(200, done);
    });
    test("lesson does not exists", done=>{
        request(app).delete(url+'288').set('Cookie', userCookie).expect(500, done);
    });
});

describe('/myBookableLessons', ()=>{
    const url = '/myBookableLessons';
    let userCookie;
    beforeEach(async()=>{
        await testHelper.initDB();
        const user = await testHelper.insertStudent();
        const teacher = await testHelper.insertTeacher();
        const course = await testHelper.insertCourse('Software engineering 2', teacher);
        const lecture = await testHelper.insertCourseSchedule(course);
        await testHelper.enrollStudentToCourse(user, course);
        const response = await request(app).post('/users/authenticate').send({
            username: 'davide.falcone@studenti.polito.it',
            password: 'adminadmin'
        });
        userCookie = response.headers['set-cookie'];
    });
    afterEach(async()=>{
        await testHelper.cleanDB();
    });
    test('', done=>{
        request(app).get(url).set('Cookie', userCookie).expect(200, done);
    });
});

describe('/myBookedLessons', ()=>{
    const url = '/myBookedLessons';
    let userCookie, student, lecture;
    beforeEach(async()=>{
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
    afterEach(async()=>{
        await testHelper.cleanDB();
    });
    test('lesson booked', async ()=>{
        expect.assertions(1);
        const expectedBookingID = await testHelper.insertBooking(student, lecture);
        await request(app).get(url).set('Cookie', userCookie).then(function(res){
            const lectureIDs = res.body.map(booking=>booking.scheduleId);
            expect(lectureIDs).toContain(lecture);
        });
    });
    test('lesson not booked', async()=>{
        expect.assertions(1);
        await request(app).get(url).set('Cookie', userCookie).then(function(res){
            const lectureIDs = res.body.map(booking=>booking.scheduleId);
            expect(lectureIDs).not.toContain(lecture);
        });
    });
});

describe('/studentCourses', ()=>{
    const url = '/studentCourses';
    let userCookie, student, course;
    beforeAll(async()=>{
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
    afterAll(async()=>{
        await testHelper.cleanDB();
    });
    test('not enrolled', async ()=>{
        expect.assertions(1);
        await request(app).get(url).set('Cookie', userCookie).then(function(res){
            const coursesIDs = res.body.map(course=>course.courseId);
            expect(coursesIDs).not.toContain(course);
        });
    });
    test('enrolled', async()=>{
        expect.assertions(1);
        await testHelper.enrollStudentToCourse(student, course);
        await request(app).get(url).set('Cookie', userCookie).then(function(res){
            const coursesIDs = res.body.map(course=>course.courseId);
            expect(coursesIDs).toContain(course);
        });
    })
});

describe('/myBookableLessons', ()=>{
    const url = '/myBookableLessons';
    let userCookie, student, lecture, course;
    beforeAll(async()=>{
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
    afterAll(async()=>{
        await testHelper.cleanDB();
    });
    test('not bookable', async ()=>{
        expect.assertions(1);
        await request(app).get(url).set('Cookie', userCookie).then(function(res){
            const lectureIDs = res.body.map(lecture=>lecture.lectureId);
            expect(lectureIDs).not.toContain(lecture);
        });
    });
    test('bookable', async()=>{
        expect.assertions(1);
        await testHelper.enrollStudentToCourse(student, course);
        await request(app).get(url).set('Cookie', userCookie).then(function(res){
            const lectureIDs = res.body.map(lecture=>lecture.scheduleId);
            expect(lectureIDs).toContain(lecture);
        });
    });
});

describe('/myBookedLessons', ()=>{
    const url = '/myBookedLessons';
    let userCookie, student, lecture;
    beforeAll(async()=>{
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
    afterAll(async()=>{
        await testHelper.cleanDB();
    });
    test('not booked', async ()=>{
        expect.assertions(1);
        await request(app).get(url).set('Cookie', userCookie).then(function(res){
            const lectureIDs = res.body.map(booking=>booking.scheduleId);
            expect(lectureIDs).not.toContain(lecture);
        });
    });
    test('booked', async ()=>{
        expect.assertions(1);
        await testHelper.insertBooking(student, lecture);
        await request(app).get(url).set('Cookie', userCookie).then(function(res){
            const lectureIDs = res.body.map(booking=>booking.scheduleId);
            expect(lectureIDs).toContain(lecture);
        });
    });
});

describe('/teacherCourses', ()=>{
    const url = '/teacherCourses';
    let userCookie, course, teacher;
    beforeAll(async()=>{
        await testHelper.initDB();
        teacher = await testHelper.insertTeacher();
        const response = await request(app).post('/users/authenticate').send({
            username: 'mario.rossi@polito.it',
            password: 'adminadmin'
        });
        userCookie = response.headers['set-cookie'];
    });
    afterAll(async()=>{
        await testHelper.cleanDB();
    });
    test('no courses for teacher', async()=>{
        expect.assertions(1);
        await request(app).get(url).set('Cookie', userCookie).then(function(res){
            const courseNames = res.body.map(course=>course.courseName);
            expect(courseNames).not.toContain('Software engineering 2');
        });
    });
    test('there is a course taught by the professor', async ()=>{
        course = await testHelper.insertCourse('Software engineering 2', teacher);
        await request(app).get(url).set('Cookie', userCookie).then(function(res){
            const courseIDs = res.body.map(course=>course.courseId);
            expect(courseIDs).toContain(course);
        });
    });
});
