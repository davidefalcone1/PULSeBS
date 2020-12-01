import moment from 'moment';

class LessonData {
    constructor(scheduleId, courseId, startDate, endDate, occupiedSeats, availableSeats, isLessonCancelled, isLessonRemote) {
        if (scheduleId)
            this.scheduleId = scheduleId;
        this.courseId = courseId;
        this.startDate = moment(new Date(startDate));
        this.endDate = moment(new Date(endDate));
        this.occupiedSeats = occupiedSeats;
        this.availableSeats = availableSeats;
        this.isLessonCancelled = isLessonCancelled;
        this.isLessonRemote = isLessonRemote;
    }

    static fromJson(json) {
        const temp = Object.assign(new LessonData(), json);
        temp.startDate = moment(new Date(temp.startDate));
        temp.endDate = moment(new Date(temp.endDate));
        return temp;
    }
}

export default LessonData;