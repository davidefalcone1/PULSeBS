'use strict';

const testHelper = require("./testHelper");
const officerDao = require("../dao/officerDao");
const rewire = require('rewire');

describe('getClassrooms', ()=>{
    let classroomID;
    beforeEach(async()=>{
        classroomID = await testHelper.insertClassroom();
    });
    afterEach(async()=>{
        await testHelper.cleanDB();
    });
    test('There is a classroom', ()=>{
        officerDao.getClassrooms().then((classrooms)=>{
            const classroomIDs = classrooms.map((classroom)=>classroom.classId);
            expect(classroomIDs).toContain(classroomID);
        });
    });
});

describe('getCourses', ()=>{
    let courseID;
    beforeEach(async()=>{
        courseID = await testHelper.insertCourse('Software engineering 2', '12345');
    });
    afterEach(async()=>{
        await testHelper.cleanDB();
    });
    test('There is a course', ()=>{
        officerDao.getCourses().then((courses)=>{
            const courseIDs = courses.map((course)=>course.courseId);
            expect(courseIDs).toContain(courseID);
        });
    });
});

describe('getUsers', ()=>{
    let userID;
    beforeEach(async()=>{
        userID = await testHelper.insertStudent();
    });
    afterEach(async()=>{
        await testHelper.cleanDB();
    });
    test('There is a user', ()=>{
        officerDao.getUsers(1).then((users)=>{
            const userIDs = users.map((user)=>user.personId);
            expect(userIDs).toContain(userID);
        });
    });
});
describe('getLessons', ()=>{
    let lessonID;
    beforeEach(async()=>{
        await testHelper.insertCourse('Software engineering 2', 1);
        lessonID = await testHelper.insertCourseSchedule(1);
    });
    afterEach(async()=>{
        await testHelper.cleanDB();
    });
    test('There is a lesson', ()=>{
        officerDao.getLessons().then((lessons)=>{
            const lessonIDs = lessons.map((lesson)=>lesson.scheduleId);
            expect(lessonIDs).toContain(lessonID);
        });
    });
});

describe('getEnrollments', ()=>{
    let enrollment;
    beforeEach(async()=>{
        const student = await testHelper.insertStudent();
        const course = await testHelper.insertCourse('Software engineering 2', 1);
        enrollment = await testHelper.enrollStudentToCourse(student, course)
    });
    afterEach(async()=>{
        await testHelper.cleanDB();
    });
    test('There is an enrollment', ()=>{
        officerDao.getEnrollments().then((enrollements)=>{
            expect(enrollements).toContainEqual(enrollment);
        });
    });
});

describe('getSchedules', ()=>{
    let scheduleID;
    beforeEach(async()=>{
        const course = await testHelper.insertCourse('Software engineering 2', 1);
        scheduleID = await testHelper.insertGeneralCourseSchedule(course);
    });
    afterEach(async()=>{
        await testHelper.cleanDB();
    });
    test('There is a schedule', ()=>{
        officerDao.getSchedules().then((schedules)=>{
            const scheduleIDs = schedules.map(schedules=>schedules.id);
            expect(scheduleIDs).toContain(scheduleID);
        });
    });
});

describe('checkHeaderFields', ()=>{
    const checkHeaderFields = rewire('../dao/officerDao').__get__('checkHeaderFields');
    test('courses fields are correct', ()=>{
        const fields = ['Code', 'Year', 'Semester', 'Course', 'Teacher'];
        const result = checkHeaderFields(fields, 'courses');
        expect(result).toBeTruthy();
    });
    test('courses fields are wrong(length)', ()=>{
        const fields = ['Code', 'Year', 'Semester', 'Course'];
        const result = checkHeaderFields(fields, 'courses');
        expect(result).toBeFalsy();
    });
    test('courses fields are wrong(values)', ()=>{
        const fields = ['Code', 'dc', 'Semester', 'Course', 'Teacher'];
        const result = checkHeaderFields(fields, 'courses');
        expect(result).toBeFalsy();
    });
    test('teachers fields are correct', ()=>{
        const fields = ['Number', 'GivenName', 'Surname', 'OfficialEmail', 'SSN'];
        const result = checkHeaderFields(fields, 'teachers');
        expect(result).toBeTruthy();
    });
    test('teachers fields are wrong(length)', ()=>{
        const fields = ['Number', 'GivenName', 'Surname', 'OfficialEmail'];
        const result = checkHeaderFields(fields, 'teachers');
        expect(result).toBeFalsy();
    });
    test('teachers fields are wrong(values)', ()=>{
        const fields = ['Number', 'GivenName', 'Surname', 'OfficialEmail', 'SSsssN'];
        const result = checkHeaderFields(fields, 'teachers');
        expect(result).toBeFalsy();
    });
})