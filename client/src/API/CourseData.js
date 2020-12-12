//usata per la retrieve della lista dei corsi di un docente
class CourseData{
    constructor(courseId, courseName, teacherId, 
        normalBookingsAvgWeek, cancelledBookingsAvgWeek, waitingBookingsAvgWeek, 
        normalBookingsAvgMonth, cancelledBookingsAvgMonth, waitingBookingsAvgMonth,
        attendanceCountAvgMonth, attendanceCountAvgWeek ) {
        if (courseId) 
            this.courseId = courseId;
        this.courseName = courseName;
        this.teacherId = teacherId;
        this.normalBookingsAvgWeek = normalBookingsAvgWeek;
        this.cancelledBookingsAvgWeek = cancelledBookingsAvgWeek;
        this.waitingBookingsAvgWeek = waitingBookingsAvgWeek;
        this.normalBookingsAvgMonth = normalBookingsAvgMonth;
        this.cancelledBookingsAvgMonth = cancelledBookingsAvgMonth;
        this.waitingBookingsAvgMonth = waitingBookingsAvgMonth;
        this.attendanceCountAvgWeek = attendanceCountAvgWeek;
        this.attendanceCountAvgMonth = attendanceCountAvgMonth;
    }

    static fromJson(json){
        const temp =  Object.assign(new CourseData(), json);
        return temp;
    }
}

export default CourseData;