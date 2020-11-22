'use strict';

const cron = require('node-cron');
const emailDao = require('./dao/emailDao');
const emailAPI = require('./emailAPI');

exports.setDailyMail = async () => {
    cron.schedule('00 23 * * *', async() => {

        try{
            const professors = await emailDao.getProfessorsToNotify();
            for(let i = 0; i < professors.length; i++){
                const{email, ...info} = professors[i];
                info.notificationType = 2;
                const response = await emailAPI.sendNotification(email, info);
                if(!response){
                    console.log('Automatic email sending failed, thecause is the following error')
                }
            }
        }
        catch(error){
            console.log('Automatic email sending failed, thecause is the following error:');
            console.log(error);
    
    });

}
