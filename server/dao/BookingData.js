class BookingData {
    constructor(id, scheduleId, studentId, status, attended) {
        if (id)
            this.id = id;
        this.scheduleId = scheduleId;
        this.studentId = studentId;
        this.status = status;
        this.attended = attended;
    }

    static fromJson(json) {
        const temp = Object.assign(new BookingData(), json);
        return temp;
    }
}

module.exports = BookingData;