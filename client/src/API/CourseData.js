//usata per la retrieve della lista dei corsi di un docente
class CourseData{
    constructor(courseId, courseName, teacherId
        /*, normalBookingsAvgWeek, cancelledBookingsAvgWeek, waitingBookingsAvgWeek */
        /*, normalBookingsAvgMonth, cancelledBookingsAvgMonth, waitingBookingsAvgMonth */) {
        if (courseId) 
            this.courseId = courseId;
        this.courseName = courseName;
        this.teacherId = teacherId;

        //TODO use the correct variables
        this.normalBookingsAvgWeek = 0;
        this.cancelledBookingsAvgWeek = 0;
        this.waitingBookingsAvgWeek = 0;
        this.normalBookingsAvgMonth = 0;
        this.cancelledBookingsAvgMonth = 0;
        this.waitingBookingsAvgMonth = 0;
        this.attendanceCountAvgWeek = 0;
        this.attendanceCountAvgMonth = 0;
    }

    static fromJson(json){
        const temp =  Object.assign(new CourseData(), json);
        return temp;
    }
}

export default CourseData;