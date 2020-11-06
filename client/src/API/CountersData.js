class CountersData{
    constructor(COUNTER_ID) {
        if (COUNTER_ID) 
            this.COUNTER_ID = COUNTER_ID;
      }

    static fromJson(json){
        const temp =  Object.assign(new CountersData(), json);
        return temp;
    }
}

export default CountersData;