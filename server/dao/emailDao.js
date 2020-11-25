'use strict';

const db = require('../db');
const moment = require('moment');

// get all courses that start the day after
const getTomorrowCourses = () => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT CourseID, TimeStart, TimeEnd, OccupiedSeat 
                     FROM CourseSchedule 
                     WHERE CourseType = 1 AND CourseStatus = 1`;
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            }
            else {
                const tomorrowCourses = rows.filter((row) => {
                    const tomorrowDate = moment().add(1, 'days');
                    const courseStartDate = moment(row.TimeStart);
                    return tomorrowDate.isSame(courseStartDate, 'days');
                });

                resolve(tomorrowCourses);

            }
        });
    });
}

// return the list of course names with the associated professor email
const getCoursesProfessors = (courses) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT CourseID, CourseName, UserName 
                     FROM Course, User 
                     WHERE Course.TeacherID = User.UserID`;
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            }
            else {
                const tomorrowCoursesProfessors = rows.filter((row) => {
                    return courses.includes(row.CourseID);
                });
                resolve(tomorrowCoursesProfessors);
            }
        });
    });

}
exports.getProfessorsToNotify = () => {
    return new Promise((resolve, reject) => {

        getTomorrowCourses()
            .then((tomorrowCourses) => {
                const coursesIDs = tomorrowCourses.map(course => course.CourseID);
                getCoursesProfessors(coursesIDs)
                    .then((coursesProfessors) => {
                        const professorsToNotify = [];
                        tomorrowCourses.forEach((course, index) => {
                            const notification = {
                                email: coursesProfessors[index].UserName,
                                course: coursesProfessors[index].CourseName,
                                date: moment(course.TimeStart).format('MM/DD/YYYY'),
                                start: moment(course.TimeStart).format('HH:mm'),
                                end: moment(course.TimeEnd).format('HH:mm'),
                                numStudents: course.OccupiedSeat
                            };
                            professorsToNotify[index] = notification;
                        });
                        resolve(professorsToNotify);
                    })
                    .catch((error) => reject(error));
            })
            .catch((error) => {
                reject(error);
            });
    });
}

// the courseScheduleID must be a string!!
exports.getLectureInfo = (courseScheduleID) => {
    return new Promise((resolve, reject) => {
        
        const sql = 'SELECT CourseName, TimeStart, TimeEnd ' +
                    'FROM CourseSchedule CS, Course C ' +
                    'WHERE C.CourseID = CS.CourseID AND CourseScheduleID = ?';
        db.get(sql, [courseScheduleID], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            else {
                console.log(row)
                const info = {
                    course: row.CourseName,
                    date: moment(row.TimeStart).format('MM/DD/YYYY'),
                    start: moment(row.TimeStart).format('HH:mm'),
                    end: moment(row.TimeEnd).format('HH:mm') 
                };
                resolve(info);
            }
        });
    });
}

// the id of the lecture just canceled is needed!
exports.getStudentsToNotify = (courseScheduleID) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT Username ' +
        'FROM User U, Booking B ' +
        'WHERE B.CourseScheduleID = ? AND U.UserID = B.StudentID';
        db.all(sql, [courseScheduleID], (err, rows) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(rows);
            }
        });
    });
}
