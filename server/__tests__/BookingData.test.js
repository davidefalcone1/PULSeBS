"use strict"
import BookingData from "../dao/BookingData"

describe("BookingData costructor test", () => {
it('works', () => {
    const obj = new BookingData(1,2,'275332',1,true);
    if(obj.id){
        expect(obj.id).toBe(1);
    }
    expect(obj.scheduleId).toBe(2);
    expect(obj.studentId).toBe('275332');
    expect(obj.status).toBe(1);
    expect(obj.attended).toBe(true);
  })
});
