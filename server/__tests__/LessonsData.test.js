"use strict"
const LessonsData = require("../dao/LessonsData");
const moment = require('moment');

describe("LessonsData costructor test", () => {
it('works', () => {
    const obj = new LessonsData(1,1,moment(new Date('16-11-2020 14:00')),moment(new Date('07-12-2020 15:00')),0,50);
    if(obj.scheduleId){
        expect(obj.scheduleId).toBe(1);
    }
    expect(obj.courseId).toBe(1);
    expect(obj.startingTime).toBe(moment(new Date('16-11-2020 14:00')));
    expect(obj.endingTime).toBe(moment(new Date('07-12-2020 15:00')));
    expect(obj.occupiedSeats).toBe(0);
    expect(obj.availableSeats).toBe(50);
  })
});
