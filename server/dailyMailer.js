'use strict';

const cron = require('node-cron');
const emailDao = require('./dao/emailDao');
const emailAPI = require('./emailAPI');

exports.setDailyMail = () => {
    cron.schedule('0 23 * * *', () => {

        emailDao.getProfessorsToNotify()
            .then((professors) => {
                professors.forEach((professor) => {
                    const {email, ...info} = professor;
                    info.notificationType = 2;
                    emailAPI.sendNotification(email, info)
                    .then();
                })
                
            })
            .catch((error) => {
                console.log('Automatic email sending failed, thecause is the following error:');
                console.log(error);
            })
    
    });

}
