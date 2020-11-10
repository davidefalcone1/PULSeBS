class User{    
    constructor(username, passwordHash, accessLevel) {
       
        this.username = username;
        this.passwordHash = passwordHash;
        this.accessLevel = accessLevel;
    }
}

module.exports = User;