class User{    
    constructor(userID,fullName, username, passwordHash, accessLevel) {
        
        this.userID = userID;
        this.fullName = fullName;
        this.username = username;
        this.passwordHash = passwordHash;
        this.accessLevel = accessLevel;
    }
}

module.exports = User;