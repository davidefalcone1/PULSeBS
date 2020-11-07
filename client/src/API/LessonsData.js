import moment from 'moment';

class LessonData{
    constructor(id, course, professor, dateAndTime) {
        if (id) 
            this.id = id;
        this.course = course;
        this.professor = professor;
        this.dateAndTime = moment(new Date(dateAndTime));
      }

    static fromJson(json){
        const temp =  Object.assign(new LessonData(), json);
        temp.dateAndTime = moment(new Date(temp.dateAndTime));
        return temp;
    }
}

export default LessonData;