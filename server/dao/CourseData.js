//usata per la retrieve della lista dei corsi
class CourseData{
    constructor(courseId, courseName, teacherId) {
        if (courseId) 
            this.courseId = courseId;
        this.courseName = courseName;
        this.teacherId = teacherId;
    }
}

module.exports = CourseData;