'use strict';

const moment = require("moment");
const db = require('../db');


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
            const lessons = rows.map((row) => new LessonsData(row.CourseScheduleID, row.CourseID, row.TimeStart, row.TimeEnd, row.OccupiedSeat, row.MaxSeat));
            resolve(lessons);
        });
    });
}


exports.getBookedStudents = function (CourseScheduleIDs) {
    return new Promise((resolve, reject) => {
        const sql =
            `SELECT Booking.BookID,Booking.CourseScheduleID,Booking.StudentID,Booking.BookStatus,Booking.Attended 
        FROM CourseSchedule JOIN Booking
        ON CourseSchedule.CourseScheduleID = Booking.CourseScheduleID
        WHERE CourseSchedule.CourseScheduleID = ?`;

        db.all(sql, [CourseScheduleIDs], function (err, rows) {
            if (err) {
                reject();
            }
            const lessons = rows.map((row) => new BookingData(row.BookID, row.CourseScheduleID, row.StudentID, row.BookStatus, row.Attended));
            resolve(lessons);
        });
    });
}


exports.getStudentsData = function (studentsIds) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM User WHERE UserID = ?`;

        db.all(sql, [studentsIds], function (err, rows) {
            if (err) {
                reject();
            }
            const users = rows.map((row) => new UserData(row.ID, row.UserID, row.FullName, row.UserName));
            resolve(users);
        });
    });
}







////////////////////////////////////////////////////////////////////////////////////////////////////
class LessonsData {
    constructor(scheduleId, courseId, startingTime, endingTime, occupiedSeats, availableSeats) {
        if (scheduleId)
            this.scheduleId = scheduleId;
        this.courseId = courseId;
        this.startingTime = moment(new Date(startingTime));
        this.endingTime = moment(new Date(endingTime));
        this.occupiedSeats = occupiedSeats;
        this.availableSeats = availableSeats;
    }

    static fromJson(json) {
        const temp = Object.assign(new LessonData(), json);
        temp.startingTime = moment(new Date(temp.startingTime));
        temp.endingTime = moment(new Date(temp.endingTime));
        return temp;
    }
}

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

class CourseData {
    constructor(courseId, courseName, teacherId) {
        if (courseId)
            this.courseId = courseId;
        this.courseName = courseName;
        this.teacherId = teacherId;
    }
}

class BookingData {
    constructor(id, scheduleId, studentId, status, attended) {
        if (id)
            this.id = id;
        this.scheduleId = scheduleId;
        this.studentId = studentId;
        this.status = status;
        this.attended = attended;
    }

    static fromJson(json) {
        const temp = Object.assign(new BookingData(), json);
        return temp;
    }
}