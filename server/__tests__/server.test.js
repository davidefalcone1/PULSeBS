"use strict";
jest.setMock("../db", require("../__mocks__/db.mock"));
const testHelper = require('./testHelper');
const app = require('../server');
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
    test("username is undefined", async ()=>{
        const response = await request(app).post(url).send({
            username: undefined,
            password: "adminadmin"
        });
        expect(response).toEqual({error: 'Missing username'});
    });
    test("password is undefined", async ()=>{
        const response = await request(app).post(url).send({
            username: "davide.falcone@studenti.polito.it",
            password: undefined
        });
        expect(response).toEqual({error: 'Missing username'});
    });
});