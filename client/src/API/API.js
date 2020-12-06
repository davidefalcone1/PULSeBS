import LessonsData from './LessonData';
import CourseData from './CourseData';
import UserData from './UserData';
import BookingData from './BookingData';
import ClassroomData from './ClassroomData';
import { BehaviorSubject } from 'rxjs';


const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('user')));

export const authenticationService = {
    user: currentUserSubject.asObservable(),
    get currentUserValue() { return currentUserSubject.value }
};

//get user data to check his/her qualification
//this will be used anytime that you want to check the user accessibility to a page
async function isAuthenticated() {
    const response = await fetch('/user');
    const userJson = await response.json();
    if (response.ok) {
        return userJson;
    } else {
        let err = { status: response.status, errObj: userJson };
        throw err;  // An object with the error coming from the server
    }
}

//student
function getStudentCourses() {
    return new Promise(async function (resolve, reject) {
        fetch('/studentCourses', {
            method: 'GET',
        })
            .then(async (response) => {
                const coursesJson = await response.json();
                if (response.ok) {
                    const list = coursesJson.map((course) => {
                        return CourseData.fromJson(course);
                    });
                    resolve(list);
                } else {
                    reject();
                }
            }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) });
    });
}
function getMyBookableLessons() {
    return new Promise(async function (resolve, reject) {
        fetch('/myBookableLessons', {
            method: 'GET',
        })
            .then(async (response) => {
                const lessonsJson = await response.json();
                if (response.ok) {
                    const list = lessonsJson.map((lesson) => {
                        return LessonsData.fromJson(lesson);
                    });
                    resolve(list);
                } else {
                    reject();
                }
            }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) });
    });
}
function getMyBookedLessons() {
    return new Promise(async function (resolve, reject) {
        fetch('/myBookedLessons', {
            method: 'GET',
        })
            .then(async (response) => {
                const lessonsJson = await response.json();
                if (response.ok) {
                    const list = lessonsJson.map((lesson) => {
                        return LessonsData.fromJson(lesson);
                    });
                    resolve(list);
                } else {
                    reject();
                }
            }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) });
    });
}
function getMyWaitingBookedLessons() {
    return new Promise(async function (resolve, reject) {
        fetch('/myWaitingBookedLessons', {
            method: 'GET',
        })
            .then(async (response) => {
                const lessonsJson = await response.json();
                if (response.ok) {
                    const list = lessonsJson.map((lesson) => {
                        return LessonsData.fromJson(lesson);
                    });
                    resolve(list);
                } else {
                    reject();
                }
            }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) });
    });
}
async function bookLesson(lessonId) {
    return new Promise((resolve, reject) => {
        fetch("/bookLesson", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "lessonId": lessonId }),
        }).then(async (response) => {
            if (response.ok) {
                response.json()
                    .then((obj) => { resolve(obj); })
                    .catch((err) => {
                        reject(
                            { errors: [{ param: "Application", msg: "Cannot parse server response" }] })
                    });
            } else {
                response.json()
                    .then((obj) => { reject(obj); })
                    .catch((err) => {
                        reject(
                            { errors: [{ param: "Application", msg: "Cannot parse server response" }] })
                    });
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) });
    });
}
async function deleteBooking(lessonId) {
    return new Promise((resolve, reject) => {
        fetch("/deleteBooking/" + lessonId, {
            method: 'DELETE'
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            } else {
                response.json()
                    .then((obj) => { reject(obj); })
                    .catch((err) => {
                        reject(
                            { errors: [{ param: "Application", msg: "Cannot parse server response" }] })
                    });
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) });
    });
}

//teacher
function getTeacherCourses() {
    return new Promise(async function (resolve, reject) {
        fetch('/teacherCourses', {
            method: 'GET',
        })
            .then(async (response) => {
                const coursesJson = await response.json();
                if (response.ok) {
                    const list = coursesJson.map((course) => {
                        return CourseData.fromJson(course);
                    });
                    resolve(list);
                } else {
                    reject();
                }
            }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) });
    });
}
function getMyCoursesLessons() {
    return new Promise(async function (resolve, reject) {
        fetch('/myCoursesLessons', {
            method: 'GET',
        })
            .then(async (response) => {
                const coursesJson = await response.json();
                if (response.ok) {
                    const list = coursesJson.map((course) => {
                        return LessonsData.fromJson(course);
                    });
                    resolve(list);
                } else {
                    reject();
                }
            }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) });
    });
}
function getBookedStudents(lessonsIds) { //so the course schedule id
    return new Promise(async function (resolve, reject) {
        fetch('/bookedStudents', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ lessonsIds }),
        })
            .then(async (response) => {
                const bookedStudentsJson = await response.json();
                if (response.ok) {
                    const list = bookedStudentsJson.map((booking) => {
                        return BookingData.fromJson(booking);
                    });
                    resolve(list);
                } else {
                    reject();
                }
            }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) });
    });
}
function getStudentsData(studentsIds) { //REMEMBER TO SEND A LIST, from bookedStudent create a list with the studentsIds
    return new Promise(async function (resolve, reject) {
        fetch('/studentsData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ studentsIds }),
        })
            .then(async (response) => {
                const studentsJson = await response.json();
                if (response.ok) {
                    const list = studentsJson.map((student) => {
                        return UserData.fromJson(student);
                    });
                    resolve(list);
                } else {
                    reject();
                }
            }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) });
    });
}
async function makeLessonRemote(lessonId) {
    return new Promise((resolve, reject) => {
        fetch("/makeLessonRemote/" + lessonId, {
            method: 'PUT'
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            }
            else {
                response.json()
                    .then((obj) => { reject(obj); })
                    .catch((err) => {
                        reject(
                            { errors: [{ param: "Application", msg: "Cannot parse server response" }] })
                    });
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) });
    });
}
async function cancelLesson(lessonId) {
    return new Promise((resolve, reject) => {
        fetch("/cancelLesson/" + lessonId, {
            method: 'DELETE'
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            } else {
                response.json()
                    .then((obj) => { reject(obj); })
                    .catch((err) => {
                        reject(
                            { errors: [{ param: "Application", msg: "Cannot parse server response" }] })
                    });
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) });
    });
}
async function setStudentAsPresent(lessonId, studentId){
    return new Promise((resolve, reject) => {
        fetch("/setStudentAsPresent/", {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lessonId, studentId })
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            }
            else {
                response.json()
                    .then((obj) => { reject(obj); })
                    .catch((err) => {
                        reject(
                            { errors: [{ param: "Application", msg: "Cannot parse server response" }] })
                    });
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) });
    });
}

//support manager
async function createNewClassroom(classRoomName, maxSeats){
    return new Promise((resolve, reject) => {
        fetch("/createNewClassroom", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ classRoomName, maxSeats })
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            }
            else {
                response.json()
                    .then((obj) => { reject(obj); })
                    .catch((err) => {
                        reject(
                            { errors: [{ param: "Application", msg: "Cannot parse server response" }] })
                    });
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) });
    });
}
async function createNewCourse(courseName, teacherId){
    return new Promise((resolve, reject) => {
        fetch("/createNewCourse", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ courseName, teacherId })
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            }
            else {
                response.json()
                    .then((obj) => { reject(obj); })
                    .catch((err) => {
                        reject(
                            { errors: [{ param: "Application", msg: "Cannot parse server response" }] })
                    });
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) });
    });
}
async function createNewUser(userId, fullName, email, password, type){
    return new Promise((resolve, reject) => {
        fetch("/createNewUser", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, fullName, email, password, type })
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            }
            else {
                response.json()
                    .then((obj) => { reject(obj); })
                    .catch((err) => {
                        reject(
                            { errors: [{ param: "Application", msg: "Cannot parse server response" }] })
                    });
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) });
    });
}
async function editLesson(scheduleId, courseId, errorLessonStatus, lessonType, startDate, endDate, classroom){
    return new Promise((resolve, reject) => {
        fetch("/editLesson", {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ scheduleId, courseId, errorLessonStatus, lessonType, startDate, endDate, classroom })
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            }
            else {
                response.json()
                    .then((obj) => { reject(obj); })
                    .catch((err) => {
                        reject(
                            { errors: [{ param: "Application", msg: "Cannot parse server response" }] })
                    });
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) });
    });
}
async function createNewLesson(courseId, errorLessonStatus, lessonType, startDate, endDate, classroom){
    return new Promise((resolve, reject) => {
        fetch("/createNewLesson", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ courseId, errorLessonStatus, lessonType, startDate, endDate, classroom })
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            }
            else {
                response.json()
                    .then((obj) => { reject(obj); })
                    .catch((err) => {
                        reject(
                            { errors: [{ param: "Application", msg: "Cannot parse server response" }] })
                    });
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) });
    });
}
function getAllClassrooms(){
    return new Promise(async function (resolve, reject) {
        fetch('/allClassrooms', {
            method: 'GET',
        })
            .then(async (response) => {
                const classroomsJson = await response.json();
                if (response.ok) {
                    const list = classroomsJson.map((classroom) => {
                        return ClassroomData.fromJson(classroom);
                    });
                    resolve(list);
                } else {
                    reject();
                }
            }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) });
    });
}
function getAllCourses(){
    return new Promise(async function (resolve, reject) {
        fetch('/allCourses', {
            method: 'GET',
        })
            .then(async (response) => {
                const coursesJson = await response.json();
                if (response.ok) {
                    const list = coursesJson.map((course) => {
                        return CourseData.fromJson(course);
                    });
                    resolve(list);
                } else {
                    reject();
                }
            }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) });
    });
}
function getAllStudents(){
    return new Promise(async function (resolve, reject) {
        fetch('/allStudents', {
            method: 'GET',
        })
            .then(async (response) => {
                const usersJson = await response.json();
                if (response.ok) {
                    const list = usersJson.map((user) => {
                        return UserData.fromJson(user);
                    });
                    resolve(list);
                } else {
                    reject();
                }
            }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) });
    });
}
function getAllTeachers(){
    return new Promise(async function (resolve, reject) {
        fetch('/allTeachers', {
            method: 'GET',
        })
            .then(async (response) => {
                const usersJson = await response.json();
                if (response.ok) {
                    const list = usersJson.map((user) => {
                        return UserData.fromJson(user);
                    });
                    resolve(list);
                } else {
                    reject();
                }
            }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) });
    });
}
function getAllLessons(){
    return new Promise(async function (resolve, reject) {
        fetch('/allLessons', {
            method: 'GET',
        })
            .then(async (response) => {
                const lessonsJson = await response.json();
                if (response.ok) {
                    const list = lessonsJson.map((lesson) => {
                        return LessonsData.fromJson(lesson);
                    });
                    resolve(list);
                } else {
                    reject();
                }
            }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) });
    });
}
async function uploadFileClassrooms(file){
    return new Promise((resolve, reject) => {
        fetch("/uploadFileClassroom", {
            method: 'POST',
            headers: { 'Content-Type': 'multipart/form-data' },
            body: JSON.stringify({ file })
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            }
            else {
                response.json()
                    .then((obj) => { reject(obj); })
                    .catch((err) => {
                        reject(
                            { errors: [{ param: "Application", msg: "Cannot parse server response" }] })
                    });
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) });
    });
}
async function uploadFileCourses(file){
    return new Promise((resolve, reject) => {
        fetch("/uploadFileCourses", {
            method: 'POST',
            headers: { 'Content-Type': 'multipart/form-data' },
            body: JSON.stringify({ file })
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            }
            else {
                response.json()
                    .then((obj) => { reject(obj); })
                    .catch((err) => {
                        reject(
                            { errors: [{ param: "Application", msg: "Cannot parse server response" }] })
                    });
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) });
    });
}
async function uploadFileLessons(file){
    return new Promise((resolve, reject) => {
        fetch("/uploadFileLessons", {
            method: 'POST',
            headers: { 'Content-Type': 'multipart/form-data' },
            body: JSON.stringify({ file })
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            }
            else {
                response.json()
                    .then((obj) => { reject(obj); })
                    .catch((err) => {
                        reject(
                            { errors: [{ param: "Application", msg: "Cannot parse server response" }] })
                    });
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) });
    });
}
async function uploadFileStudents(file){
    return new Promise((resolve, reject) => {
        fetch("/uploadFileStudents", {
            method: 'POST',
            headers: { 'Content-Type': 'multipart/form-data' },
            body: JSON.stringify({ file })
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            }
            else {
                response.json()
                    .then((obj) => { reject(obj); })
                    .catch((err) => {
                        reject(
                            { errors: [{ param: "Application", msg: "Cannot parse server response" }] })
                    });
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) });
    });
}
async function uploadFileTeachers(file){
    return new Promise((resolve, reject) => {
        fetch("/uploadFileTeachers", {
            method: 'POST',
            headers: { 'Content-Type': 'multipart/form-data' },
            body: JSON.stringify({ file })
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            }
            else {
                response.json()
                    .then((obj) => { reject(obj); })
                    .catch((err) => {
                        reject(
                            { errors: [{ param: "Application", msg: "Cannot parse server response" }] })
                    });
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) });
    });
}
async function uploadFileEnrollment(file){
    return new Promise((resolve, reject) => {
        fetch("/uploadFileEnrollment", {
            method: 'POST',
            headers: { 'Content-Type': 'multipart/form-data' },
            body: JSON.stringify({ file })
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            }
            else {
                response.json()
                    .then((obj) => { reject(obj); })
                    .catch((err) => {
                        reject(
                            { errors: [{ param: "Application", msg: "Cannot parse server response" }] })
                    });
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) });
    });
}


async function login(username, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    };
    return new Promise(async function (resolve, reject) {
        try {
            const response = await fetch('/users/authenticate', requestOptions);
            //const user = await response.json().then(handleResponse);
            if (response.ok) {
                response.json().then((user) => {
                    resolve(user);
                });
            }
            else {
                response.json().then(errorObj => reject(errorObj.error));
            }
        }
        catch (e) {
            reject(e);
        }
    });
}
async function logout() {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    };
    return new Promise((resolve, reject) => {
        fetch('/logout', requestOptions).then((response) => {
            if (response.ok) {
                localStorage.removeItem('user');
                currentUserSubject.next(null);
                resolve(null);
            }
            else {
                response.json()
                    .then((obj) => { reject(obj); })
                    .catch((err) => { reject() });
            }
        });
    });
}

const API = {
    login, logout,
    getStudentCourses, getMyBookableLessons, getMyBookedLessons, getMyWaitingBookedLessons, bookLesson, deleteBooking,
    getMyCoursesLessons, getTeacherCourses, getBookedStudents, getStudentsData, makeLessonRemote, cancelLesson, isAuthenticated, setStudentAsPresent,
    createNewClassroom, createNewCourse, createNewUser, createNewLesson, editLesson,
    getAllClassrooms, getAllCourses, getAllStudents, getAllTeachers, getAllLessons,
    uploadFileClassrooms, uploadFileCourses, uploadFileLessons, uploadFileStudents, uploadFileTeachers, uploadFileEnrollment
};
export default API;