'use strict';

const testHelper = require("./testHelper");
const officerDao = require("../dao/officerDao");

describe('getClassrooms', ()=>{
    let classroomID;
    beforeEach(async()=>{
        classroomID = await testHelper.insertClassroom();
    });
    afterEach(async()=>{
        await testHelper.cleanDB();
    });
    test('There is a classroom', ()=>{
        expect.assertions(1);
        officerDao.getClassrooms().then((classrooms)=>{
            const classroomIDs = classrooms.map((classroom)=>classroom.classId);
            expect(classroomIDs).toContain(classroomID);
        });
    });
});

describe('getCourses', ()=>{
    let courseID;
    beforeEach(async()=>{
        const teacher = await testHelper.insertTeacher();
        courseID = await testHelper.insertCourse('Software engineering 2', teacher);
    });
    afterEach(async()=>{
        await testHelper.cleanDB();
    });
    test('There is a course', ()=>{
        expect.assertions(1);
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
        expect.assertions(1);
        officerDao.getUsers(1).then((users)=>{
            const userIDs = users.map((user)=>user.personId);
            expect(userIDs).toContain(userID);
        });
    });
});
describe('getLessons', ()=>{
    let lessonID;
    beforeEach(async()=>{
        const teacher = await testHelper.insertTeacher();
        await testHelper.insertCourse('Software engineering 2', teacher);
        lessonID = await testHelper.insertCourseSchedule(1);
    });
    afterEach(async()=>{
        await testHelper.cleanDB();
    });
    test('There is a lesson', ()=>{
        expect.assertions(1);
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
        const teacher = await testHelper.insertTeacher();
        const course = await testHelper.insertCourse('Software engineering 2', teacher);
        enrollment = await testHelper.enrollStudentToCourse(student, course)
    });
    afterEach(async()=>{
        await testHelper.cleanDB();
    });
    test('There is an enrollment', ()=>{
        expect.assertions(1);
        officerDao.getEnrollments().then((enrollements)=>{
            expect(enrollements).toContainEqual(enrollment);
        });
    });
});

describe('getSchedules', ()=>{
    let scheduleID;
    beforeEach(async()=>{
        const teacher = await testHelper.insertTeacher();
        const course = await testHelper.insertCourse('Software engineering 2', teacher);
        scheduleID = await testHelper.insertGeneralCourseSchedule(course);
    });
    afterEach(async()=>{
        await testHelper.cleanDB();
    });
    test('There is a schedule', ()=>{
        expect.assertions(1);
        officerDao.getSchedules().then((schedules)=>{
            const scheduleIDs = schedules.map(schedules=>schedules.id);
            expect(scheduleIDs).toContain(scheduleID);
        });
    });
});

describe('insertNewRooms', ()=>{
    afterEach(async()=>{
        await testHelper.cleanDB();
    });
    test('New rooms inserted', ()=>{
        expect.assertions(1);
        const rooms = [{Room:'A1', Seats:90}];
        officerDao.insertNewRooms(rooms)
            .then((result)=>{
                expect(result).toBe('Successfully inserted');
            });
    });
    test('Existing rooms inserted', ()=>{
        expect.assertions(2);
        let rooms = [{Room:'A1', Seats:90}];
        officerDao.insertNewRooms(rooms)
            .then((result)=>{
                expect(result).toBe('Successfully inserted');
            });
        rooms.push({Room:'A1', Seats:90}, {Room:'A2', Seats:90});
        officerDao.insertNewRooms(rooms)
            .then((result)=>{
                expect(result).toBe('Successfully inserted');
            });
    });
});

describe('createEnrollment', ()=>{
    let student, course;
    afterEach(async()=>{
        await testHelper.cleanDB();
    });
    beforeEach(async()=>{
        const teacher = await testHelper.insertTeacher();
        student = await testHelper.insertStudent();
        course = await testHelper.insertCourse('Software engineering 2', teacher);
    });
    test('Existing enrollment inserted', async()=>{
        expect.assertions(1);
        await testHelper.enrollStudentToCourse(student, course)
        const enrollment = {courseId: course, studentId: student};
        officerDao.createEnrollment(enrollment)
            .then((result)=>{
                expect(result).toBe('Already existing!');
            });
    });
    test('New enrollment inserted', async()=>{
        expect.assertions(1);
        const enrollment = {courseId: course, studentId: student};
        officerDao.createEnrollment(enrollment)
            .then((result)=>{
                expect(result).toBe('Succesfully inserted!');
            });
    });
});

describe('createNewClassroom', ()=>{
    afterEach(async()=>{
        await testHelper.cleanDB();
    });
    test('New classroom inserted', ()=>{
        expect.assertions(1);
        officerDao.createNewClassroom('A1', 90)
            .then((result)=>{
                expect(result).toBe('Classroom inserted');
            });
    });
});

describe('createNewEnrollment', ()=>{
    let student, course;
    afterEach(async()=>{
        await testHelper.cleanDB();
    });
    beforeEach(async()=>{
        const teacher = await testHelper.insertTeacher();
        student = await testHelper.insertStudent();
        course = await testHelper.insertCourse('Software engineering 2', teacher);
    });
    test('New enrollment inserted', ()=>{
        expect.assertions(1);
        officerDao.createNewEnrollment(student, course)
            .then((result)=>{
                expect(result).toBe('New enrollment inserted');
            });
    });
});

describe('createNewUser', ()=>{
    afterEach(async()=>{
        await testHelper.cleanDB();
    });
    test('New user inserted', async ()=>{
        expect.assertions(1);
        try {
            const result = await officerDao.createNewUser('12345', 'Davide Falcone', 'davide.falcone@studenti.polito.it', 'ciao', 1);
            expect(result).toBe('New user inserted');
        } catch (error) {
            console.log(error);
        }
    });
});
