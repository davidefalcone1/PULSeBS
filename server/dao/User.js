class User{    
    constructor(userID, username, passwordHash, accessLevel) {
        
        this.userID = userID;
        this.username = username;
        this.passwordHash = passwordHash;
        this.accessLevel = accessLevel;
    }
}

module.exports = User;