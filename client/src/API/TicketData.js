class TicketData{
    constructor(TICKET_ID, TICKET_NUMBER, SERVICE_ID, COUNTER_ID, STATUS, DATE) {
        if (TICKET_ID) 
            this.TICKET_ID = TICKET_ID;
        this.TICKET_NUMBER = TICKET_NUMBER;
        this.SERVICE_ID = SERVICE_ID;
        this.COUNTER_ID = COUNTER_ID;
        this.STATUS = STATUS;
        this.DATE = DATE;
    }     

    static fromJson(json){
        const temp =  Object.assign(new TicketData(), json);
        return temp;
    }
}

export default TicketData;