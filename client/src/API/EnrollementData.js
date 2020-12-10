class EnrollmentData{
    constructor(studentId, courseId) {
        this.studentId = studentId;
        this.courseId = courseId;
    }

    static fromJson(json){
        const temp =  Object.assign(new EnrollmentData(), json);
        return temp;
    }
}

export default EnrollmentData;