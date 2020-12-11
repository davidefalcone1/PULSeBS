'use strict';
const BookingData = require('./BookingData');
const CourseData = require('./CourseData');
const LessonsData = require('./LessonsData');
const moment = require("moment");
const db = require('../db');

// this is a UserData type that will fulfill the front-end (it is different from the User class)
class UserData {
    constructor(id, personId, fullName, email) {
        if (id)
            this.id = id;
        this.personId = personId;
        this.fullName = fullName;
        this.email = email;
    }

    static fromJson(json) {
        const temp = Object.assign(new UserData(), json);
        return temp;
    }
}

/////////////////////////////////////////////////////////////////////////
exports.getTeacherCourses = function (teacherID) {
    return new Promise((resolve, reject) => {
        const sql = `
        select Course.CourseID,Course.CourseName,Course.TeacherID,CAST(COUNT(BookID) filter (where Booking.bookstatus=1) AS FLOAT)/CAST(COUNT(DISTINCT STRFTIME("%W/%Y", CourseSchedule.TimeStart)) AS FLOAT) AS normalBookingsAvgWeek,
        CAST(COUNT(BookID) filter (where Booking.bookstatus=2) AS FLOAT)/CAST(COUNT(DISTINCT STRFTIME("%W/%Y", CourseSchedule.TimeStart)) AS FLOAT) AS cancelledBookingsAvgWeek,
        CAST(COUNT(BookID) filter (where Booking.bookstatus=3) AS FLOAT)/CAST(COUNT(DISTINCT STRFTIME("%W/%Y", CourseSchedule.TimeStart)) AS FLOAT) AS waitingBookingsAvgWeek,
        CAST(COUNT(BookID) filter (where Booking.bookstatus=1) AS FLOAT)/CAST(COUNT(DISTINCT STRFTIME("%m/%Y", CourseSchedule.TimeStart)) AS FLOAT) AS normalBookingsAvgMonth,
        CAST(COUNT(BookID) filter (where Booking.bookstatus=2) AS FLOAT)/CAST(COUNT(DISTINCT STRFTIME("%m/%Y", CourseSchedule.TimeStart)) AS FLOAT) AS cancelledBookingsAvgMonth,
        CAST(COUNT(BookID) filter (where Booking.bookstatus=3) AS FLOAT)/CAST(COUNT(DISTINCT STRFTIME("%m/%Y", CourseSchedule.TimeStart)) AS FLOAT) AS waitingBookingsAvgMonth
        from Course join CourseSchedule
        on Course.CourseID = CourseSchedule.CourseID left join Booking
        on CourseSchedule.CourseScheduleID = Booking.CourseScheduleID
        where course.TeacherID = ?
        GROUP BY Course.CourseID
        `;
        db.all(sql, [teacherID], function (err, rows) {
            if (err) {
                reject();
            }
            const courses = rows.map((row) => new CourseData(row.CourseID, row.CourseName, row.TeacherID, row.normalBookingsAvgWeek.toFixed(2), row.cancelledBookingsAvgWeek.toFixed(2), row.waitingBookingsAvgWeek.toFixed(2), row.normalBookingsAvgMonth.toFixed(2), row.cancelledBookingsAvgMonth.toFixed(2), row.waitingBookingsAvgMonth.toFixed(2)));
            resolve(courses);
        });
    });
}

exports.getMyCoursesLessons = function (teacherID) {
    return new Promise((resolve, reject) => {
        const sql = `
        SELECT CourseSchedule.CourseScheduleID ,
        CourseSchedule.CourseScheduleID,
        CourseSchedule.CourseID,
        CourseSchedule.TimeStart,
        CourseSchedule.TimeEnd,
        CourseSchedule.OccupiedSeat,
        CourseSchedule.MaxSeat,
        CourseSchedule.CourseStatus,
        CourseSchedule.CourseType,
        CourseSchedule.Classroom,
        count(1) filter (where Booking.bookstatus = 1) as normalBookings,
        count(1) filter (where Booking.bookstatus = 2) as cancelledBookings,
        count(1) filter (where Booking.bookstatus = 3) as waitingBookings
        FROM Course join CourseSchedule
        on Course.CourseID = CourseSchedule.CourseID LEFT JOIN Booking
        on CourseSchedule.CourseScheduleID = Booking.CourseScheduleID
        WHERE Course.TeacherID = ?
        GROUP BY CourseSchedule.CourseScheduleID
        `;
        db.all(sql, [teacherID], function (err, rows) {
            if (err) {
                reject();
            }
            const lessons = rows.map((row) => new LessonsData(row.CourseScheduleID, row.CourseID, row.TimeStart, row.TimeEnd, row.OccupiedSeat, row.MaxSeat, row.CourseStatus, row.CourseType, row.Classroom, row.normalBookings, row.cancelledBookings, row.waitingBookings))
                .sort((lesson1, lesson2) => {
                    // sort in DESCEDING ORDER by starting time
                    const start1 = moment(lesson1.startingTime);
                    const start2 = moment(lesson2.startingTime);
                    return start1.isBefore(start2) ? 1 : -1;
                });
            resolve(lessons);
        });
    });
}

exports.getBookedStudents = function (CourseScheduleIDs) {
    return new Promise((resolve, reject) => {
        //Check if the CourseScheduleIDs is an array
        if (!Array.isArray(CourseScheduleIDs)) {
            let err = { message: "" };
            err.message = "The received parameter (CourseScheduleIDs) is not an array!";
            reject(err);
            return;
        }
        ////////////////////////////////////////////////////////////////////////////
        const sql =
            `SELECT Booking.BookID,Booking.CourseScheduleID,Booking.StudentID,Booking.BookStatus,Booking.Attended 
        FROM CourseSchedule JOIN Booking
        ON CourseSchedule.CourseScheduleID = Booking.CourseScheduleID
        WHERE CourseSchedule.CourseScheduleID IN (${CourseScheduleIDs.map(i => '?')}) AND Booking.BookStatus = 1`;

        db.all(sql, [...CourseScheduleIDs], function (err, rows) {
            if (err) {
                reject(err);
                return;
            }
            const lessons = rows.map((row) => new BookingData(row.BookID, row.CourseScheduleID, row.StudentID, row.BookStatus, row.Attended));
            resolve(lessons);
        });
        ////////////////////////////////////////////////////////////////////////////
    });
}

exports.getStudentsData = function (studentsIds) {
    return new Promise((resolve, reject) => {

        //Check if the studentsIds is an array
        if (!Array.isArray(studentsIds)) {
            let err = { message: "" };
            err.message = "The received parameter (studentsIds) is not an array!";
            reject(err);
            return;
        }
        ////////////////////////////////////////////////////////////////////////////

        const sql = `SELECT * FROM User WHERE UserID IN (${studentsIds.map(i => '?')})`;

        db.all(sql, [...studentsIds], function (err, rows) {
            if (err) {
                reject();
            }
            const users = rows.map((row) => new UserData(row.ID, row.UserID, row.FullName, row.UserName));
            resolve(users);
        });
    });
}

exports.updateLessonType = function (courseScheduleId, status) {
    return new Promise((resolve, reject) => {
        const sql = `
        UPDATE CourseSchedule
        SET CourseType = ?
        WHERE Cast ((JulianDay(CourseSchedule.TimeStart)-JulianDay('now', 'localtime') ) * 24 * 60 As Integer) > 30 
        AND CourseSchedule.CourseScheduleID = ?`;

        db.run(sql, [status, courseScheduleId], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.changes);
        });
    });
}

exports.updateLessonStatus = function (courseScheduleId, status) {
    return new Promise((resolve, reject) => {
        const sql = `
        UPDATE CourseSchedule
        SET CourseStatus = ?
        WHERE Cast ((JulianDay(CourseSchedule.TimeStart)-JulianDay('now', 'localtime') ) * 24 * 60 As Integer) > 60 
        AND CourseSchedule.CourseScheduleID = ?`;

        db.run(sql, [status, courseScheduleId], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.changes);
        });
    });
}

exports.cancelAllBooking = function (courseScheduleId) {
    return new Promise((resolve, reject) => {
        const sql = `
        UPDATE Booking
        SET BookStatus = 4
        WHERE CourseScheduleID = ?`;

        db.run(sql, [courseScheduleId], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}

exports.setStudentAsPresent = function (lessonId, studentId) {
    return new Promise((resolve, reject) => {
        const sql = `
        UPDATE Booking
        SET Attended = 1
        WHERE CourseScheduleID = ? AND StudentID = ? `;

        db.run(sql, [lessonId, studentId], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve("Student set as present");
        });
    });
}