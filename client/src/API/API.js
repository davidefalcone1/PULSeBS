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
function getStudentCourses(studentId) {
    return new Promise(async function (resolve, reject) {
        fetch('/studentCourses', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ studentId: studentId }),
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
function getMyBookableLessons(studentId) {
    return new Promise(async function (resolve, reject) {
        fetch('/myBookableLessons', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ studentId: studentId }),
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
function getMyBookedLessons(studentId) {
    return new Promise(async function (resolve, reject) {
        fetch('/myBookedLessons', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ studentId: studentId }),
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
async function bookLesson(lessonId, studentId) {
    return new Promise((resolve, reject) => {
        fetch("/bookLesson", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "lessonId": lessonId, "studentId": studentId }),
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
async function deleteBooking(bookingId) {
    return new Promise((resolve, reject) => {
        fetch("/deleteBooking/" + bookingId, {
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
function getTeacherCourses(teacherId) {
    return new Promise(async function (resolve, reject) {
        fetch('/teacherCourses', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ teacherId: teacherId }),
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
function getMyCoursesLessons(teacherId) {
    return new Promise(async function (resolve, reject) {
        fetch('/myCoursesLessons', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ teacherId: teacherId }),
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
function getBookedStudent(lessonsIds) { //so the course schedule id
    return new Promise(async function (resolve, reject) {
        fetch('/bookedStudents', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ lessonsIds: lessonsIds }),
        })
            .then(async (response) => {
                const bookedStudentsJson = await response.json();
                if (response.ok) {
                    const list = bookedStudentsJson.map((course) => {
                        return BookingData.fromJson(course);
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
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ studentsIds: studentsIds }),
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
            else
                reject();
        }
        catch (e) {
            reject();
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
    login, getStudentCourses, getMyBookableLessons, getMyBookedLessons, getMyCoursesLessons, bookLesson,
    deleteBooking, getTeacherCourses, getBookedStudent, getStudentsData, isAuthenticated
};
export default API;