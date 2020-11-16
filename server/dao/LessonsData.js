const moment = require('moment');

exports.LessonData = class LessonsData{
    constructor(id, courseId, startingTime, endingTime, occupiedSeats, availableSeats, classroom) {
        if (id) 
            this.id = id;
        this.courseId = courseId;
        this.startingTime = moment(new Date(startingTime));
        this.endingTime = moment(new Date(endingTime));
        this.occupiedSeats = occupiedSeats;
        this.availableSeats = availableSeats;
        this.classroom = classroom
      }

    static fromJson(json){
        const temp =  Object.assign(new LessonData(), json);
        temp.startingTime = moment(new Date(temp.startingTime));
        temp.endingTime = moment(new Date(temp.endingTime));
        return temp;
    }
}