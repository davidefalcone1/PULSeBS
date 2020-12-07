'use strict';
/* I used setTimeout() because test start to run before DB initialization ends.
    Another solution is to substitute sqlite3 node module with sqlite node module,
    since the latter supports await/async mechanisms */
jest.setMock("../db", require("../__mocks__/db.mock"));
const testHelper = require('./testHelper');
const emailDao = require('../dao/emailDao');

const db = require("../db");

describe('getProfessorsToNotify', ()=>{
    let course, teacher;
    afterEach(async ()=>{
        await testHelper.cleanDB();
    });
    beforeEach(async ()=>{
        await testHelper.initDB();
        teacher = await testHelper.insertTeacher();
        course = await testHelper.insertCourse('Software engineering 2', teacher);
    });
    test('no lectures tomorrow', ()=>{
        expect.assertions(1);
        return emailDao.getProfessorsToNotify()
            .then((profList)=>expect(profList).toHaveLength(0));
    });
    test('there is a lecture tomorrow', async ()=>{
        expect.assertions(1);
        await testHelper.insertCourseSchedule(course);
        return emailDao.getProfessorsToNotify()
            .then(async(profList)=>{
                const expectedEmail = await testHelper.getUserEmail(teacher);
                const emails = profList.map(prof=>prof.email);
                expect(emails).toContain(expectedEmail);
            });
    });
});