'use strict'

const db = require('../db');
const ClassroomData = require('./ClassroomData');
const CourseData = require('./CourseData');
const User = require('./User');
const LessonsData = require('./LessonsData');
const EnrollmentData = require('./EnrollmentData');
const CourseBasicSchedule = require('./CourseBasicSchedule');
const emailDao = require('./emailDao');
const emailAPI = require('../emailAPI');
const moment = require('moment');
const bcrypt = require('bcrypt');
const e = require('express');

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
                const courses = rows.map(row => new CourseData(
                    row.CourseID, row.CourseName, row.TeacherID,
                    0, 0, 0, 0, 0, 0, 0, 0));
                resolve(courses);
            }
        });
    });
}

exports.getUsers = (userType) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT UserID, Name, Surname, UserName ' +
            'FROM User ' +
            'WHERE AccessLevel = ?';
        db.all(sql, [userType], (err, rows) => {
            if (err) {
                reject(err);
            }
            else {
                const students = rows.map(row => new User(row.UserID, row.Name + ' ' + row.Surname, row.UserName, undefined, undefined, undefined));
                resolve(students);
            }
        });
    });
}

exports.getLessons = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * '
            + 'FROM CourseSchedule ORDER BY TimeStart ASC';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            }
            else {
                const courses = rows.map(row => new LessonsData(
                    row.CourseScheduleID, row.CourseID, row.TimeStart, row.TimeEnd,
                    row.OccupiedSeat, row.MaxSeat, row.CourseStatus, row.CourseType, row.Classroom,
                    0, 0, 0, 0));
                resolve(courses);
            }
        });
    });
}

exports.getEnrollments = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM StudentCourse';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            }
            else {
                const enrollments = rows.map(row => new EnrollmentData(row.CourseID, row.StudentID));
                resolve(enrollments);
            }
        });
    })
}

exports.getSchedules = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM GeneralCourseSchedule';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            }
            else {
                const schedules = rows.map((row) => {
                    const startTime = adjustToISOformat(row.StartTime);
                    const endTime = adjustToISOformat(row.EndTime)
                    return new CourseBasicSchedule(row.ID, row.CourseID, row.Day, startTime, endTime, row.Room)
                });
                resolve(schedules);
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
        let fields = line.split(',');

        if (fields.length !== header.length) {
            const buf = line.split('"');
            const name = buf[1];
            const part0 = buf[0].split(',');
            part0.pop()
            const part2 = buf[2].replace(',', '');
            fields = [part0[0], part0[1], part0[2], name, part2]

            // skip the line if it contains wrong data
            if (part0.length + 2 !== header.length)
                return;

            fields = [part0[0], part0[1], part0[2], name, part2]
        }
        // build an object with the header names as keys and the line values as values
        fields.forEach((field, index) => {
            console.log(field);
            objectToInsert[header[index]] = field;
        });

        // add the object to the array of rows to insert
        rowsToInsert.push(objectToInsert);
    });

    return rowsToInsert;
}

exports.insertNewCourses = async (courses) => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            const sql1 = 'SELECT CourseID FROM Course';
            db.all(sql1, [], (err, rows) => {
                if (err) {
                    reject(err);
                }
                else {

                    //filter courses excluding the ones already in the db
                    const alreadyInserted = rows.map(row => row.CourseID);
                    const coursesToInsert = courses.filter((course) => {
                        return !alreadyInserted.includes(course.Code);
                    });

                    if (coursesToInsert.length !== 0) {
                        const sql2 = 'INSERT INTO Course(CourseID, Year, Semester, CourseName, TeacherID) ' +
                            'VALUES (?, ?, ?, ?, ?)';
                        db.run("begin transaction");
                        for (let i = 0; i < coursesToInsert.length; i++) {
                            const course = coursesToInsert[i];
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
                        db.run("commit");
                    }
                    else {
                        //nothing to insert
                        resolve('Successfully inserted');
                    }
                }
            });
        });
    });

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

            if (time.length !== 2) {
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

// inserts all schedules read from the file sent by the front end
exports.insertNewSchedules = async (newSchedules) => {
    return new Promise(async (resolve, reject) => {
        const lecturesToInsert = [];
        for (let i = 0; i < newSchedules.length; i++) {
            const schedule = newSchedules[i];
            const newLectures = await generateSchedule(schedule);
            if (newLectures)
                lecturesToInsert.push(...newLectures);
            }
        if (lecturesToInsert.length === 0) {
            resolve('No insertion, since there are no courses!');
            return;
        }
        else {
            const sql1 = 'SELECT CourseID, TimeStart FROM CourseSchedule';
            db.all(sql1, [], (err, rows) => {
                if (err) {
                    reject(err);
                }
                else {

                    //filter schedules excluding the ones already in the db
                    const schedulesToInsert = lecturesToInsert.filter((schedule) => {
                        return rows.find((row) => {
                            return row.CourseID === schedule.Code && row.TimeStart.localeCompare(schedule.timeStart) === 0;
                        }) === undefined;
                    });
                    if (schedulesToInsert.length !== 0) {
                        const sql2 = 'INSERT INTO CourseSchedule(CourseID, CourseStatus, CourseType, TimeStart, TimeEnd, OccupiedSeat, MaxSeat, Classroom) ' +
                            'VALUES (?, 1, 1, ?, ?, 0, ?, ?)';
                        db.run('begin transaction');
                        for (let i = 0; i < schedulesToInsert.length; i++) {
                            const schedule = schedulesToInsert[i];
                            db.run(sql2, [schedule.Code, schedule.timeStart, schedule.timeEnd, schedule.Seats, schedule.Room], (error) => {
                                if (error) {
                                    reject(error);
                                }
                                else {
                                    resolve('Successfully inserted!');
                                }
                            });
                        }
                        db.run('commit');
                    }
                    else {
                        resolve('Successfully inserted');
                    }
                }
            });
        }
    });
}

exports.insertNewGeneralSchedules = (newLessons) => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            const sql1 = 'SELECT * FROM GeneralCourseSchedule';
            db.all(sql1, [], (err, rows) => {
                if (err) {
                    reject(err);
                }
                else {

                    //filter the schedules by excluding the ones aleady in the db
                    const schedulesToInsert = newLessons.filter((schedule) => {
                        return rows.find((row) => {
                            const time = (schedule.Time).split('-');
                            const startTime = time[0];
                            return (row.CourseID === schedule.Code && row.Day.localeCompare(schedule.Day) === 0
                                && row.StartTime.localeCompare(startTime) === 0);
                        }) === undefined;
                    });
                    if (schedulesToInsert.length !== 0) {
                        const sql2 = `INSERT INTO GeneralCourseSchedule(CourseID, Day, StartTime, EndTime, Room) 
                                      VALUES (?, ?, ?, ?, ?)`;
                        db.run('begin transaction');
                        for (let i = 0; i < schedulesToInsert.length; i++) {
                            const schedule = schedulesToInsert[i];
                            const time = (schedule.Time).split('-');
                            const timeStart = time[0];
                            const timeEnd = time[1];
                            db.run(sql2, [schedule.Code, schedule.Day, timeStart, timeEnd, schedule.Room], (error) => {
                                if (error) {
                                    reject(error);
                                }
                                else {
                                    resolve('Successfully Inserted');
                                }
                            });
                        }
                        db.run('commit');
                    }
                    else {
                        resolve('Successfully Inserted');
                    }
                }
            });
        });
    });
}

exports.insertNewUsers = (users, usersType) => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            const sql1 = 'SELECT UserID FROM User WHERE AccessLevel = ?';
            db.all(sql1, [usersType], (err, rows) => {
                if (err) {
                    reject(err);
                }
                else {

                    // filter the students to insert by excluding the ones already in the db
                    const alreadyInserted = rows.map(row => row.UserID);
                    const usersToInsert = users.filter((user) => {
                        if (usersType === 1) {
                            return !alreadyInserted.includes(user.Id);
                        }
                        else {
                            return !alreadyInserted.includes(user.Number);
                        }
                    });

                    if (usersToInsert.length !== 0) {
                        const sql2 = 'INSERT INTO User(UserID, Name, Surname, UserName, AccessLevel, Password, City, Birthday, SSN) ' +
                            'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';

                        db.run("begin transaction");
                        for (let i = 0; i < usersToInsert.length; i++) {
                            const user = usersToInsert[i];
                            const userID = usersType === 1 ? user.Id : user.Number;
                            const password = '$2b$12$7iALJ38k/PBlAB7b8JDksu7v85z.tjnC9XfoMdUJd75bIId87Ip2S';
                            const city = usersType === 1 ? user.City : null;
                            const birthday = usersType === 1 ? user.Birthday : null;
                            const name = usersType === 1 ? user.Name : user.GivenName;
                            db.run(sql2, [userID, name, user.Surname, user.OfficialEmail, usersType, password, city, birthday, user.SSN], (error) => {
                                if (error) {
                                    reject(error);
                                    return;
                                }
                                else {
                                    resolve('Successfully inserted');
                                }
                            });
                        }
                        db.run("commit");
                    }
                    else {

                        //nothing to insert
                        resolve('Succesfully inserted');
                    }
                }
            });
        });
    });
}


exports.insertNewEnrollments = async (newEnrollments) => {
    return new Promise((resolve, reject) => {
        db.serialize(function () {
            db.all('SELECT * FROM StudentCourse', (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }

                //filter new Enrollments file by exist records in DB
                var filteredEnrollment = newEnrollments.filter(comparer(row));
                if (filteredEnrollment.length) {
                    db.run("begin transaction");
                    for (var i = 0; i < filteredEnrollment.length; i++) {
                        db.run('INSERT INTO StudentCourse(CourseID, StudentID) VALUES (?, ?)', [filteredEnrollment[i].Code, filteredEnrollment[i].Student], (error) => {
                            if (error) {
                                reject(error);
                                return;
                            }
                            else {
                                resolve('Successfully inserted');
                            }
                        });
                    }
                    db.run("commit");//bulk insert
                }
                resolve('Successfully inserted');
            });
        });

    })
}

function comparer(otherArray) {
    return function (current) {
        return otherArray.filter(function (other) {
            return other.CourseID == current.Code && other.StudentID == current.Student
        }).length == 0;
    }
}


// check the fields of room if file is provided!
// for now they are s upposed to be Room, Seats
exports.insertNewRooms = async (rooms) => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            const sql1 = 'SELECT ClassroomName FROM Classroom';
            db.all(sql1, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                else {

                    //filter rooms to insert by excluding the ones already in the db
                    const alreadyInserted = rows.map(row => row.ClassroomName);
                    const roomsToInsert = rooms.filter((room) => {
                        return !alreadyInserted.includes(room.Room);
                    });
                    if (roomsToInsert.length !== 0) {
                        const sql2 = 'INSERT INTO Classroom(ClassroomName, MaxSeats) ' +
                            'VALUES (?, ?)';
                        db.run("begin transaction");
                        for (let i = 0; i < roomsToInsert.length; i++) {
                            const room = roomsToInsert[i];
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
                        db.run("commit");
                    }
                    else {
                        resolve('Successfully inserted');
                    }
                }
            });
        });
    });
}

exports.createEnrollment = (enrollment) => {
    return new Promise((resolve, reject) => {
        const sql1 = 'SELECT * FROM StudentCourse WHERE CourseID = ? AND StudentID = ?'
        const sql2 = 'INSERT INTO StudentCourse(CourseID, StudentID) ' +
            'VALUES (?, ?)';
        console.log(enrollment)
        db.get(sql1, [enrollment.courseId, enrollment.studentId], (error, row) => {
            if (error) {
                reject(error);
            }
            else {
                if (row) {
                    resolve('Already existing!');
                }
                else {
                    db.run(sql2, [enrollment.courseId, enrollment.studentId], (err) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve('Succesfully inserted!')
                        }
                    });
                }
            }
        });
    });
}

exports.createNewClassroom = (classRoomName, maxSeats) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO Classroom(ClassroomName, MaxSeats) VALUES (?, ?)';

        db.get(sql, [classRoomName, maxSeats], (error) => {
            if (error) {
                reject(error);
                return;
            }
            resolve('Classroom inserted');
        });
    });
}

exports.createNewEnrollment = (studentId, courseId) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO StudentCourse(CourseID, StudentID) VALUES (?, ?)';

        db.get(sql, [courseId, studentId], (error) => {
            if (error) {
                reject(error);
                return;
            }
            resolve('New enrollment inserted');
        });
    });
}

exports.createNewCourse = (year, semester, courseName, teacherId) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO Course(CourseID,Year,Semester,CourseName,TeacherID) VALUES (?,?,?,?,?)';
        const id = Math.floor((Math.random() * 1000000) + 1);
        db.get(sql, [id, year, semester, courseName, teacherId], (error) => {
            if (error) {
                reject(error);
                return;
            }
            resolve('New course inserted');
        });
    });
}

exports.createNewUser = (userId, fullName, email, password, type) => {
    return new Promise((resolve, reject) => {

        const sql = 'INSERT INTO User(UserID, Name, UserName, AccessLevel, Password) VALUES (?,?,?,?,?)';

        bcrypt.hash(password, 0, (err, hash) => {
            if (err) {
                reject(err);
                return;
            }
            db.run(sql, [userId, fullName, email, type, hash], (error) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve('New user inserted');
            });
        });
    });
}

exports.createNewLesson = (courseId, errorLessonStatus, lessonType, startDate, endDate, classroom) => {
    return new Promise((resolve, reject) => {

        const sql = 'INSERT INTO CourseSchedule(CourseID, CourseStatus, CourseType, TimeStart, TimeEnd, Classroom) VALUES (?,?,?,?,?,?)';

        db.get(sql, [courseId, errorLessonStatus, lessonType, startDate, endDate, classroom], (error) => {
            if (error) {
                reject(error);
                return;
            }
            resolve('New lesson inserted');
        });
    });
}

exports.editLesson = (scheduleId, courseId, lessonStatus, lessonType, startDate, endDate, classroom) => {
    return new Promise((resolve, reject) => {

        lessonStatus = !lessonStatus ? 1 : 0;
        lessonType = !lessonType ? 1 : 0;

        const sql = `
        UPDATE CourseSchedule
        SET CourseID = ?, CourseStatus = ?, CourseType = ?, TimeStart = ?, TimeEnd = ?, Classroom = ?
        WHERE CourseScheduleID = ?`;
        if(moment(startDate).isSameOrBefore(moment(), 'days') || moment(endDate).isSameOrBefore(moment(), 'days') 
            || !moment(startDate).isSame(moment(endDate), 'days')){
                reject('wrong data');
                return;
            }
        emailDao.getLectureInfo(scheduleId)
        .then((info) => {
            const emailInfo = {
                notificationType: 5,
                course: info.course,
                oldDate: info.date,
                oldStart: info.start,
                oldEnd: info.end,
                oldRoom: info.room,
                newDate: moment(startDate).format('ddd DD/MM/YYYY'),
                newStart: moment(startDate).format('HH:mm'),
                newEnd: moment(endDate).format('HH:mm'),
                newRoom: classroom,
            }
            emailDao.getStudentsToNotify(scheduleId)
            .then((emails) => {
                emails.forEach((email) => {
                    emailAPI.sendNotification(email.UserName, emailInfo);
                });

                db.run(sql, [courseId, lessonStatus, lessonType, startDate, endDate, classroom, scheduleId], (error) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve('Lesson updated');
                });
            });
        });
    });
}

const editGeneralSchedule = (generalScheduleId, newData) => {

    return new Promise((resolve, reject) => {
        const sql = `UPDATE GeneralCourseSchedule 
                     SET CourseID = ?, Day = ?, StartTime = ?, EndTime = ?, Room = ? 
                     WHERE ID = ?`;

        let start = newData.startTime.substring(0, 5);
        let end = newData.endTime.substring(0, 5);
        if (start.startsWith('0')) {
            start = start.substring(1);
        }
        if (end.startsWith('0')) {
            end = end.substring(1);
        }
        db.run(sql, [newData.courseId, newData.day, start, end, newData.classroom, generalScheduleId], (err) => {
            if (err) {
                reject(err);
            }
            else {
                resolve('Success');
            }
        })
    });
}

exports.updateAllSchedules = (scheduleId, newData) => {
    return new Promise((resolve, reject) => {
        readScheduleData(scheduleId)
            .then((oldData) => {
                selectSchedulesToUpdate(oldData)
                    .then((selected) => {
                        if (selected.length === 0) {
                            resolve('Nothing updated');
                            return;
                        }
                        const sql = `UPDATE CourseSchedule
                                     SET CourseID = ?, TimeStart = ?, TimeEnd = ?, Classroom = ?
                                     WHERE CourseScheduleID = ?`;
                        db.serialize(() => {
                            db.run('begin transaction');
                            selected.forEach((schedule) => {
                                const newSchedule = computeNewSchedule(schedule.TimeStart, schedule.TimeEnd, newData.day, newData.startTime, newData.endTime);
                                if (newSchedule !== undefined) {
                                    emailDao.getLectureInfo(schedule.CourseScheduleID)
                                        .then((info) => {
                                            const emailInfo = {
                                                notificationType: 5,
                                                course: info.course,
                                                oldDate: info.date,
                                                oldStart: info.start,
                                                oldEnd: info.end,
                                                oldRoom: info.room,
                                                newDate: moment(newSchedule.start).format('ddd DD/MM/YYYY'),
                                                newStart: moment(newSchedule.start).format('HH:mm'),
                                                newEnd: moment(newSchedule.end).format('HH:mm'),
                                                newRoom: newData.classroom,
                                            }
                                            emailDao.getStudentsToNotify(schedule.CourseScheduleID)
                                                .then((emails) => {
                                                    emails.forEach((email) => {
                                                        emailAPI.sendNotification(email.UserName, emailInfo);
                                                    });
                                                });
                                            db.run(sql, [newData.courseId, newSchedule.start, newSchedule.end, newData.classroom, schedule.CourseScheduleID], (error) => {
                                                if (error) {
                                                    reject(error);
                                                    return;
                                                }
                                            });
                                        });
                                }
                            });
                            db.run('commit');
                        });
                        editGeneralSchedule(scheduleId, newData)
                            .then(() => {
                                resolve('Successfully updated');
                            })
                            .catch(err3 => reject(err3));

                    })
                    .catch(err2 => reject(err2));
            })
            .catch(err1 => reject(err1));
    });
}

const readScheduleData = (scheduleId) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM GeneralCourseSchedule WHERE ID = ?`;
        db.get(sql, [scheduleId], (err, row) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(new CourseBasicSchedule(row.ID, row.CourseID, row.Day, row.StartTime, row.EndTime, row.Room));
            }
        });
    });
}

const selectSchedulesToUpdate = (oldData) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT CourseScheduleID, TimeStart, TimeEnd 
                     FROM CourseSchedule 
                     WHERE CourseID = ?`;

        db.all(sql, [oldData.courseId], (error, rows) => {
            if (error) {
                reject(error);
            }
            else {
                //select only schedules in the right day and startTime and EndTime
                const selected = rows.filter((row) => {
                    const day = moment(row.TimeStart).format('ddd');
                    //check if it is the right day of week
                    if (day.localeCompare(oldData.day) !== 0) {
                        return false;
                    }
                    //check if the date is before now (useless to update)
                    const date = moment(row.TimeStart);
                    if (date.isSameOrBefore(moment(), 'day')) {
                        return false;
                    }
                    
                    //check the start and end time
                    const start = moment(row.TimeStart).format('H:mm');
                    const end = moment(row.TimeEnd).format('H:mm');
                    const oldStart = oldData.startTime;
                    const oldEnd = oldData.endTime;
                    if (start.localeCompare(oldStart) !== 0 || end.localeCompare(oldEnd) !== 0) {
                        return false;
                    }
                    
                    return true;
                });
                resolve(selected);
            }
        });
    });
}

const computeNewSchedule = (oldStart, oldEnd, newDay, newStartTime, newEndTime) => {
    let newDayNum;
    switch (newDay) {
        case 'Mon':
            newDayNum = 1;
            break;
        case 'Tue':
            newDayNum = 2;
            break;
        case 'Wed':
            newDayNum = 3;
            break;
        case 'Thu':
            newDayNum = 4;
            break;
        case 'Fri':
            newDayNum = 5;
            break;
    }
    const oldStartNum = moment(oldStart).format('d');
    const difference = newDayNum - oldStartNum;
    //check if the new Schedule is in the past !!
    if (!moment(oldStart).add(difference, 'days').isSameOrBefore(moment(), 'days')) {
        const newStart = `${moment(oldStart).add(difference, 'days').format('YYYY-MM-DD')}T${newStartTime}`;
        const newEnd = `${moment(oldEnd).add(difference, 'days').format('YYYY-MM-DD')}T${newEndTime}`;
        const newSchedule = {
            start: newStart,
            end: newEnd
        };
        return newSchedule;
    }
    else {
        return undefined;
    }
}

exports.deleteSchedules = (scheduleId) => {
    return new Promise((resolve, reject) => {
        readScheduleData(scheduleId)
            .then((oldData) => {
                selectSchedulesToUpdate(oldData)
                    .then((selected) => {
                        const sql = 'DELETE FROM CourseSchedule WHERE CourseScheduleID = ?';
                        const sql2 = 'DELETE FROM Booking WHERE CourseScheduleID = ?'
                        selected.forEach((schedule) => {
                            emailDao.getLectureInfo(schedule.CourseScheduleID)
                                .then((info) => {
                                    info.notificationType = 3;
                                    emailDao.getStudentsToNotify(schedule.CourseScheduleID)
                                        .then((emails) => {
                                            emails.forEach((email) => {
                                                emailAPI.sendNotification(email.UserName, info);
                                            })
                                        });
                                });
                        });

                        db.serialize(() => {
                            db.run('begin transaction');
                            selected.forEach((schedule) => {
                                db.run(sql, [schedule.CourseScheduleID], (error1) => {
                                    if (error1) {
                                        reject(error1);
                                        return;
                                    }
                                    else {
                                        db.run(sql2, [schedule.CourseScheduleID], (error2) => {
                                            if (error2) {
                                                reject(error2);
                                                return;
                                            }
                                        });
                                    }
                                });
                            });
                            db.run('commit');
                        })
                        deleteGeneralSchedule(scheduleId)
                            .then(() => {
                                resolve('Successfully deleted');
                            })
                            .catch(err3 => reject(err3));
                    })
                    .catch(err2 => reject(err2))
            })
            .catch(err1 => reject(err1))
    });
}

const deleteGeneralSchedule = (scheduleId) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM GeneralCourseSchedule WHERE ID = ?';
        db.run(sql, [scheduleId], (err) => {
            if (err) {
                reject(err);
            }
            else {
                resolve('successfully deleted');
            }
        });
    });
}

exports.createNewSchedule = (newSchedule) => {
    return new Promise((resolve, reject) => {
        generateFutureSchedules(newSchedule)
            .then((schedules) => {
                if (schedules.length === 0) {
                    resolve('Nothing inserted');
                    return;
                }
                readClassroomSeats(newSchedule.classroom)
                    .then((seats) => {
                        const sql = 'INSERT INTO CourseSchedule(CourseID, CourseStatus, CourseType, TimeStart, TimeEnd, OccupiedSeat, MaxSeat, Classroom) ' +
                            'VALUES (?, 1, 1, ?, ?, 0, ?, ?)';
                        db.serialize(() => {
                            db.run('begin transaction');
                            schedules.forEach((schedule) => {
                                db.run(sql, [newSchedule.courseId, schedule.timeStart, schedule.timeEnd, seats, newSchedule.classroom], (error) => {
                                    if (error) {
                                        reject(error);
                                        return;
                                    }
                                });
                            });
                            db.run('commit');
                        });
                        insertNewGeneralSchedule(newSchedule)
                            .then(() => resolve('successfully inserted'))
                            .catch(err3 => reject(err3));
                    })
                    .catch(err2 => reject(err2));
            })
            .catch(err1 => reject(err1));
    });
}

const generateFutureSchedules = (schedule) => {
    return new Promise((resolve, reject) => {
        readSemester(schedule.courseId)
            .then((semester) => {
                if (!semester) {
                    reject(undefined);
                }
                else {
                    //compute dates of lectures
                    const semesterStart = semester === 1 ? moment('2020-09-28') : moment('2021-03-01');
                    const semesterEnd = semester === 1 ? moment('2021-01-15') : moment('2021-06-11');

                    //go to the correct day of week
                    while (semesterStart.format('ddd').localeCompare(schedule.day) !== 0) {
                        semesterStart.add(1, 'days');
                    }

                    const selectedDates = [];
                    const selectedDate = semesterStart;
                    //select all weeks days in the semester
                    while (selectedDate.isSameOrBefore(semesterEnd)) {
                        if (selectedDate.isAfter(moment(), 'days')) {
                            const timeStart = `${selectedDate.format('YYYY-MM-DD')}T${schedule.startTime}`;
                            const timeEnd = `${selectedDate.format('YYYY-MM-DD')}T${schedule.endTime}`;
                            selectedDates.push({ timeStart: timeStart, timeEnd: timeEnd });
                        }
                        selectedDate.add(7, 'days');
                    }
                    resolve(selectedDates);
                }
            })
            .catch(err1 => reject(err1));
    });
}

const readClassroomSeats = (classroom) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT MaxSeats FROM Classroom Where ClassroomName = ?';
        db.get(sql, [classroom], (err, row) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(row.MaxSeats);
            }
        });
    });
}

const insertNewGeneralSchedule = (newSchedule) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO GeneralCourseSchedule(CourseID, Day, StartTime, EndTime, Room) ' +
            'VALUES (?, ?, ?, ?, ?)';
        let start = newSchedule.startTime.substring(0, 5);
        let end = newSchedule.endTime.substring(0, 5);
        if (start.startsWith('0')) {
            start = start.substring(1);
        }
        if (end.startsWith('0')) {
            end = end.substring(1);
        }
        db.run(sql, [newSchedule.courseId, newSchedule.day, start, end, newSchedule.classroom], (err) => {
            if (err) {
                reject(err);
            }
            else {
                resolve('successfully inserted');
            }
        });
    });
}