import LessonsData from './LessonsData';
import TicketData from './TicketData';
import CountersData from './CountersData';

function getLessons() {
    return new Promise(async function (resolve, reject) {
        const url = "/lessons";
        const response = await fetch(url);
        const lessonsJson = await response.json();
        if (response.ok) {
            const list = lessonsJson.map((lesson) => {
                return LessonsData.fromJson(lesson);
            });
            resolve(list);
        } else {
            reject();
        }
    });
}
function getMyLessons(email) {
    return new Promise(async function (resolve, reject) {
        fetch('/myLessons', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email: email}),
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
        fetch("/tickets", {
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
async function deleteBooking(bookingId){
    return new Promise((resolve, reject) => {
        fetch("/deleteBooking/" + rentalID, {
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
function login(username, password) {
    return new Promise(async function (resolve, reject) {
        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            const user = await response.json();
            if (response.ok) {
                resolve(user);
            }
            else
                reject();
        }
        catch (e) {
            reject();
        }
    });
}

const API = { getLessons, getMyLessons, bookLesson, deleteBooking, login };
export default API;