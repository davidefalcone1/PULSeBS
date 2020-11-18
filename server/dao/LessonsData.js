class LessonsData{
    constructor(scheduleId, courseId, startingTime, endingTime, occupiedSeats, availableSeats) {
        if (scheduleId) 
            this.scheduleId = scheduleId;
        this.courseId = courseId;
        this.startingTime = startingTime;
        this.endingTime = endingTime;
        this.occupiedSeats = occupiedSeats;
        this.availableSeats = availableSeats;
      }

    static fromJson(json){
        const temp =  Object.assign(new LessonData(), json);
        return temp;
    }
}

module.exports = LessonsData;