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
        .then((response) => {
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

async function getTickets() {
    let url = "/tickets";
    const response = await fetch(url);
    const ticketsJson = await response.json();
    if (response.ok) {
        return ticketsJson.ticketsList.map((t) => {
            return TicketData.fromJson(t);
        });
    } else {
        let err = { status: response.status, errObj: ticketsJson };
        throw err;
    }
}
async function getCountersIds() {
    let url = "/counters";
    const response = await fetch(url);
    const countersJson = await response.json();
    if (response.ok) {
        return countersJson.countersIdsList.map((c) => {
            return CountersData.fromJson(c);
        });
    } else {
        let err = { status: response.status, errObj: countersJson };
        throw err;
    }
}
async function addTicket(SERVICE_ID) {
    return new Promise((resolve, reject) => {
        fetch("/tickets", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "SERVICE_ID": SERVICE_ID }),
        }).then(async (response) => {
            if (response.ok) {
                var jsonResult = await response.json();
                resolve(`Your ticket number is ${jsonResult.ticketNumber}. There are ${jsonResult.queueLenght} before you.`);
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
async function callNextCustomer(COUNTER_ID) {
    const url = 'queue/' + COUNTER_ID;
    const response = await fetch(url);
    const ticketJson = await response.json();
    if (response.ok) {
        if (ticketJson === -1)
            return (`There is no one in the queue for this counter!`);
        return (`The next customer to be served has ticket number ${ticketJson.ticketNumber}`);
    }
    else {
        let err = { status: response.status, errObj: ticketJson };
        throw err;
    }
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

const API = { getLessons, getMyLessons, getTickets, getCountersIds, addTicket, callNextCustomer, login };
export default API;