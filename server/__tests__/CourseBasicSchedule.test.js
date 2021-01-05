"use strict"
const CourseBasicSchedule = require("../dao/CourseBasicSchedule");
const moment = require('moment');

describe("CourseBasicSchedule costructor test", () => {
it('works', () => {
    const obj = new CourseBasicSchedule(1,1,'Mon','02:00','03:00','A1');
    expect(obj.id).toBe(1);
  })
});