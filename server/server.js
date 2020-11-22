"use strict";

const express = require("express");//import express
const morgan = require("morgan"); // logging middleware
const userDao = require('./dao/userDao');
const jwt = require('express-jwt');
const jsonwebtoken = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const moment = require('moment');
const emailAPI = require('./emailAPI');
const bookingDao = require('./dao/bookingDao');
const dailyMailer = require('./dailyMailer');
const teacherDao = require('./dao/teacherDao');
const emailDao = require('./dao/emailDao');

const jwtSecret = '123456789';
const expireTime = 300; //seconds

const app = express();
const port = 3001;


app.use(morgan("tiny"));// Set-up logging
app.use(express.json());// Process body content
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('Hello SoftENG members!');
});

/*app.get('/test/:deletedCourse', async (req, res) => {
    
    try{
        const deletedCourseID = req.params.deletedCourse;
        const emails = await emailDao.getStudentsToNotify (deletedCourseID);
        const info = await emailDao.getDeletedLectureInfo(deletedCourseID);
        info.notificationType = 3;
        
        //The for loop is used because the forEach callback cannot handle async calls!
        for(let i = 0; i < emails.length; i++){
            await emailAPI.sendNotification(emails[i].UserName, info);
        }
        res.status(200).end();
    }
    catch(error){
        res.status(500).json(error);
    }
    
})*/
// LOGIN API
app.post('/users/authenticate', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username) {
        res.status(500).json({ error: 'Missing username' });
    }
    if (!password) {
        res.status(500).json({ error: 'Missing password' });
    }

    try {
        const user = await userDao.getUser(username, password);
        if (user === undefined) {
            res.status(401).send({ error: 'Invalid username' });
        }
        else {
            if (!userDao.checkPassword(user, password)) {
                res.status(401).send({ error: 'Invalid password' });
            }
            else {
                // AUTHENTICATION SUCCESS
                const token = jsonwebtoken.sign({ user: user.userID }, jwtSecret, { expiresIn: expireTime });
                res.cookie('token', token, { httpOnly: true, sameSite: true, maxAge: 1000 * expireTime });
                res.status(200).json({ id: user.userID, username: user.username, fullname: user.fullName, accessLevel: user.accessLevel });
            }
        }

    }
    catch (error) {
        res.status(500).json({ msg: "Server error!" });
    }
});

app.use(cookieParser());

app.post('/logout', (req, res) => {
    res.clearCookie('token').end();
});

// For the rest of the code, all APIs require authentication
app.use(
    jwt({
        secret: jwtSecret,
        algorithms: ['sha1', 'RS256', 'HS256'],
        getToken: req => req.cookies.token
    })
);

//PLACE HERE ALL APIs THAT REQUIRE AUTHENTICATION
// DELETE A BOOKING 
app.delete('/deleteBooking/:lessonID', (req, res) => {
    const lessonID = req.params.lessonID;
    bookingDao.deleteBooking(lessonID, req.user.user)
        .then(() => res.status(204).end())
        .catch((err) => res.status(500).json({ error: 'Server error: ' + err }));
});

app.get('/studentCourses', async (req, res) => {
    try {
        const result = await bookingDao.getStudentCourses(req.user.user);
        res.json(result);
    } catch (e) {
        res.status(505).end();
    }
});

// API for getting bookable lectures for a given student
app.get('/myBookableLessons', async (req, res) => {
    try {
        const result = await bookingDao.getBookableLessons(req.user.user);
        res.json(result);
    }
    catch (e) {
        res.status(505).end();
    }
});

// API for retrieving lessons booked by a student
app.get('/myBookedLessons', async (req, res) => {
    try {
        const result = await bookingDao.getBookedLessons(req.user.user);
        res.json(result);
    }
    catch (e) {
        res.status(505).end();
    }
});




//Teacher APIs

/**
* Get all courses for the given teacher
* @route       GET /teacherCourses
* @param       teacherId (read from cookie)
* @access      Private
* @returns     CourseData(courseId, courseName, teacherId)
*/
app.get('/teacherCourses', async (req, res) => {
    try {
        const result = await teacherDao.getTeacherCourses(req.user.user);
        res.status(200).json(result);
    }
    catch (err) {
        res.status(505).end();
    }
});

/**
* Get all lectures for the given teacher
* @route       GET /myCoursesLessons
* @param       teacherId (read from cookie)
* @access      Private
* @returns     LessonsData(scheduleId, courseId, startingTime, endingTime, occupiedSeats, availableSeats)
*/
app.get('/myCoursesLessons', async (req, res) => {
    try {
        const result = await teacherDao.getMyCoursesLessons(req.user.user);
        res.status(200).json(result);
    }
    catch (err) {
        res.status(505).end();
    }
});

/**
* Get a list of booked student for the given lessonsIds/CourseScheduleIDs
* @route       POST /bookedStudents
* @param       lessonsIds (CourseScheduleIDs)
* @access      Private
* @returns     BookingData(id, scheduleId, studentId, status, attended)
*/
app.post('/bookedStudents', async (req, res) => {
    const CourseScheduleIDs = req.body.lessonsIds;
    try {
        const result = await teacherDao.getBookedStudents(CourseScheduleIDs);
        res.status(200).json(result);
    }
    catch (err) {
        res.status(400).json(err.message);
    }
});

/**
* Get a list of student for the given studentsIds
* @route       POST /studentsData
* @param       studentsIds
* @access      Private
* @returns     UserData(id, personId, fullName, email)
*/
app.post('/studentsData', async (req, res) => {
    const studentsIds = req.body.studentsIds;
    try {
        const result = await teacherDao.getStudentsData(studentsIds);
        res.status(200).json(result);
    }
    catch (err) {
        res.status(400).json(err.message);
    }
});

/////////////////////////////////////////////////////////////////////////////////////////////////
//calling by isAuthenticated() API on the front-end
// retrieve the user after login
// to check the qualification of the user to access a page
app.get('/user', (req, res) => {
    const userID = req.user.user;
    userDao.getUserByID(userID)
        .then((user) => {
            res.json({
                userID: user.userID,
                fullName: user.fullName,
                username: user.username,
                accessLevel: user.accessLevel
            });
        }).catch(
            (err) => {
                res.status(401).json({ error: 'Server error: ' + err });
            }
        );
});

app.post('/bookLesson', async (req, res) => {
    try {
        const userID = req.user.user;
        const lectureID = req.body.lessonId;
        let result = await bookingDao.bookLesson(userID, lectureID);
        const user = await userDao.getUserByID(userID);
        const lectureData = await bookingDao.getLectureDataById(lectureID);
        const email = user.username;
        const info = {
            notificationType: 1,
            course: lectureData.CourseName,
            date: moment(lectureData.TimeStart).format('MM/DD/YYYY'),
            start: moment(lectureData.TimeStart).format('HH:mm'),
            end: moment(lectureData.TimeEnd).format('HH:mm')
        }
        result = await emailAPI.sendNotification(email, info);
        res.status(200).end();
    } catch (err) {
        res.status(505).json({ error: 'Server error: ' + err });
    }
});

app.post('/logout', (req, res) => {
    res.clearCookie('token').end();
});

/////////////////////////////////////////////////////////////////////////////////////////////////

// set automatc email sending to professors
dailyMailer.setDailyMail();

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});