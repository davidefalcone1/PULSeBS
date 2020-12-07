import moment from 'moment';

class LessonData {
    constructor(scheduleId, courseId, startDate, endDate, occupiedSeats, availableSeats,
        isLessonCancelled, isLessonRemote, classroom
        /*, normalBookings, cancelledBookings, waitingBookings */) {
        if (scheduleId)
            this.scheduleId = scheduleId;
        this.courseId = courseId;
        this.startDate = moment(new Date(startDate));
        this.endDate = moment(new Date(endDate));
        this.occupiedSeats = occupiedSeats;
        this.availableSeats = availableSeats;
        this.isLessonCancelled = isLessonCancelled;
        this.isLessonRemote = isLessonRemote;
        this.classroom = classroom

        //TODO use the correct variables
        this.normalBookings = 0;
        this.cancelledBookings = 0;
        this.waitingBookings = 0;
    }

    static fromJson(json) {
        const temp = Object.assign(new LessonData(), json);
        temp.startDate = moment(new Date(temp.startDate));
        temp.endDate = moment(new Date(temp.endDate));
        return temp;
    }
}

export default LessonData;