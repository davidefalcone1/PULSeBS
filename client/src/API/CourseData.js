//usata per la retrieve della lista dei corsi di un docente
class CourseData{
    constructor(courseId, courseName, teacherId) {
        if (courseId) 
            this.courseId = courseId;
        this.courseName = courseName;
        this.teacherId = teacherId;
    }

    static fromJson(json){
        const temp =  Object.assign(new CourseData(), json);
        return temp;
    }
}

export default CourseData;