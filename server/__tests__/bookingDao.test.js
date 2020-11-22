"use strict";
/* I used setTimeout() because test start to run before DB initialization ends.
    Another solution is to substitute sqlite3 node module with sqlite node module,
    since the latter supports await/async mechanisms */
jest.setMock("../db", require("../__mocks__/db.mock"));
const testHelper = require("./testHelper");
const bookingDao = require('../dao/bookingDao');

const db = require("../db");

describe("deleteBooking", ()=>{
    beforeEach(async ()=>{
        await testHelper.initDB();
        await testHelper.insertUser();
        await testHelper.insertBooking();
    });
    afterEach(async ()=>{
        await testHelper.cleanDB();
    });
    test("booking exists", ()=>{                                                                                                                            
        expect.assertions(1);
        expect(bookingDao.deleteBooking(1, '123456')).resolves.toEqual('Success');
    });
    test("booking does not exist", async()=>{
        expect.assertions(1);
        expect(bookingDao.deleteBooking(345, '123456')).rejects.toEqual('NO BOOKING');
    });
});

describe("bookLesson", ()=>{
    beforeEach(async ()=>{
        await testHelper.initDB();
        await testHelper.insertUser();
        await testHelper.insertBooking();
    });
    afterEach(async ()=>{
        await testHelper.cleanDB();
    });
    test("the lesson exists and can be booked", ()=>{
        expect.assertions(1);
        expect(bookingDao.bookLesson('123456', 1)).resolves.toEqual('Success');
    });
    test("the lesson does not exist and can't be booked", ()=>{
        expect.assertions(1);
        expect(bookingDao.bookLesson('123456', 134)).rejects.toEqual('Error');
    });
});