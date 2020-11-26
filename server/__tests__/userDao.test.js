'use strict';
jest.setMock("../db", require("../__mocks__/db.mock"));
const User = require('../dao/User');
const userDao = require('../dao/userDao');
const testHelper = require('./testHelper');


describe("getUser", ()=>{
    beforeEach(async ()=>{
        await testHelper.initDB();
    });
    afterEach(async ()=>{
        await testHelper.cleanDB();
    });
    test("user exists", async ()=>{
        await testHelper.insertStudent();
        expect.assertions(1);
        return userDao.getUser("davide.falcone@studenti.polito.it")
            .then(user=>expect(user.userID).toEqual('123456'));
    });
    test("user doesn't exists", ()=>{
        expect.assertions(1);
        return userDao.getUser("davide.falcone@studenti.polito.it")
            .then(user=>expect(user).toBeUndefined());
    })
});

describe("checkPassword", ()=>{
    beforeAll(async ()=>{
        await testHelper.initDB();
        await testHelper.insertStudent();
    });
    afterAll(async ()=>{
        await testHelper.cleanDB();
    });
    test("password ok", ()=>{
        const user = new User("123456", "Davide Falcone", "davide.falcone@studenti.polito.it", "$2b$12$7iALJ38k/PBlAB7b8JDksu7v85z.tjnC9XfoMdUJd75bIId87Ip2S", 1);
        expect(userDao.checkPassword(user, "adminadmin")).toBeTruthy();
    });

    test("password wrong", ()=>{
        const user = new User("123456", "Davide Falcone", "davide.falcone@studenti.polito.it", "$2b$12$7iALJ38k/PBlAB7b8JDksu7v85z.tjnC9XfoMdUJd75bIId87Ip2S", 1);
        expect(userDao.checkPassword(user, "adminadmn")).toBeFalsy();
    })
});