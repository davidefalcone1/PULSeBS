"use strict";
jest.setMock("../db", require("../__mocks__/db.mock"));
const testHelper = require('./testHelper');
const app = require('../app');
const request = require('supertest');

describe("/users/authenticate", ()=>{
    const url = "/users/authenticate";
    beforeAll(async ()=>{
        await testHelper.initDB();
        await testHelper.insertUser();
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
        await testHelper.insertUser();
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
    let userCookie;
    beforeAll(async ()=>{
        await testHelper.initDB();
        await testHelper.insertUser();
        await testHelper.insertCourseSchedule();
        await testHelper.insertBooking();
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
        request(app).delete(url+'1').set('Cookie', userCookie).expect(200, done);
    });
    test("lesson does not exists", done=>{
        request(app).delete(url+'288').set('Cookie', userCookie).expect(500, done);
    });
});