'use strict'

const db = require('../db');
const ClassroomData = require('./ClassroomData');
const CourseData = require('./CourseData');
const UserData = require('./UserData');
const LessonsData = require('./LessonsData');
const moment = require('moment');

exports.getClassrooms = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM Classroom';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            }
            else {
                const classes = rows.map(row => new ClassroomData(row.ID, row.ClassroomName, row.MaxSeats));
                resolve(classes);
            }
        });
    });
}

exports.getCourses = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT CourseID, CourseName, TeacherID FROM Course';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            }
            else {
                const courses = rows.map(row => new CourseData(row.CourseID, row.CourseName, row.TeacherID));
                resolve(courses);
            }
        });
    });
}

exports.getUsers = (userType) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT ID, UserID, Name, Surname, UserName ' +
            'FROM User ' +
            'WHERE AccessLevel = ?';
        db.all(sql, [userType], (err, rows) => {
            if (err) {
                reject(err);
            }
            else {
                const students = rows.map(row => new UserData(row.ID, row.UserID, row.Name + ' ' + row.Surname, row.UserName));
                resolve(students);
            }
        });
    });
}

exports.getLessons = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * '
            + 'FROM CourseSchedule';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            }
            else {
                const courses = rows.map(row => new LessonsData(row.CourseScheduleID, row.CourseID, row.TimeStart, row.TimeEnd, row.OccupiedSeat, row.MaxSeat, row.CourseStatus, row.CourseType, row.Classroom));
                resolve(courses);
            }
        });
    });
}

const checkHeaderFields = (header, fileType) => {
    let fields = [];
    switch (fileType) {
        case 'courses':
            fields = ['Code', 'Year', 'Semester', 'Course', 'Teacher'];
            break;
        case 'teachers':
            fields = ['Number', 'GivenName', 'Surname', 'OfficialEmail', 'SSN'];
            break;
        case 'enrollment':
            fields = ['Code', 'Student'];
            break;
        case 'lessons':
            fields = ['Code', 'Room', 'Day', 'Seats', 'Time'];
            break;
        case 'students':
            fields = ['Id', 'Name', 'Surname', 'City', 'OfficialEmail', 'Birthday', 'SSN'];
            break;
        // There is no sample file to add new classromms so if they upload it check here!!
        case 'classrooms':
            fields = ['Room', 'Seats'];
            break;
    }

    // check if the csv has the right number of columns
    if (header.length !== fields.length) {
        return false;
    }

    // check if the columns have the right names
    for (const [index, name] of header.entries()) {
        if (name.localeCompare(fields[index]) !== 0) {
            return false;
        }
    }

    return true;
}

exports.readFile = (fileContent, fileType) => {

    const splittedLines = fileContent.split('\r\n');
    const header = splittedLines[0].split(',');

    if (!checkHeaderFields(header, fileType)) {
        return false;
    }
    splittedLines.shift(); // remove file header

    // create an array of objects, each object represents a row to insert in the db, read from the file
    const rowsToInsert = [];
    splittedLines.forEach((line) => {
        const objectToInsert = {};
        const fields = line.split(',');

        // skip the line if it contains wrong data
        if (fields.length !== header.length) {
            return;
        }
        // build an object with the header names as keys and the line values as values
        fields.forEach((field, index) => {
            objectToInsert[header[index]] = field;
        });

        // add the object to the array of rows to insert
        rowsToInsert.push(objectToInsert);
    });

    return rowsToInsert;
}


const insertCourse = (course) => {
    return new Promise((resolve, reject) => {

        const sql1 = 'SELECT * FROM Course WHERE CourseID = ?';
        const sql2 = 'INSERT INTO Course(CourseID, Year, Semester, CourseName, TeacherID) ' +
            'VALUES (?, ?, ?, ?, ?)';

        db.get(sql1, [course.CourseID], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            if (row) {
                // there is already a course with the same course code!
                resolve('Already existing');
            }
            else {
                // insert the new course
                db.run(sql2, [course.Code, course.Year, course.Semester, course.Course, course.Teacher], (error) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    else {
                        resolve('Successfully inserted');
                    }
                });
            }
        });
    });
}
exports.insertNewCourses = async (courses) => {

    try {
        for (let i = 0; i < courses.length; i++) {
            const course = courses[i];
            await insertCourse(course);
        }
    }
    catch (err) {
        throw (err);
    }
    return (true);

}

// reads the semester a course is held
const readSemester = (courseID) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT Semester FROM Course WHERE CourseID = ?';
        db.get(sql, [courseID], (err, row) => {
            if (err) {
                reject(err);
            }
            else {
                if (row) {
                    resolve(row.Semester);
                }
                else {
                    resolve(undefined)
                }
            }
        })
    });
}

const adjustToISOformat = (time) => {

    const hour = time.split(':')[0].length < 2 ? `0${time.split(':')[0]}` : time.split(':')[0];
    const min = time.split(':')[1].length < 2 ? `0${time.split(':')[1]}` : time.split(':')[1];
    return `${hour}:${min}:00`;
}

// Generates all days of the semester in which the lecture is scheduled (e.g. all mondays from 14:00 to 15:30)
const generateSchedule = async (schedule) => {
    try {
        const semester = await readSemester(schedule.Code);
        if (!semester) {
            return undefined;
        }
        else {

            //compute dates of lectures
            const semesterStart = semester === 1 ? moment('2020-09-28') : moment('2021-03-01');
            const semesterEnd = semester === 1 ? moment('2021-01-15') : moment('2021-06-11');

            //go to the correct day of week
            while (semesterStart.format('ddd').localeCompare(schedule.Day) !== 0) {
                semesterStart.add(1, 'days');
            }

            const selectedDates = [];
            const selectedDate = semesterStart;
            const time = (schedule.Time).split('-');

            if(time.length !== 2){
                // the line is corrupted, so discard it!
                return selectedDates;
            }

            const startTime = adjustToISOformat(time[0]);
            const endTime = adjustToISOformat(time[1]);
            const { Day, Time, ...info } = schedule;

            //select all weeks days in the semester
            while (selectedDate.isSameOrBefore(semesterEnd)) {
                const timeStart = `${selectedDate.format('YYYY-MM-DD')}T${startTime}`;
                const timeEnd = `${selectedDate.format('YYYY-MM-DD')}T${endTime}`;
                selectedDates.push({ ...info, timeStart: timeStart, timeEnd: timeEnd });
                selectedDate.add(7, 'days');
            }
            return selectedDates;
        }
    }
    catch (err) {
        throw (err);
    }
}

// checks if a scjedule is already existing otherwise it inserts it into the db table CourseSchedule
const insertNewSchedule = (lesson) => {
    return new Promise((resolve, reject) => {
        const sql1 = 'SELECT * FROM CourseSchedule WHERE CourseID = ? AND TimeStart = ?';
        const sql2 = 'INSERT INTO CourseSchedule(CourseID, CourseStatus, CourseType, TimeStart, TimeEnd, OccupiedSeat, MaxSeat, Classroom) ' +
            'VALUES (?, 1, 1, ?, ?, 0, ?, ?)';

        db.get(sql1, [lesson.Code, lesson.timeStart], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            if (row) {
                // there is already a scheduled lecture in that date for the course!
                resolve('Already existing');
            }
            else {
                db.run(sql2, [lesson.Code, lesson.timeStart, lesson.timeEnd, lesson.Seats, lesson.Room], (error) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    else {
                        resolve('Successfully inserted');
                    }
                });
            }
        });
    });
}

// inserts all schedules read from the file sent by the front end
exports.insertNewSchedules = async (newSchedules) => {
    try {
        for (let i = 0; i < newSchedules.length; i++) {
            const schedule = newSchedules[i];
            const lecturesToInsert = await generateSchedule(schedule);
            for (let j = 0; j < lecturesToInsert.length; j++) {
                const lesson = lecturesToInsert[j];
                await insertNewSchedule(lesson);
            }
        }
    }
    catch (err) {
        throw (err);
    }
    return (true);
}

const insertNewUser = (user, userType) => {
    return new Promise((resolve, reject) => {
        
        const sql1 = 'SELECT * FROM User WHERE UserID = ?';
        const sql2 = 'INSERT INTO User(UserID, Name, Surname, UserName, AccessLevel, Password, City, Birthday, SSN) ' +
            'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const userID = userType === 1 ? user.Id : user.Number;
        db.get(sql1, [userID], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            if (row) {
                // there is already a user with that id!
                resolve('Already existing');
            }
            else {

                const password = '$2b$12$7iALJ38k/PBlAB7b8JDksu7v85z.tjnC9XfoMdUJd75bIId87Ip2S';
                const city = userType === 1 ? user.City : null;
                const birthday = userType === 1 ? user.Birthday : null;
                const name = userType === 1 ? user.Name : user.GivenName;
                
                db.run(sql2, [userID, name, user.Surname, user.OfficialEmail, userType, password, city, birthday, user.SSN], (error) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    else {
                        resolve('Successfully inserted');
                    }
                });
            }
        });
    });
}

exports.insertNewStudents = async (students) => {

    try {
        for (let i = 0; i < students.length; i++) {
            const student = students[i];
            await insertNewUser(student, 1);
        }
        console.log('finito')
    }
    catch (err) {
        throw (err);
    }
    return (true);
}

exports.insertNewTeachers = async (teachers) => {

    try {
        for (let i = 0; i < teachers.length; i++) {
            const teacher = teachers[i];
            await insertNewUser(teacher, 2);
        }
    }
    catch (err) {
        throw (err);
    }
    return (true);
}

const insertNewEnrollment = (enrollment) => {
    return new Promise((resolve, reject) => {
        const sql1 = 'SELECT * FROM StudentCourse WHERE CourseID = ? AND StudentID = ?';
        const sql2 = 'INSERT INTO StudentCourse(CourseID, StudentID) ' +
            'VALUES (?, ?)';

        db.get(sql1, [enrollment.Code, enrollment.Student], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            if (row) {
                // the student is already enrolled in that course!
                resolve('Already existing');
            }
            else {
                db.run(sql2, [enrollment.Code, enrollment.Student], (error) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    else {
                        resolve('Successfully inserted');
                    }
                });
            }
        });
    });
}
exports.insertNewEnrollments = async (newEnrollments) => {

    try {
        for (let i = 0; i < newEnrollments.length; i++) {
            const enrollment = newEnrollments[i];
            await insertNewEnrollment(enrollment);
        }
    }
    catch (err) {
        throw (err);
    }
    return (true);
}

// check the fields of room if file is provided!
// for now they are s upposed to be Room, Seats
const insertNewRoom = (room) => {
    return new Promise((resolve, reject) => {
        const sql1 = 'SELECT * FROM Classroom WHERE ClassroomName = ?';
        const sql2 = 'INSERT INTO Classroom(ClassroomName, MaxSeats) ' +
            'VALUES (?, ?)';

        db.get(sql1, [room.Room], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            if (row) {
                // there is already a room with that name!
                resolve('Already existing');
            }
            else {
                db.run(sql2, [room.Room, room.Seats], (error) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    else {
                        resolve('Successfully inserted');
                    }
                });
            }
        });
    });
}

exports.insertNewRooms = async (rooms) =>  {
    try {
        for (let i = 0; i < rooms.length; i++) {
            const room = rooms[i];
            await insertNewRoom(room);
        }
    }
    catch (err) {
        throw (err);
    }
    return (true);
}