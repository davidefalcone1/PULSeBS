import LessonsData from './LessonsData';
import CourseData from './CourseData';
import UserData from './UserData';
import BookingData from './BookingData';
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
                resolve(`Your lesson has been correctly booked.`);
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
            body: JSON.stringify({lessonsIds}),
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
function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if ([401, 403].indexOf(response.status) !== -1) {
                // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
                authenticationService.logout();
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
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
    login, logout, getStudentCourses, getMyBookableLessons, getMyBookedLessons, getMyCoursesLessons, bookLesson,
    deleteBooking, getTeacherCourses, getBookedStudents, getStudentsData, isAuthenticated
};
export default API;