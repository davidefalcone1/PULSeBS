"use strict"
const LessonsData = require("../dao/LessonsData");
const moment = require('moment');

describe("LessonsData costructor test", () => {
  it('works', () => {
    const obj = new LessonsData(1,1,'2020-01-01T02:00','2020-01-01T03:00',0,50, false,  true, 'A1', 80, 90, 90, 3);
    expect(obj.scheduleId).toBe(1);
  });
});
