"use strict";
/* I used setTimeout() because test start to run before DB initialization ends.
    Another solution is to substitute sqlite3 node module with sqlite node module,
    since the latter supports await/async mechanisms */
jest.setMock("../db", require("../__mocks__/db.mock"));
const testHelper = require("./testHelper");
const bookingDao = require('../dao/bookingDao');

const db = require("../db");

async function insertBooking() {
    const sql = 'INSERT INTO Booking(CourseScheduleID, StudentID, BookStatus, Attended)' +
        " VALUES(1, '123456', 1, 0)";
    await db.pRun(sql);
}

describe("deleteBooking", ()=>{
    beforeEach(async ()=>{
        await testHelper.initDB();
        await testHelper.insertUser();
        await insertBooking();
    });
    afterEach(async ()=>{
        await testHelper.cleanDB();
    });
    test("booking exists", ()=>{                                                                                                                            
        expect.assertions(1);
        return bookingDao.deleteBooking(1, '123456').then((result)=>expect(result).toBeNull());
    });
    test("booking does not exist", async()=>{
        expect.assertions(1);
            expect(bookingDao.deleteBooking(454, '123456')).rejects.toEqual('NO BOOKING');
    });
});

describe("bookLesson", ()=>{
    beforeEach(async ()=>{
        await testHelper.initDB();
    });
    afterEach(async ()=>{
        await testHelper.cleanDB();
    });
    test("the lesson exists and can be booked", ()=>{
        expect.assertions(1);
            return bookingDao.bookLesson('123456',1).then((result)=>expect(result).toEqual('Success'));
    });
    test("the lesson does not exist and can't be booked", async()=>{
        expect.assertions(1);
        await expect(bookingDao.bookLesson('123456',454)).rejects.toEqual('Error');
    });
});