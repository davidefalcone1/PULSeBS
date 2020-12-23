"use strict"
const CourseBasicSchedule = require("../dao/CourseBasicSchedule");
const moment = require('moment');

describe("CourseBasicSchedule costructor test", () => {
it('works', () => {
    const obj = new CourseBasicSchedule(1,1,moment(new Date('16-11-2020')),moment(new Date('16-11-2020 14:00')),moment(new Date('16-11-2020 17:00')),1);
    expect(obj.id).toBe(1);
    expect(obj.courseId).toBe(1);
    expect(obj.day).toBe(moment(new Date('16-11-2020')));
    expect(obj.startTime).toBe(moment(new Date('16-11-2020 14:00')));
    expect(obj.endTime).toBe(moment(new Date('16-11-2020 17:00')));
    expect(obj.classroom).toBe(1);
  })
});