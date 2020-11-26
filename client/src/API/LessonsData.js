import moment from 'moment';

class LessonData {
    constructor(scheduleId, courseId, startingTime, endingTime, occupiedSeats, availableSeats, courseStatus, courseType) {
        if (scheduleId)
            this.scheduleId = scheduleId;
        this.courseId = courseId;
        this.startingTime = moment(new Date(startingTime));
        this.endingTime = moment(new Date(endingTime));
        this.occupiedSeats = occupiedSeats;
        this.availableSeats = availableSeats;
        this.courseStatus = courseStatus;
        this.courseType = courseType;
    }

    static fromJson(json) {
        const temp = Object.assign(new LessonData(), json);
        temp.startingTime = moment(new Date(temp.startingTime));
        temp.endingTime = moment(new Date(temp.endingTime));
        return temp;
    }
}

export default LessonData;