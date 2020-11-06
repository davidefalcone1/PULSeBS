class ServiceData{
    constructor(SERVICE_ID, NAME, SERVICE_TIME) {
        if (SERVICE_ID) 
            this.SERVICE_ID = SERVICE_ID;
        this.NAME = NAME;
        this.SERVICE_TIME = SERVICE_TIME;
      }

    static fromJson(json){
        const temp =  Object.assign(new ServiceData(), json);
        return temp;
    }
}

export default ServiceData;