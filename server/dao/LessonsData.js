const moment = require('moment');

class LessonsData {
    constructor(scheduleId, courseId, startDate, endDate, occupiedSeats, availableSeats,
        isLessonCancelled, isLessonRemote, classroom, normalBookings, cancelledBookings, waitingBookings, attendanceCount) {

        if (scheduleId)
            this.scheduleId = scheduleId;
        this.courseId = courseId;
        this.startDate = moment(new Date(startDate));
        this.endDate = moment(new Date(endDate));
        this.occupiedSeats = occupiedSeats;
        this.availableSeats = availableSeats;
        this.isLessonCancelled = !Boolean(parseInt(isLessonCancelled));
        this.isLessonRemote = !Boolean(parseInt(isLessonRemote));
        this.classroom = classroom;
        this.normalBookings = normalBookings;
        this.cancelledBookings = cancelledBookings;
        this.waitingBookings = waitingBookings;
        this.attendanceCount = attendanceCount;
    }

    static fromJson(json) {
        const temp = Object.assign(new LessonData(), json);
        temp.startDate = moment(new Date(temp.startDate));
        temp.endDate = moment(new Date(temp.endDate));
        return temp;
    }
}

module.exports = LessonsData;