'use strict';
/* I used setTimeout() because test start to run before DB initialization ends.
    Another solution is to substitute sqlite3 node module with sqlite node module,
    since the latter supports await/async mechanisms */
jest.setMock("../db", require("../__mocks__/db.mock"));
const testHelper = require('./testHelper');
const emailDao = require('../dao/emailDao');

const db = require("../db");

async function insertCourseTomorrow(){
    const sql = 'INSERT INTO CourseSchedule(CourseID, CourseStatus, CourseType, TimeStart, TimeEnd, OccupiedSeat, MaxSeat, Classroom)' +
        " VALUES(1, 1, 1, DATETIME('now', '+1 day', 'localtime'), DATETIME('now', '+1 day', '+1 hour', 'localtime'), 1, 50 ,'A1')";
    await db.pRun(sql);
}

describe('getProfessorsToNotify', ()=>{
    afterEach(async ()=>{
        await testHelper.cleanDB();
    });
    beforeEach(async ()=>{
        await testHelper.initDB();
    });
    test('no courses tomorrow', ()=>{
        expect.assertions(1);
        return emailDao.getProfessorsToNotify()
            .then((profList)=>expect(profList).toHaveLength(0));
    });
    test('there is only a course tomorrow', async ()=>{
        await insertCourseTomorrow();
        expect.assertions(1);
        return emailDao.getProfessorsToNotify()
            .then((profList)=>{
                expect(profList[0].email).toEqual('marco@polito.it');
            });
    });
});