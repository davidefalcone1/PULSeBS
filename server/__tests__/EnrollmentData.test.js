"use strict"
const EnrollmentData = require("../dao/EnrollmentData");

describe("Enrollment costructor test", () => {
it('works', () => {
    const obj = new EnrollmentData(1,'275332');
    expect(obj.courseId).toBe(1);
    expect(obj.studentId).toBe('275332');
  })
});