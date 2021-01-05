'use strict';

const testHelper = require("./testHelper");
const officerDao = require("../dao/officerDao");
const moment = require('moment');
const CourseBasicSchedule = require("../dao/CourseBasicSchedule");
const CourseData = require("../dao/CourseData");
jest.mock("../emailAPI", function () {
    return {
        sendNotification: function () { }
    }
});

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

describe('insertNewCourses', ()=>{
    let teacher, course;
    afterEach(async()=>{
        await testHelper.cleanDB();
    });
    beforeEach(async()=>{
        teacher = await testHelper.insertTeacher();
        course = await testHelper.insertCourse('Software engineering 2', teacher);
    });
    test('Successfully inserted (no courses inserted)', (done)=>{
        expect.assertions(1);
        officerDao.insertNewCourses([{Code: course, Year: 2, Semester: 2, Course: 'Software engineering 2', Teacher: teacher}]) //Trying to add the same course 
            .then((result)=>{
                expect(result).toBe('Successfully inserted');
                done();
            })
            .catch((e)=>{
                done(e);
            });
    });
    test('Successfully inserted', (done)=>{
        expect.assertions(1);
        officerDao.insertNewCourses([{Code: course+1, Year: 1, Semester: 1, Course: 'Mobile Application', Teacher: teacher}]) //Trying to add a different course
            .then((result)=>{
                expect(result).toBe('Successfully inserted');
                done();
            })
            .catch((e)=>{
                done(e);
            });
    });
});

describe('insertNewSchedules', ()=>{
    let teacher, course;
    afterEach(async()=>{
        await testHelper.cleanDB();
    });
    beforeEach(async()=>{
        teacher = await testHelper.insertTeacher();
        course = await testHelper.insertCourse('Software engineering 2', teacher, 2);
    });
    test('No insertion, since there are no courses!', (done)=>{
        expect.assertions(1);
        officerDao.insertNewSchedules([])
            .then((result)=>{
                expect(result).toBe('No insertion, since there are no courses!');
                done();
            })
            .catch((e)=>{
                console.log(e);
                done(e);
            });
    });

    test('Successfully inserted!', async(done)=>{
        expect.assertions(1);
        officerDao.insertNewSchedules([{Code: course, Day: 'Mon', timeStart: '02:00', timeEnd: '05:00', Seats: 90, Room: 'A1', Time: '02:00-05:00'}])
            .then((result)=>{
                expect(result).toBe('Successfully inserted!');
                done();
            })
            .catch((e)=>{
                done(e);
                console.log(e);
            });
    });
});

describe('insertNewGeneralSchedules', ()=>{
    let teacher, course;
    afterEach(async()=>{
        await testHelper.cleanDB();
    });
    beforeEach(async()=>{
        teacher = await testHelper.insertTeacher();
        course = await testHelper.insertCourse('Software engineering 2', teacher, 2);
    });
    test('Successfully inserted!', async(done)=>{
        expect.assertions(1);
        officerDao.insertNewGeneralSchedules([{Code: course, Day: 'Mon', timeStart: '02:00', timeEnd: '05:00', Seats: 90, Room: 'A1', Time: '02:00-05:00'}])
            .then((result)=>{
                expect(result).toBe('Successfully Inserted');
                done();
            })
            .catch((e)=>{
                done(e);
                console.log(e);
            });
    });
});

describe('insertNewEnrollments', ()=>{
    let teacher, course, student;
    afterEach(async()=>{
        await testHelper.cleanDB();
    });
    beforeEach(async()=>{
        student = await testHelper.insertStudent();
        teacher = await testHelper.insertTeacher();
        course = await testHelper.insertCourse('Software engineering 2', teacher, 2);
    });
    test('Successfully inserted!', async(done)=>{
        expect.assertions(1);
        officerDao.insertNewEnrollments([{Code: course,Student:student}])
            .then((result)=>{
                expect(result).toBe('Successfully inserted');
                done();
            })
            .catch((e)=>{
                done(e);
                console.log(e);
            });
    });
});

describe('insertNewUsers', ()=>{
    let student;
    afterEach(async()=>{
        await testHelper.cleanDB();
    });
    beforeEach(async()=>{
        student = await testHelper.insertStudent();
    });
    test('Successfully inserted', (done)=>{
        expect.assertions(1);
        officerDao.insertNewUsers([{userID:student}]) 
            .then((result)=>{
                expect(result).toBe('Successfully inserted');
                done();
            })
            .catch((e)=>{
                done(e);
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

describe('createNewLesson', ()=>{
    let course;
    afterEach(async()=>{
        await testHelper.cleanDB();
    });
    beforeEach(async()=>{
        const teacher = await testHelper.insertTeacher();
        course = await testHelper.insertCourse('Software engineering 2', teacher);
    });
    test('New lesson inserted', async ()=>{
        expect.assertions(1);
        try {
            const result = await officerDao.createNewLesson(course, 0, 1, '2020-08-09T14:30', '2020-08-09T17:30', 'A1');
            expect(result).toBe('New lesson inserted');
        } catch (error) {
            console.log(error);
        }
    });
});

describe('editLesson', ()=>{
    let lesson;
    afterEach(async()=>{
        await testHelper.cleanDB();
    });
    beforeEach(async()=>{
        const teacher = await testHelper.insertTeacher();
        const course = await testHelper.insertCourse('Software engineering 2', teacher);
        lesson = await testHelper.insertCourseSchedule(course);
    });
    test('Lesson updated', async ()=>{
        expect.assertions(1);
        try {
            const result = await officerDao.editLesson(lesson, 1, 0, 1, moment().add(1, 'days').format(), moment().add(1, 'days').add(1, 'hours').format(), 'A1');
            expect(result).toBe('Lesson updated');
        } catch (error) {
            console.log(error);
        }
    });
    test('wrong dates', async ()=>{
        expect.assertions(1);
        try {
            await officerDao.editLesson(lesson, 1, 0, 1, moment().subtract(1, 'days').format(), moment().add(1, 'days').add(1, 'hours').format(), 'A1');
        } catch (error) {
            expect(error).toBe('wrong data');
        }
    });
});


describe('updateAllSchedules', ()=>{
    let lesson, generalScheduleId, course;
    afterEach(async()=>{
        await testHelper.cleanDB();
    });
    beforeEach(async()=>{
        const teacher = await testHelper.insertTeacher();
        course = await testHelper.insertCourse('Software engineering 2', teacher);
        generalScheduleId = await testHelper.insertGeneralCourseSchedule(course, 'Mon', '2:00', '5:00');
    });
    test('Successfully updated and student booked', async (done)=>{
        expect.assertions(1);
        lesson = await testHelper.insertCourseSchedule(course, moment().set('hour', 2).set('minute', 0).add(1, 'week').isoWeekday('Monday')/*Get the 'next week' instance of Monday*/.format(), moment().add(1, 'week').set('hour', 5).set('minute', 0).isoWeekday('Monday').format());
        const student = await testHelper.insertStudent();
        await testHelper.enrollStudentToCourse(student, course);
        await testHelper.insertBooking(student, lesson);
        const newGeneralSchedule = new CourseBasicSchedule(generalScheduleId, course, 'Tue', '02:30', '05:00', 'A1');
        try {
            const result = await officerDao.updateAllSchedules(generalScheduleId, newGeneralSchedule);
            expect(result).toBe('Successfully updated');
            done();
        } catch (error) {
            done(error);
        }
    });
    test('Successfully updated and no students booked', async (done)=>{
        expect.assertions(1);
        lesson = await testHelper.insertCourseSchedule(course, moment().set('hour', 2).set('minute', 0).add(1, 'week').isoWeekday('Monday')/*Get the 'next week' instance of Monday*/.format(), moment().add(1, 'week').set('hour', 5).set('minute', 0).isoWeekday('Monday').format());
        const newGeneralSchedule = new CourseBasicSchedule(generalScheduleId, course, 'Tue', '02:30', '05:00', 'A1');
        try {
            const result = await officerDao.updateAllSchedules(generalScheduleId, newGeneralSchedule);
            expect(result).toBe('Successfully updated');
            done();
        } catch (error) {
            done(error);
        }
    });
    test('Nothing updated', async (done)=>{
        expect.assertions(1);
        const newGeneralSchedule = new CourseBasicSchedule(generalScheduleId, course, 'Tue', '14:30', '17:00', 'A1');
        try {
            const result = await officerDao.updateAllSchedules(generalScheduleId, newGeneralSchedule);
            expect(result).toBe('Nothing updated');
            done();
        } catch (error) {
            done(error);
        }
    });
});

describe('deleteSchedules', ()=>{
    let lesson, generalScheduleId, course;
    afterEach(async()=>{
        await testHelper.cleanDB();
    });
    beforeEach(async()=>{
        const teacher = await testHelper.insertTeacher();
        course = await testHelper.insertCourse('Software engineering 2', teacher);
        generalScheduleId = await testHelper.insertGeneralCourseSchedule(course, 'Mon', '02:00', '05:00');
    });
    test('Successfully deleted and student booked', async (done)=>{
        expect.assertions(1);
        lesson = await testHelper.insertCourseSchedule(course, moment().set('hour', 2).set('minute', 0).add(1, 'week').isoWeekday('Monday')/*Get the 'next week' instance of Monday*/.format(), moment().add(1, 'week').set('hour', 5).set('minute', 0).isoWeekday('Monday').format());
        const student = await testHelper.insertStudent();
        await testHelper.enrollStudentToCourse(student, course);
        await testHelper.insertBooking(student, lesson);
        try {
            const result = await officerDao.deleteSchedules(generalScheduleId);
            expect(result).toBe('Successfully deleted');
            done();
        } catch (error) {
            done(error);
        }
    });
    test('Successfully deleted and no students booked', async (done)=>{
        expect.assertions(1);
        lesson = await testHelper.insertCourseSchedule(course, moment().set('hour', 2).set('minute', 0).add(1, 'week').isoWeekday('Monday')/*Get the 'next week' instance of Monday*/.format(), moment().add(1, 'week').set('hour', 5).set('minute', 0).isoWeekday('Monday').format());
        try {
            const result = await officerDao.deleteSchedules(generalScheduleId);
            expect(result).toBe('Successfully deleted');
            done();
        } catch (error) {
            done(error);
        }
    });
});

describe('createNewSchedule', ()=>{
    let course;
    afterEach(async()=>{
        await testHelper.cleanDB();
    });
    beforeEach(async()=>{
        const teacher = await testHelper.insertTeacher();
        course = await testHelper.insertCourse('Software engineering 2', teacher, 2);
        await testHelper.insertClassroom();
    });
    test('Nothing inserted', async (done)=>{
        expect.assertions(1);
        Date.now = jest.fn(() => new Date('2021-06-14')); // 2 Semester is over
        const newGeneralSchedule = new CourseBasicSchedule(1, course, 'Tue', '14:30', '17:00', 'A1');
        try {
            const result = await officerDao.createNewSchedule(newGeneralSchedule);
            expect(result).toBe('Nothing inserted');
            done();
        } catch (error) {
            done(error);
        }
    });

    test('Successfully inserted', async (done)=>{
        expect.assertions(1);
        Date.now = jest.fn(() => new Date()); 
        const newGeneralSchedule = new CourseBasicSchedule(1, course, 'Tue', '14:30', '17:00', 'A1');
        try {
            const result = await officerDao.createNewSchedule(newGeneralSchedule);
            expect(result).toBe('successfully inserted');
            done();
        } catch (error) {
            done(error);
        }
    });
});






