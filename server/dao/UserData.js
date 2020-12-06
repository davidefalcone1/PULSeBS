class UserData{
    constructor(id, personId, fullName, email) {
        if (id) 
            this.id = id;
        this.personId = personId;
        this.fullName = fullName;
        this.email = email;
    }

}

module.exports = UserData;