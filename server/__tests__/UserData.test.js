"use strict"
const UserData = require("../dao/UserData");

describe("UserData costructor test", () => {
it('works', () => {
    const obj = new UserData(1,'141216','Marco','marco@polito.it');
    if(obj.id){
        expect(obj.id).toBe(1);
    }
    expect(obj.personId).toBe('141216');
    expect(obj.fullName).toBe('Marco');
    expect(obj.email).toBe('marco@polito.it');
  })
});