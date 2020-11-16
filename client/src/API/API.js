import LessonsData from './LessonsData';
import CourseData from './CourseData';
import UserData from './UserData';
import BookingData from './BookingData';

//student
function getStudentCourses(studentId) {
    return new Promise(async function (resolve, reject) {
        fetch('/studentCourses', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({studentId: studentId}),
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
            body: JSON.stringify({studentId: studentId}),
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
            body: JSON.stringify({studentId: studentId}),
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
            body: JSON.stringify({ "lessonId": lessonId, "studentId": studentId}),
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
async function deleteBooking(bookingId){
    return new Promise((resolve, reject) => {
        fetch("/deleteBooking/" + bookingId, {
            method: 'DELETE'
        }).then( (response) => {
            if(response.ok) {
                resolve(null);
            } else {
                response.json()
                .then( (obj) => {reject(obj);} )
                .catch( (err) => {reject(
                    { errors: [{ param: "Application", msg: "Cannot parse server response" }] }) 
                });
            }
        }).catch( (err) => {reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) });
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
            body: JSON.stringify({teacherId: teacherId}),
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
            body: JSON.stringify({teacherId: teacherId}),
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
            body: JSON.stringify({lessonsIds: lessonsIds}),
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
            body: JSON.stringify({studentsIds: studentsIds}),
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


//common
function login(username, password) {
    return new Promise(async function (resolve, reject) {
        fetch('/teacherCourses', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({teacherId: teacherId}),
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
            body: JSON.stringify({teacherId: teacherId}),
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
            body: JSON.stringify({lessonsIds: lessonsIds}),
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
            body: JSON.stringify({studentsIds: studentsIds}),
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

const API = { login, getStudentCourses, getMyBookableLessons, getMyBookedLessons, getMyCoursesLessons, bookLesson, 
    deleteBooking, getTeacherCourses, getBookedStudent, getStudentsData };
export default API;