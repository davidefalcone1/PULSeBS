const User = require('./User');
const userDao = require('./userDao');

describe("getUser", ()=>{
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
    test("password ok", ()=>{
        const user = new User("275330", "john@polito.it", "$2b$12$7iALJ38k/PBlAB7b8JDksu7v85z.tjnC9XfoMdUJd75bIId87Ip2S", 1);
        expect(userDao.checkPassword(user, "adminadmin")).toBeTruthy();
    });
    test("password wrong", ()=>{
        const user = new User("275330", "john@polito.it", "$2b$12$7iALJ38k/PBlAB7b8JDksu7v85z.tjnC9XfoMdUJd75bIId87Ip2S", 1);
        expect(userDao.checkPassword(user, "adminadmn")).toBeFalsy();
    })
});