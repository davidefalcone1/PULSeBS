import API from '../src/API/API';
import BookingData from '../src/API/BookingData';
import ClassroomData from '../src/API/ClassroomData';
import CourseBasicSchedule from '../src/API/CourseBasicSchedule';
import CourseData from '../src/API/CourseData';
import EnrollmentData from '../src/API/EnrollementData';
import LessonData from '../src/API/LessonData'
import UserData from '../src/API/UserData';

describe('isAuthenticated', ()=>{
    const users = [
        {id: 3, accessLevel: 1},
        {id: 5, accessLevel: 2}
    ];
    beforeEach(()=>{
        fetch.resetMocks();
    });
    test('user is authenticated', (done)=>{
        expect.assertions(1);
        /* User has a valid token belonging to user[0]*/
        fetch.mockResponse(JSON.stringify(users[0]))
        API.isAuthenticated()
            .then((user)=>{
                expect(user.id).toBe(users[0].id);
                done()
            })
            .catch((e)=>{
                done(e);
            });
    });
});

describe('login', ()=>{
    const users = [
        {id: 3, accessLevel: 1},
        {id: 5, accessLevel: 2}
    ];
    beforeEach(()=>{
        fetch.resetMocks();
    });
    test('username and pass are correct', (done)=>{
        expect.assertions(1);
        fetch.mockResponse(JSON.stringify(users[0]))
        API.login('davidefalcone@polito.it', 'ciao')
            .then((user)=>{
                expect(user.id).toBe(users[0].id);
                done()
            })
            .catch((e)=>{
                done(e);
            });
    });
    test('username and pass are wrong', (done)=>{
        expect.assertions(1);
        fetch.mockReject('Wrong credentials');
        API.login('davidefalcone@polito.it', 'ciao')
            .then((user)=>{
                done();
            })
            .catch((e)=>{
                expect(e).toBe('Wrong credentials')
                done();
            });
    });
});

describe('logout', ()=>{
    beforeEach(()=>{
        fetch.resetMocks();
    });
    test('works', (done)=>{
        expect.assertions(1);
        fetch.mockResponse(null)
        API.logout()
            .then((result)=>{
                expect(result).toBeNull();
                done()
            })
            .catch((e)=>{
                done(e);
            });
    });
    // test('Error', async (done)=>{
    //     expect.assertions(1);
    //     fetch.mockReject('error');
    //     await expect(API.logout()).rejects.toBe();
    // });
});

describe('setTutorialCompleted', ()=>{
    beforeEach(()=>{
        fetch.resetMocks();
    });
    test('works', (done)=>{
        expect.assertions(1);
        fetch.mockResponse(null)
        API.setTutorialCompleted()
            .then((result)=>{
                expect(result).toBeNull();
                done()
            })
            .catch((e)=>{
                done(e);
            });
    });
    test('Error', async (done)=>{
        expect.assertions(1);
        fetch.mockReject();
        API.setTutorialCompleted()
            .then()
            .catch((e)=>{
                const msg = e.errors[0].msg;
                expect(msg).toBe('Cannot communicate');
                done();
            });
    });
});

describe('getStudentCourses', ()=>{
    beforeEach(()=>{
        fetch.resetMocks();
    });
    test('works', (done)=>{
        expect.assertions(1);
        fetch.mockResponse(JSON.stringify([new CourseData(1, 'Software engineering 2', 1, 0, 0, 0, 0, 0, 0, 0, 0)]));
        API.getStudentCourses()
            .then((result)=>{
                expect(result).toContainEqual(CourseData.fromJson({courseId: 1, courseName: 'Software engineering 2', teacherId: 1, normalBookingsAvgWeek: 0, cancelledBookingsAvgWeek: 0, waitingBookingsAvgWeek: 0, normalBookingsAvgMonth: 0, cancelledBookingsAvgMonth: 0, waitingBookingsAvgMonth: 0, attendanceCountAvgWeek: 0, attendanceCountAvgMonth: 0}));
                done()
            })
            .catch((e)=>{
                done(e);
            });
    });
    test('Error', async (done)=>{
        expect.assertions(1);
        fetch.mockReject();
        API.setTutorialCompleted()
            .then()
            .catch((e)=>{
                const msg = e.errors[0].msg;
                expect(msg).toBe('Cannot communicate');
                done();
            });
    });
});

describe('getMyBookableLessons', ()=>{
    beforeEach(()=>{
        fetch.resetMocks();
    });
    test('works', (done)=>{
        expect.assertions(1);
        fetch.mockResponse(JSON.stringify([new LessonData(1, 1, '2020-10-21T02:00', '2020-10-21T05:00', 50, 40, false, false, 'A1', 123, 23, 23)]));
        API.getMyBookableLessons()
            .then((result)=>{
                expect(result).toContainEqual(LessonData.fromJson({courseId: 1, scheduleId: 1, startDate: '2020-10-21T02:00', endDate: '2020-10-21T05:00', occupiedSeats: 50, availableSeats: 40, isLessonCancelled: false, isLessonRemote: false, classroom: 'A1', normalBookings: 123, cancelledBookings: 23, waitingBookings: 23}));
                done()
            })
            .catch((e)=>{
                done(e);
            });
    });
    test('Error', async (done)=>{
        expect.assertions(1);
        fetch.mockReject();
        API.getMyBookableLessons()
            .then()
            .catch((e)=>{
                const msg = e.errors[0].msg;
                expect(msg).toBe('Cannot communicate');
                done();
            });
    });
});
describe('getMyBookedLessons', ()=>{
    beforeEach(()=>{
        fetch.resetMocks();
    });
    test('works', (done)=>{
        expect.assertions(1);
        fetch.mockResponse(JSON.stringify([new LessonData(1, 1, '2020-10-21T02:00', '2020-10-21T05:00', 50, 40, false, false, 'A1', 123, 23, 23)]));
        API.getMyBookedLessons()
            .then((result)=>{
                expect(result).toContainEqual(LessonData.fromJson({courseId: 1, scheduleId: 1, startDate: '2020-10-21T02:00', endDate: '2020-10-21T05:00', occupiedSeats: 50, availableSeats: 40, isLessonCancelled: false, isLessonRemote: false, classroom: 'A1', normalBookings: 123, cancelledBookings: 23, waitingBookings: 23}));
                done()
            })
            .catch((e)=>{
                done(e);
            });
    });
    test('Error', async (done)=>{
        expect.assertions(1);
        fetch.mockReject();
        API.getMyBookedLessons()
            .then()
            .catch((e)=>{
                const msg = e.errors[0].msg;
                expect(msg).toBe('Cannot communicate');
                done();
            });
    });
});

describe('getMyWaitingBookedLessons', ()=>{
    beforeEach(()=>{
        fetch.resetMocks();
    });
    test('works', (done)=>{
        expect.assertions(1);
        fetch.mockResponse(JSON.stringify([new LessonData(1, 1, '2020-10-21T02:00', '2020-10-21T05:00', 50, 40, false, false, 'A1', 123, 23, 23)]));
        API.getMyWaitingBookedLessons()
            .then((result)=>{
                expect(result).toContainEqual(LessonData.fromJson({courseId: 1, scheduleId: 1, startDate: '2020-10-21T02:00', endDate: '2020-10-21T05:00', occupiedSeats: 50, availableSeats: 40, isLessonCancelled: false, isLessonRemote: false, classroom: 'A1', normalBookings: 123, cancelledBookings: 23, waitingBookings: 23}));
                done()
            })
            .catch((e)=>{
                done(e);
            });
    });
    test('Error', async (done)=>{
        expect.assertions(1);
        fetch.mockReject();
        API.getMyWaitingBookedLessons()
            .then()
            .catch((e)=>{
                const msg = e.errors[0].msg;
                expect(msg).toBe('Cannot communicate');
                done();
            });
    });
});

describe('bookLesson', ()=>{
    beforeEach(()=>{
        fetch.resetMocks();
    });
    test('works', (done)=>{
        expect.assertions(1);
        fetch.mockResponse(true);
        API.bookLesson(1)
            .then((result)=>{
                expect(result).toBe(true);
                done()
            })
            .catch((e)=>{
                done(e);
            });
    });
    test('Error', async (done)=>{
        expect.assertions(1);
        fetch.mockReject();
        API.bookLesson(1)
            .then()
            .catch((e)=>{
                const msg = e.errors[0].msg;
                expect(msg).toBe('Cannot communicate');
                done();
            });
    });
});

describe('deleteBooking', ()=>{
    beforeEach(()=>{
        fetch.resetMocks();
    });
    test('works', (done)=>{
        expect.assertions(1);
        fetch.mockResponse(null);
        API.deleteBooking(1)
            .then((result)=>{
                expect(result).toBe(null);
                done()
            })
            .catch((e)=>{
                done(e);
            });
    });
    test('Error', async (done)=>{
        expect.assertions(1);
        fetch.mockReject();
        API.deleteBooking(1)
            .then()
            .catch((e)=>{
                const msg = e.errors[0].msg;
                expect(msg).toBe('Cannot communicate');
                done();
            });
    });
});

describe('getMyCoursesLessons', ()=>{
    beforeEach(()=>{
        fetch.resetMocks();
    });
    test('works', (done)=>{
        expect.assertions(1);
        fetch.mockResponse(JSON.stringify([new LessonData(1, 1, '2020-10-21T02:00', '2020-10-21T05:00', 50, 40, false, false, 'A1', 123, 23, 23)]));
        API.getMyCoursesLessons()
            .then((result)=>{
                expect(result).toContainEqual(LessonData.fromJson({courseId: 1, scheduleId: 1, startDate: '2020-10-21T02:00', endDate: '2020-10-21T05:00', occupiedSeats: 50, availableSeats: 40, isLessonCancelled: false, isLessonRemote: false, classroom: 'A1', normalBookings: 123, cancelledBookings: 23, waitingBookings: 23}));
                done()
            })
            .catch((e)=>{
                done(e);
            });
    });
    test('Error', async (done)=>{
        expect.assertions(1);
        fetch.mockReject();
        API.getMyCoursesLessons()
            .then()
            .catch((e)=>{
                const msg = e.errors[0].msg;
                expect(msg).toBe('Cannot communicate');
                done();
            });
    });
});

describe('getTeacherCourses', ()=>{
    beforeEach(()=>{
        fetch.resetMocks();
    });
    test('works', (done)=>{
        expect.assertions(1);
        fetch.mockResponse(JSON.stringify([new CourseData(1, 'Software engineering 2', 1, 0, 0, 0, 0, 0, 0, 0, 0)]));
        API.getTeacherCourses()
            .then((result)=>{
                expect(result).toContainEqual(CourseData.fromJson({courseId: 1, courseName: 'Software engineering 2', teacherId: 1, normalBookingsAvgWeek: 0, cancelledBookingsAvgWeek: 0, waitingBookingsAvgWeek: 0, normalBookingsAvgMonth: 0, cancelledBookingsAvgMonth: 0, waitingBookingsAvgMonth: 0, attendanceCountAvgWeek: 0, attendanceCountAvgMonth: 0}));
                done()
            })
            .catch((e)=>{
                done(e);
            });
    });
    test('Error', async (done)=>{
        expect.assertions(1);
        fetch.mockReject();
        API.getTeacherCourses()
            .then()
            .catch((e)=>{
                const msg = e.errors[0].msg;
                expect(msg).toBe('Cannot communicate');
                done();
            });
    });
});

describe('getBookedStudents', ()=>{
    beforeEach(()=>{
        fetch.resetMocks();
    });
    test('works', (done)=>{
        expect.assertions(1);
        fetch.mockResponse(JSON.stringify([new BookingData(1, 2, '123', 1, 1)]));
        API.getBookedStudents()
            .then((result)=>{
                expect(result).toContainEqual(BookingData.fromJson({id: 1, scheduleId: 2, studentId: '123', attended: 1, status: 1}));
                done()
            })
            .catch((e)=>{
                done(e);
            });
    });
    test('Error', async (done)=>{
        expect.assertions(1);
        fetch.mockReject();
        API.getBookedStudents()
            .then()
            .catch((e)=>{
                const msg = e.errors[0].msg;
                expect(msg).toBe('Cannot communicate');
                done();
            });
    });
});

describe('getStudentsData', ()=>{
    beforeEach(()=>{
        fetch.resetMocks();
    });
    test('works', (done)=>{
        expect.assertions(1);
        fetch.mockResponse(JSON.stringify([new UserData(1, '123', 'Davide Falcone', 'davidefalcone@studenti.polito.it', false)]));
        API.getStudentsData(['123'])
            .then((result)=>{
                expect(result).toContainEqual(UserData.fromJson({id: 1, personId: '123', fullName: 'Davide Falcone', email: 'davidefalcone@studenti.polito.it', hasDoneTutorial: false}));
                done()
            })
            .catch((e)=>{
                done(e);
            });
    });
    test('Error', async (done)=>{
        expect.assertions(1);
        fetch.mockReject();
        API.getStudentsData([1])
            .then()
            .catch((e)=>{
                const msg = e.errors[0].msg;
                expect(msg).toBe('Cannot communicate');
                done();
            });
    });
});

describe('makeLessonRemote', ()=>{
    beforeEach(()=>{
        fetch.resetMocks();
    });
    test('works', (done)=>{
        expect.assertions(1);
        fetch.mockResponse(null);
        API.makeLessonRemote(1)
            .then((result)=>{
                expect(result).toBeNull();
                done()
            })
            .catch((e)=>{
                done(e);
            });
    });
    test('Error', async (done)=>{
        expect.assertions(1);
        fetch.mockReject();
        API.makeLessonRemote(1)
            .then()
            .catch((e)=>{
                const msg = e.errors[0].msg;
                expect(msg).toBe('Cannot communicate');
                done();
            });
    });
});

describe('cancelLesson', ()=>{
    beforeEach(()=>{
        fetch.resetMocks();
    });
    test('works', (done)=>{
        expect.assertions(1);
        fetch.mockResponse(null);
        API.cancelLesson(1)
            .then((result)=>{
                expect(result).toBeNull();
                done()
            })
            .catch((e)=>{
                done(e);
            });
    });
    test('Error', async (done)=>{
        expect.assertions(1);
        fetch.mockReject();
        API.cancelLesson(1)
            .then()
            .catch((e)=>{
                const msg = e.errors[0].msg;
                expect(msg).toBe('Cannot communicate');
                done();
            });
    });
});

describe('setStudentAsPresent', ()=>{
    beforeEach(()=>{
        fetch.resetMocks();
    });
    test('works', (done)=>{
        expect.assertions(1);
        fetch.mockResponse(null);
        API.setStudentAsPresent(1, '12345')
            .then((result)=>{
                expect(result).toBeNull();
                done()
            })
            .catch((e)=>{
                done(e);
            });
    });
    test('Error', async (done)=>{
        expect.assertions(1);
        fetch.mockReject();
        API.setStudentAsPresent(1, '12345')
            .then()
            .catch((e)=>{
                const msg = e.errors[0].msg;
                expect(msg).toBe('Cannot communicate');
                done();
            });
    });
});

describe('setStudentAsNotPresent', ()=>{
    beforeEach(()=>{
        fetch.resetMocks();
    });
    test('works', (done)=>{
        expect.assertions(1);
        fetch.mockResponse(null);
        API.setStudentAsNotPresent(1, '12345')
            .then((result)=>{
                expect(result).toBeNull();
                done()
            })
            .catch((e)=>{
                done(e);
            });
    });
    test('Error', async (done)=>{
        expect.assertions(1);
        fetch.mockReject();
        API.setStudentAsNotPresent(1, '12345')
            .then()
            .catch((e)=>{
                const msg = e.errors[0].msg;
                expect(msg).toBe('Cannot communicate');
                done();
            });
    });
});

describe('createNewClassroom', ()=>{
    beforeEach(()=>{
        fetch.resetMocks();
    });
    test('works', (done)=>{
        expect.assertions(1);
        fetch.mockResponse(null);
        API.createNewClassroom('A1', 90)
            .then((result)=>{
                expect(result).toBeNull();
                done()
            })
            .catch((e)=>{
                done(e);
            });
    });
    test('Error', async (done)=>{
        expect.assertions(1);
        fetch.mockReject();
        API.createNewClassroom('A1', 90)
            .then()
            .catch((e)=>{
                const msg = e.errors[0].msg;
                expect(msg).toBe('Cannot communicate');
                done();
            });
    });
});

describe('createNewCourse', ()=>{
    beforeEach(()=>{
        fetch.resetMocks();
    });
    test('works', (done)=>{
        expect.assertions(1);
        fetch.mockResponse(null);
        API.createNewCourse('Software engineering 2', '12345')
            .then((result)=>{
                expect(result).toBeNull();
                done()
            })
            .catch((e)=>{
                done(e);
            });
    });
    test('Error', async (done)=>{
        expect.assertions(1);
        fetch.mockReject();
        API.createNewCourse('Software engineering 2', '12345')
            .then()
            .catch((e)=>{
                const msg = e.errors[0].msg;
                expect(msg).toBe('Cannot communicate');
                done();
            });
    });
});

describe('createNewUser', ()=>{
    beforeEach(()=>{
        fetch.resetMocks();
    });
    test('works', (done)=>{
        expect.assertions(1);
        fetch.mockResponse(null);
        API.createNewUser('13245', 'Davide Falcone', 'davidefalcone@studenti.polito.it', 'ciao', 1)
            .then((result)=>{
                expect(result).toBeNull();
                done()
            })
            .catch((e)=>{
                done(e);
            });
    });
    test('Error', async (done)=>{
        expect.assertions(1);
        fetch.mockReject();
        API.createNewUser('13245', 'Davide Falcone', 'davidefalcone@studenti.polito.it', 'ciao', 1)
            .then()
            .catch((e)=>{
                const msg = e.errors[0].msg;
                expect(msg).toBe('Cannot communicate');
                done();
            });
    });
});


describe('createNewLesson', ()=>{
    beforeEach(()=>{
        fetch.resetMocks();
    });
    test('works', (done)=>{
        expect.assertions(1);
        fetch.mockResponse(null);
        API.createNewLesson(1, 0, 1, '2020-01-31T02:00', '2020-01-31T05:00', 'A1')
            .then((result)=>{
                expect(result).toBeNull();
                done()
            })
            .catch((e)=>{
                done(e);
            });
    });
    test('Error', async (done)=>{
        expect.assertions(1);
        fetch.mockReject();
        API.createNewLesson(1, 0, 1, '2020-01-31T02:00', '2020-01-31T05:00', 'A1')
            .then()
            .catch((e)=>{
                const msg = e.errors[0].msg;
                expect(msg).toBe('Cannot communicate');
                done();
            });
    });
});

describe('editLesson', ()=>{
    beforeEach(()=>{
        fetch.resetMocks();
    });
    test('works', (done)=>{
        expect.assertions(1);
        fetch.mockResponse(null);
        API.editLesson(1, 1, 0, 1, '2020-01-31T02:00', '2020-01-31T05:00', 'A1')
            .then((result)=>{
                expect(result).toBeNull();
                done()
            })
            .catch((e)=>{
                done(e);
            });
    });
    test('Error', async (done)=>{
        expect.assertions(1);
        fetch.mockReject();
        API.editLesson(1, 1, 0, 1, '2020-01-31T02:00', '2020-01-31T05:00', 'A1')
            .then()
            .catch((e)=>{
                const msg = e.errors[0].msg;
                expect(msg).toBe('Cannot communicate');
                done();
            });
    });
});

describe('createNewEnrollment', ()=>{
    beforeEach(()=>{
        fetch.resetMocks();
    });
    test('works', (done)=>{
        expect.assertions(1);
        fetch.mockResponse(null);
        API.createNewEnrollment('12345', 1)
            .then((result)=>{
                expect(result).toBeNull();
                done()
            })
            .catch((e)=>{
                done(e);
            });
    });
    test('Error', async (done)=>{
        expect.assertions(1);
        fetch.mockReject();
        API.createNewEnrollment('12345', 1)
            .then()
            .catch((e)=>{
                const msg = e.errors[0].msg;
                expect(msg).toBe('Cannot communicate');
                done();
            });
    });
});

describe('createNewCourseSchedule', ()=>{
    beforeEach(()=>{
        fetch.resetMocks();
    });
    test('works', (done)=>{
        expect.assertions(1);
        fetch.mockResponse(null);
        API.createNewCourseSchedule(1, 'Mon', '02:00', '05:00', 'A1')
            .then((result)=>{
                expect(result).toBeNull();
                done()
            })
            .catch((e)=>{
                done(e);
            });
    });
    test('Error', async (done)=>{
        expect.assertions(1);
        fetch.mockReject();
        API.createNewCourseSchedule(1, 'Mon', '02:00', '05:00', 'A1')
            .then()
            .catch((e)=>{
                const msg = e.errors[0].msg;
                expect(msg).toBe('Cannot communicate');
                done();
            });
    });
});

describe('editCourseSchedule', ()=>{
    beforeEach(()=>{
        fetch.resetMocks();
    });
    test('works', (done)=>{
        expect.assertions(1);
        fetch.mockResponse(null);
        API.editCourseSchedule(1, 1, 'Mon', '02:00', '05:00', 'A1')
            .then((result)=>{
                expect(result).toBeNull();
                done()
            })
            .catch((e)=>{
                done(e);
            });
    });
    test('Error', async (done)=>{
        expect.assertions(1);
        fetch.mockReject();
        API.editCourseSchedule(1, 1, 'Mon', '02:00', '05:00', 'A1')
            .then()
            .catch((e)=>{
                const msg = e.errors[0].msg;
                expect(msg).toBe('Cannot communicate');
                done();
            });
    });
});

describe('deleteCourseSchedule', ()=>{
    beforeEach(()=>{
        fetch.resetMocks();
    });
    test('works', (done)=>{
        expect.assertions(1);
        fetch.mockResponse(null);
        API.deleteCourseSchedule(1)
            .then((result)=>{
                expect(result).toBeNull();
                done()
            })
            .catch((e)=>{
                done(e);
            });
    });
    test('Error', async (done)=>{
        expect.assertions(1);
        fetch.mockReject();
        API.deleteCourseSchedule(1)
            .then()
            .catch((e)=>{
                const msg = e.errors[0].msg;
                expect(msg).toBe('Cannot communicate');
                done();
            });
    });
});
describe('getAllCoursesSchedules', ()=>{
    beforeEach(()=>{
        fetch.resetMocks();
    });
    test('works', (done)=>{
        expect.assertions(1);
        fetch.mockResponse(JSON.stringify([new CourseBasicSchedule(1, 1, 'Mon', '02:00', '5:00', 'A1')]));
        API.getAllCoursesSchedules()
            .then((result)=>{
                expect(result).toContainEqual({id: 1, courseId: 1, day: 'Mon', startTime: '02:00', endTime: '5:00', classroom: 'A1'});
                done()
            })
            .catch((e)=>{
                done(e);
            });
    });
    test('Error', async (done)=>{
        expect.assertions(1);
        fetch.mockReject();
        API.getAllCoursesSchedules()
            .then()
            .catch((e)=>{
                const msg = e.errors[0].msg;
                expect(msg).toBe('Cannot communicate');
                done();
            });
    });
});

describe('getAllClassrooms', ()=>{
    beforeEach(()=>{
        fetch.resetMocks();
    });
    test('works', (done)=>{
        expect.assertions(1);
        fetch.mockResponse(JSON.stringify([new ClassroomData(1, 'A1' , 90)]));
        API.getAllClassrooms()
            .then((result)=>{
                expect(result).toContainEqual({classId: 1, classroomName: 'A1', maxSeats: 90});
                done()
            })
            .catch((e)=>{
                done(e);
            });
    });
    test('Error', async (done)=>{
        expect.assertions(1);
        fetch.mockReject();
        API.getAllClassrooms()
            .then()
            .catch((e)=>{
                const msg = e.errors[0].msg;
                expect(msg).toBe('Cannot communicate');
                done();
            });
    });
});

describe('getAllCourses', ()=>{
    beforeEach(()=>{
        fetch.resetMocks();
    });
    test('works', (done)=>{
        expect.assertions(1);
        fetch.mockResponse(JSON.stringify([new CourseData(1, 'Software engineering 2', 1, 0, 0, 0, 0, 0, 0, 0, 0)]));
        API.getAllCourses()
            .then((result)=>{
                expect(result).toContainEqual(CourseData.fromJson({courseId: 1, courseName: 'Software engineering 2', teacherId: 1, normalBookingsAvgWeek: 0, cancelledBookingsAvgWeek: 0, waitingBookingsAvgWeek: 0, normalBookingsAvgMonth: 0, cancelledBookingsAvgMonth: 0, waitingBookingsAvgMonth: 0, attendanceCountAvgWeek: 0, attendanceCountAvgMonth: 0}));
                done()
            })
            .catch((e)=>{
                done(e);
            });
    });
    test('Error', async (done)=>{
        expect.assertions(1);
        fetch.mockReject();
        API.getAllCourses()
            .then()
            .catch((e)=>{
                const msg = e.errors[0].msg;
                expect(msg).toBe('Cannot communicate');
                done();
            });
    });
});

describe('getAllStudents', ()=>{
    beforeEach(()=>{
        fetch.resetMocks();
    });
    test('works', (done)=>{
        expect.assertions(1);
        fetch.mockResponse(JSON.stringify([new UserData(1, '123', 'Davide Falcone', 'davidefalcone@studenti.polito.it', false)]));
        API.getAllStudents()
            .then((result)=>{
                expect(result).toContainEqual(UserData.fromJson({id: 1, personId: '123', fullName: 'Davide Falcone', email: 'davidefalcone@studenti.polito.it', hasDoneTutorial: false}));
                done()
            })
            .catch((e)=>{
                done(e);
            });
    });
    test('Error', async (done)=>{
        expect.assertions(1);
        fetch.mockReject();
        API.getAllStudents()
            .then()
            .catch((e)=>{
                const msg = e.errors[0].msg;
                expect(msg).toBe('Cannot communicate');
                done();
            });
    });
});

describe('getAllTeachers', ()=>{
    beforeEach(()=>{
        fetch.resetMocks();
    });
    test('works', (done)=>{
        expect.assertions(1);
        fetch.mockResponse(JSON.stringify([new UserData(1, '54321', 'Mario Rossi', 'mariorossi@studenti.polito.it', false)]));
        API.getAllTeachers()
            .then((result)=>{
                expect(result).toContainEqual(UserData.fromJson({id: 1, personId: '54321', fullName: 'Mario Rossi', email: 'mariorossi@studenti.polito.it', hasDoneTutorial: false}));
                done()
            })
            .catch((e)=>{
                done(e);
            });
    });
    test('Error', async (done)=>{
        expect.assertions(1);
        fetch.mockReject();
        API.getAllTeachers()
            .then()
            .catch((e)=>{
                const msg = e.errors[0].msg;
                expect(msg).toBe('Cannot communicate');
                done();
            });
    });
});

describe('getAllLessons', ()=>{
    beforeEach(()=>{
        fetch.resetMocks();
    });
    test('works', (done)=>{
        expect.assertions(1);
        fetch.mockResponse(JSON.stringify([new LessonData(1, 1, '2020-10-21T02:00', '2020-10-21T05:00', 50, 40, false, false, 'A1', 123, 23, 23)]));
        API.getAllLessons()
            .then((result)=>{
                expect(result).toContainEqual(LessonData.fromJson({courseId: 1, scheduleId: 1, startDate: '2020-10-21T02:00', endDate: '2020-10-21T05:00', occupiedSeats: 50, availableSeats: 40, isLessonCancelled: false, isLessonRemote: false, classroom: 'A1', normalBookings: 123, cancelledBookings: 23, waitingBookings: 23}));
                done()
            })
            .catch((e)=>{
                done(e);
            });
    });
    test('Error', async (done)=>{
        expect.assertions(1);
        fetch.mockReject();
        API.getAllLessons()
            .then()
            .catch((e)=>{
                const msg = e.errors[0].msg;
                expect(msg).toBe('Cannot communicate');
                done();
            });
    });
});

describe('getAllEnrollments', ()=>{
    beforeEach(()=>{
        fetch.resetMocks();
    });
    test('works', (done)=>{
        expect.assertions(1);
        fetch.mockResponse(JSON.stringify([new EnrollmentData('12345', 1)]));
        API.getAllEnrollments()
            .then((result)=>{
                expect(result).toContainEqual(EnrollmentData.fromJson({courseId: 1, studentId: '12345'}));
                done()
            })
            .catch((e)=>{
                done(e);
            });
    });
    test('Error', async (done)=>{
        expect.assertions(1);
        fetch.mockReject();
        API.getAllEnrollments()
            .then()
            .catch((e)=>{
                const msg = e.errors[0].msg;
                expect(msg).toBe('Cannot communicate');
                done();
            });
    });
});

describe('uploadFileClassrooms', ()=>{
    beforeEach(()=>{
        fetch.resetMocks();
    });
    test('works', (done)=>{
        expect.assertions(1);
        fetch.mockResponse(null);
        API.uploadFileClassrooms(1)
            .then((result)=>{
                expect(result).toBeNull();
                done()
            })
            .catch((e)=>{
                done(e);
            });
    });
    test('Error', async (done)=>{
        expect.assertions(1);
        fetch.mockReject();
        API.uploadFileClassrooms(1)
            .then()
            .catch((e)=>{
                const msg = e.errors[0].msg;
                expect(msg).toBe('Cannot communicate');
                done();
            });
    });
});

describe('uploadFileCourses', ()=>{
    beforeEach(()=>{
        fetch.resetMocks();
    });
    test('works', (done)=>{
        expect.assertions(1);
        fetch.mockResponse(null);
        API.uploadFileCourses(1)
            .then((result)=>{
                expect(result).toBeNull();
                done()
            })
            .catch((e)=>{
                done(e);
            });
    });
    test('Error', async (done)=>{
        expect.assertions(1);
        fetch.mockReject();
        API.uploadFileCourses(1)
            .then()
            .catch((e)=>{
                const msg = e.errors[0].msg;
                expect(msg).toBe('Cannot communicate');
                done();
            });
    });
});

describe('uploadFileLessons', ()=>{
    beforeEach(()=>{
        fetch.resetMocks();
    });
    test('works', (done)=>{
        expect.assertions(1);
        fetch.mockResponse(null);
        API.uploadFileLessons(1)
            .then((result)=>{
                expect(result).toBeNull();
                done()
            })
            .catch((e)=>{
                done(e);
            });
    });
    test('Error', async (done)=>{
        expect.assertions(1);
        fetch.mockReject();
        API.uploadFileLessons(1)
            .then()
            .catch((e)=>{
                const msg = e.errors[0].msg;
                expect(msg).toBe('Cannot communicate');
                done();
            });
    });
});

describe('uploadFileStudents', ()=>{
    beforeEach(()=>{
        fetch.resetMocks();
    });
    test('works', (done)=>{
        expect.assertions(1);
        fetch.mockResponse(null);
        API.uploadFileStudents(1)
            .then((result)=>{
                expect(result).toBeNull();
                done()
            })
            .catch((e)=>{
                done(e);
            });
    });
    test('Error', async (done)=>{
        expect.assertions(1);
        fetch.mockReject();
        API.uploadFileStudents(1)
            .then()
            .catch((e)=>{
                const msg = e.errors[0].msg;
                expect(msg).toBe('Cannot communicate');
                done();
            });
    });
});

describe('uploadFileTeachers', ()=>{
    beforeEach(()=>{
        fetch.resetMocks();
    });
    test('works', (done)=>{
        expect.assertions(1);
        fetch.mockResponse(null);
        API.uploadFileTeachers(1)
            .then((result)=>{
                expect(result).toBeNull();
                done()
            })
            .catch((e)=>{
                done(e);
            });
    });
    test('Error', async (done)=>{
        expect.assertions(1);
        fetch.mockReject();
        API.uploadFileTeachers(1)
            .then()
            .catch((e)=>{
                const msg = e.errors[0].msg;
                expect(msg).toBe('Cannot communicate');
                done();
            });
    });
});
describe('uploadFileEnrollment', ()=>{
    beforeEach(()=>{
        fetch.resetMocks();
    });
    test('works', (done)=>{
        expect.assertions(1);
        fetch.mockResponse(null);
        API.uploadFileEnrollment(1)
            .then((result)=>{
                expect(result).toBeNull();
                done()
            })
            .catch((e)=>{
                done(e);
            });
    });
    test('Error', async (done)=>{
        expect.assertions(1);
        fetch.mockReject();
        API.uploadFileEnrollment(1)
            .then()
            .catch((e)=>{
                const msg = e.errors[0].msg;
                expect(msg).toBe('Cannot communicate');
                done();
            });
    });
});

describe('generateStudentTracing', ()=>{
    beforeEach(()=>{
        fetch.resetMocks();
    });
    test('works', (done)=>{
        expect.assertions(1);
        fetch.mockResponse(true);
        API.generateStudentTracing(1, 1)
            .then((result)=>{
                expect(result).toBeTruthy();
                done()
            })
            .catch((e)=>{
                done(e);
            });
    });
    test('Error', async (done)=>{
        expect.assertions(1);
        fetch.mockReject();
        API.generateStudentTracing(1, 1)
            .then()
            .catch((e)=>{
                const msg = e.errors[0].msg;
                expect(msg).toBe('Cannot communicate');
                done();
            });
    });
});

describe('generateTeacherTracing', ()=>{
    beforeEach(()=>{
        fetch.resetMocks();
    });
    test('works', (done)=>{
        expect.assertions(1);
        fetch.mockResponse(true);
        API.generateTeacherTracing(1, 1)
            .then((result)=>{
                expect(result).toBeTruthy();
                done()
            })
            .catch((e)=>{
                done(e);
            });
    });
    test('Error', async (done)=>{
        expect.assertions(1);
        fetch.mockReject();
        API.generateTeacherTracing(1, 1)
            .then()
            .catch((e)=>{
                const msg = e.errors[0].msg;
                expect(msg).toBe('Cannot communicate');
                done();
            });
    });
});

describe('getCoursesStatistics', ()=>{
    beforeEach(()=>{
        fetch.resetMocks();
    });
    test('works', (done)=>{
        expect.assertions(1);
        fetch.mockResponse(JSON.stringify([new CourseData(1, 'Software engineering 2', 1, 0, 0, 0, 0, 0, 0, 0, 0)]));
        API.getCoursesStatistics()
            .then((result)=>{
                expect(result).toContainEqual(CourseData.fromJson({courseId: 1, courseName: 'Software engineering 2', teacherId: 1, normalBookingsAvgWeek: 0, cancelledBookingsAvgWeek: 0, waitingBookingsAvgWeek: 0, normalBookingsAvgMonth: 0, cancelledBookingsAvgMonth: 0, waitingBookingsAvgMonth: 0, attendanceCountAvgWeek: 0, attendanceCountAvgMonth: 0}));
                done()
            })
            .catch((e)=>{
                done(e);
            });
    });
    test('Error', async (done)=>{
        expect.assertions(1);
        fetch.mockReject();
        API.getCoursesStatistics()
            .then()
            .catch((e)=>{
                const msg = e.errors[0].msg;
                expect(msg).toBe('Cannot communicate');
                done();
            });
    });
});

describe('getLessonsStatistics', ()=>{
    beforeEach(()=>{
        fetch.resetMocks();
    });
    test('works', (done)=>{
        expect.assertions(1);
        fetch.mockResponse(JSON.stringify([new LessonData(1, 1, '2020-10-21T02:00', '2020-10-21T05:00', 50, 40, false, false, 'A1', 123, 23, 23)]));
        API.getLessonsStatistics()
            .then((result)=>{
                expect(result).toContainEqual(LessonData.fromJson({courseId: 1, scheduleId: 1, startDate: '2020-10-21T02:00', endDate: '2020-10-21T05:00', occupiedSeats: 50, availableSeats: 40, isLessonCancelled: false, isLessonRemote: false, classroom: 'A1', normalBookings: 123, cancelledBookings: 23, waitingBookings: 23}));
                done()
            })
            .catch((e)=>{
                done(e);
            });
    });
    test('Error', async (done)=>{
        expect.assertions(1);
        fetch.mockReject();
        API.getLessonsStatistics()
            .then()
            .catch((e)=>{
                const msg = e.errors[0].msg;
                expect(msg).toBe('Cannot communicate');
                done();
            });
    });
});





