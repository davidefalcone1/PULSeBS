'use strict';
jest.setMock("../db", require("../db.mock"));
const db = require('../db')
const User = require('./User');
const userDao = require('./userDao');

describe("getUser", ()=>{
    beforeEach(()=>{
        const sql = "INSERT INTO User(UserID, FullName, UserName, Password, AccessLevel) VALUES('275330', 'John Doe', 'john@polito.it', '$2b$12$7iALJ38k/PBlAB7b8JDksu7v85z.tjnC9XfoMdUJd75bIId87Ip2S', 1)";
        db.run((sql), function (err, rows){
            if(err)
                console.log(err);
        });
    });
    afterEach(()=>{
        const sql = "DELETE FROM User WHERE UserID='275330'";
        db.run((sql), function (err, rows){
            if(err)
                console.log(err);
        });
    });
    it("user exists", ()=>{
        expect.assertions(1);
        const expectedUser = new User("275330", "john@polito.it", "$2b$12$7iALJ38k/PBlAB7b8JDksu7v85z.tjnC9XfoMdUJd75bIId87Ip2S", 1);
        return userDao.getUser("john@polito.it")
            .then(user=>expect(user).toEqual(expectedUser));
    });
    it("user doesn't exists", ()=>{
        expect.assertions(1);
        return userDao.getUser("joshn@polito.it")
            .then(user=>expect(user).toBeUndefined());
    })
});

describe("checkPassword", ()=>{
    beforeAll(()=>{
        const sql = "INSERT INTO User(UserID, FullName, UserName, Password, AccessLevel) VALUES('275330', 'John Doe', 'john@polito.it', '$2b$12$7iALJ38k/PBlAB7b8JDksu7v85z.tjnC9XfoMdUJd75bIId87Ip2S', 1)";
        db.run((sql), function (err, rows){
            if(err)
                console.log(err);
        });
    });
    afterAll(()=>{
        const sql = "DELETE FROM User WHERE UserID='275330'";
        db.run((sql), function (err, rows){
            if(err)
                console.log(err);
        });
    });
    test("password ok", ()=>{
        const user = new User("275330", "john@polito.it", "$2b$12$7iALJ38k/PBlAB7b8JDksu7v85z.tjnC9XfoMdUJd75bIId87Ip2S", 1);
        expect(userDao.checkPassword(user, "adminadmin")).toBeTruthy();
    });
    test("password wrong", ()=>{
        const user = new User("275330", "john@polito.it", "$2b$12$7iALJ38k/PBlAB7b8JDksu7v85z.tjnC9XfoMdUJd75bIId87Ip2S", 1);
        expect(userDao.checkPassword(user, "adminadmn")).toBeFalsy();
    })
});