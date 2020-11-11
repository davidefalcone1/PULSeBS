const nodemailer = require('nodemailer');


/* the info object needs the following properties:
notification type -> INTEGER from 1 to 5
course -> course NAME
date -> date the course is scheduled AS A STRING
start -> start time of the course AS A STRING
end -> end time of the course AS A STRNG

--IF THE NOTIFCATION TYPE IS 2
numStudents -> the number of students booked for the course AS AN INTEGER

--IF THE NOTIFCATION TYPE IS 5

oldDate -> old date the course was scheduled AS A STRING
oldStart -> old start time of the course AS A STRING
oldEnd -> old end time of the course AS A STRNG
newDate -> new date the course is scheduled AS A STRING
newStart -> new start time of the course AS A STRING
newEnd -> new end time of the course AS A STRNG

*/
const createMessage = (info) => {
    const emailFields = {
        subject: '',
        html: ''};

    if(!info || !info.notifcationType){
        return false;
    }

    switch(info.notifcationType) {
        case 1:
            if(!info.course || !info.date || !info.start || !info.end){
                return undefined;
            }
            emailFields.subject = 'BOOKING CONFIRMATION';
            emailFields.html = `<p>Your booking of the lecture of ${info.course} 
            scheduled for ${info.date} from ${info.start} to ${info.end} 
            has been <b>CONFIRMED<b>.</p>`;
            break;
        case 2:
            if(!info.course || !info.date || !info.start || !info.end || !info.numStudents){
                return undefined;
            }
            emailFields.subject = 'NUMBER OF STUDENTS FOR NEXT LECTURE';
            emailFields.html = `<p>Your next lecture of ${info.course} 
            scheduled for ${info.date} from ${info.start} to ${info.end} 
            has <b>${info.numStudents}</b> students booked.</p>`;
            break;
        case 3:
            if(!info.course || !info.date || !info.start || !info.end){
                return undefined;
            }
            emailFields.subject = 'LECTURE CANCELED';
            emailFields.html = `<p>Your lecture of ${info.course}, scheduled 
            for ${info.date} from ${info.start} to ${info.end} 
            has been <b>CANCELED</b>.</p>`;
            break;
        case 4:
            if(!info.course || !info.date || !info.start || !info.end){
                return undefined;
            }
            emailFields.subject = 'SEAT NOW AVAILABLE';
            emailFields.html = `<p>A seat for the lecture of ${info.course}, scheduled 
            for ${info.date} from ${info.start} to ${info.end} <b>is now available</b>, 
            so you are now booked and can attend the lecture</p>`;
            break;
        case 5:
            if(!info.course || !info.oldDate || !info.oldStart || !info.oldEnd || !info.newDate || !info.newStart || !info.newEnd){
                return undefined;
            }
            emailFields.subject = 'LECTURE RESCHEDULED';
            emailFields.html = `<p>Your lecture of ${info.course}, scheduled 
            for ${info.oldDate} from ${info.oldStart} to ${info.oldEnd} has been <b>RESCHEDULED</b> 
            for ${info.newDate} from ${info.newStart} to ${info.newEnd}</p>`;
            break;
        default:
            return undefined;
    }
    
    return emailFields;

} 

exports.sendNotification = (username, info) => {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'pulsebs2020@gmail.com',
          pass: 'gruppo-2-P'
        }
      });

      const emailFields = createMessage(info);
      if(!emailFields) {
          return false;
      }

      const mailOptions = {
        from: 'pulsebs2020@gmail.com',
        to: username,
        subject: emailFields.subject,
        html: emailFields.html
      };
      
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          return false;
        } else {
          console.log('Email sent: ' + info.response);
          return true;
        }
      });
}