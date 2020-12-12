//usata per la retrieve della lista dei corsi
class CourseData {
    constructor(courseId, courseName, teacherId,
        normalBookingsAvgWeek, cancelledBookingsAvgWeek, waitingBookingsAvgWeek,
        normalBookingsAvgMonth, cancelledBookingsAvgMonth, waitingBookingsAvgMonth,
        attendanceCountAvgMonth, attendanceCountAvgWeek) {
        if (courseId)
            this.courseId = courseId;
        this.courseName = courseName;
        this.teacherId = teacherId;
        this.normalBookingsAvgWeek = parseFloat(normalBookingsAvgWeek);
        this.cancelledBookingsAvgWeek = parseFloat(cancelledBookingsAvgWeek);
        this.waitingBookingsAvgWeek = parseFloat(waitingBookingsAvgWeek);
        this.normalBookingsAvgMonth = parseFloat(normalBookingsAvgMonth);
        this.cancelledBookingsAvgMonth = parseFloat(cancelledBookingsAvgMonth);
        this.waitingBookingsAvgMonth = parseFloat(waitingBookingsAvgMonth);
        this.attendanceCountAvgWeek = parseFloat(attendanceCountAvgWeek);
        this.attendanceCountAvgMonth = parseFloat(attendanceCountAvgMonth);
    }
}

module.exports = CourseData;