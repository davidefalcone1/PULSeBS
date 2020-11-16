class UserData{
    constructor(id, personId, fullName, email) {
        if (id) 
            this.id = id;
        this.personId = personId;
        this.fullName = fullName;
        this.email = email;
    }

    static fromJson(json){
        const temp =  Object.assign(new UserData(), json);
        return temp;
    }
}

export default UserData;