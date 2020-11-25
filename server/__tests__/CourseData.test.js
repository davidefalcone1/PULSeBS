"use strict"
import CourseData from "../dao/CourseData"

describe("CourseData costructor test", () => {
it('works', () => {
    const obj = new CourseData(1,'Human Computer Interaction','141216');
    if(obj.courseId){
        expect(obj.courseId).toBe(1);
    }
    expect(obj.courseName).toBe('Human Computer Interaction');
    expect(obj.teacherId).toBe('141216');
  })
});