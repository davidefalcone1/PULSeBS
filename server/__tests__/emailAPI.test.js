'use strict';
const emailAPI = require('../emailAPI');

describe('emailAPI', ()=>{
    it('booking confirmation', async (done)=>{
        expect.assertions(1);
        const email = 'stud270000@gmail.com';
        const info = {
            notificationType: 1,
            date: '2020-01-02',
            start: '14:00',
            end: '15:00',
            course: 'Software engineering 2'
        }
        const result = await emailAPI.sendNotification(email, info);
        expect(result).toBeTruthy();
        done();
    });
    it('number of student for next lecture', async (done)=>{
        expect.assertions(1);
        const email = 'stud270000@gmail.com';
        const info = {
            notificationType: 2,
            date: '2020-01-02',
            start: '14:00',
            end: '15:00',
            course: 'Software engineering 2',
            numStudents: 90
        }
        const result = await emailAPI.sendNotification(email, info);
        expect(result).toBeTruthy();
        done();
    });
    it('lecture cancelled', async (done)=>{
        expect.assertions(1);
        const email = 'stud270000@gmail.com';
        const info = {
            notificationType: 3,
            date: '2020-01-02',
            start: '14:00',
            end: '15:00',
            course: 'Software engineering 2'
        }
        const result = await emailAPI.sendNotification(email, info);
        expect(result).toBeTruthy();
        done();
    });
    it('waiting list', async (done)=>{
        expect.assertions(1);
        const email = 'stud270000@gmail.com';
        const info = {
            notificationType: 4,
            date: '2020-01-02',
            start: '14:00',
            end: '15:00',
            course: 'Software engineering 2'
        }
        const result = await emailAPI.sendNotification(email, info);
        expect(result).toBeTruthy();
        done();
    });
    it('lecture rescheduled', async (done)=>{
        expect.assertions(1);
        const email = 'stud270000@gmail.com';
        const info = {
            notificationType: 5,
            oldDate: '2020-01-02',
            oldStart: '14:00',
            oldEnd: '15:00',
            oldRoom: 'A1',
            newDate: '2020-01-03',
            newStart: '14:00',
            newEnd: '15:00',
            newRoom: 'A1',
            course: 'Software engineering 2'
        }
        const result = await emailAPI.sendNotification(email, info);
        expect(result).toBeTruthy();
        done();
    });
});