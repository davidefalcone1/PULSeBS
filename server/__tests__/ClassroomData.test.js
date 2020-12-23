"use strict"
const ClassroomData = require("../dao/ClassroomData");

describe("ClassroomData costructor test", () => {
it('works', () => {
    const obj = new ClassroomData(1,'Aula 1',120);
    expect(obj.classId).toBe(1);
    expect(obj.classroomName).toBe('Aula 1');
    expect(obj.maxSeats).toBe(120);
  })
});