import API from '../src/API/API';
import BookingData from '../src/API/BookingData';
import CourseData from '../src/API/CourseData';
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



