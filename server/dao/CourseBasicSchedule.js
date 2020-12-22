class CourseBasicSchedule{
    constructor(id, courseId, day, startTime, endTime, classroom) {
        this.id = id;
        this.courseId = courseId;
        this.day = day;
        this.startTime = startTime;
        this.endTime = endTime;
        this.classroom = classroom;
    }
}

module.exports = CourseBasicSchedule;