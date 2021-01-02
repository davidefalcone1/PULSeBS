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
        this.normalBookings = parseFloat(normalBookings);
        this.cancelledBookings = parseFloat(cancelledBookings);
        this.waitingBookings = parseFloat(waitingBookings);
        this.attendanceCount = parseFloat(attendanceCount);
    }
}

module.exports = LessonsData;