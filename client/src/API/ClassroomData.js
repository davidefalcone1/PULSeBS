class ClassroomData{
    constructor(id, classroomName, maxSeats) {
        this.classId = id;
        this.classroomName = classroomName;
        this.maxSeats = maxSeats;
    }

    static fromJson(json){
        const temp =  Object.assign(new ClassroomData(), json);
        return temp;
    }
}

export default ClassroomData;