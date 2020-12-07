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
        const sql = "SELECT * FROM Course WHERE TeacherID = ?";
        db.all(sql, [teacherID], function (err, rows) {
            if (err) {
                reject();
            }
            const courses = rows.map((row) => new CourseData(row.CourseID, row.CourseName, row.TeacherID));
            resolve(courses);
        });
    });
}

exports.getMyCoursesLessons = function (teacherID) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM CourseSchedule JOIN Course ON CourseSchedule.CourseID = Course.CourseID WHERE Course.TeacherID = ?";
        db.all(sql, [teacherID], function (err, rows) {
            if (err) {
                reject();
            }
            const lessons = rows.map((row) => new LessonsData(row.CourseScheduleID, row.CourseID, row.TimeStart, row.TimeEnd, row.OccupiedSeat, row.MaxSeat, row.CourseStatus, row.CourseType, row.Classroom))
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

exports.getBookingStatistics = function (teacherID,bookStatus) {
    return new Promise((resolve, reject) => {
        const sql = `
        SELECT CS.CourseID, CAST(COUNT(BookID) AS FLOAT)/CAST(COUNT(DISTINCT STRFTIME("%m/%Y", CS.TimeStart)) AS FLOAT) AS MonthAvg, CAST(COUNT(BookID) AS FLOAT)/CAST(COUNT(DISTINCT STRFTIME("%W/%Y", CS.TimeStart)) AS FLOAT) AS WeekAvg,
        FROM Course C,CourseSchedule AS CS LEFT JOIN Booking AS B ON CS.CourseScheduleID = B.CourseScheduleID
        WHERE CS.CourseID = C.CourseID AND C.TeacherID= ? AND B.BookStatus = ?
        GROUP BY CS.CourseID
        `;
        db.all(sql, [teacherID,bookStatus], function (err, rows) {
            if (err) {
                reject();
            }
            let ret_array=[];
                for (let row of rows){
                    ret_array.push(
                        {
                            CourseID: row.CourseID,
                            MonthAvg: row.MonthAvg.toFixed(2),
                            WeekAvg: row.WeekAvg.toFixed(2)
                        }
                    );
                }
            resolve(JSON.stringify(ret_array));
        });
    });
}

exports.getLectureAttendance = function (teacherID,courseID){
    return new Promise((resolve,reject) =>{
        const sql=`
        SELECT CS.CourseScheduleID,COUNT(1) FILTER (WHERE B.attended= true) as PresentStudents, COUNT (*) as BookedStudents
        FROM Course C,CourseSchedule AS CS, Booking as B
        WHERE CS.CourseID = C.CourseID AND CS.CourseScheduleID = B.CourseScheduleID AND C.TeacherID= ? AND CS.CourseID=?
        `;
        db.all(sql, [teacherID,courseID], function (err, rows) {
            if (err) {
                reject();
            }
            let ret_array=[];
            for (let row of rows){
                ret_array.push(
                    {
                        CourseScheduleID: row.CourseScheduleID,
                        PresentStudents: row.PresentStudents,
                        BookedStudents: row.BookedStudents
                    }
                );
            }
            resolve(JSON.stringify(ret_array));
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