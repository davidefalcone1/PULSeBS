class User {
    constructor(userID, fullName, username, passwordHash, accessLevel, hasDoneTutorial) {

        this.userID = userID;
        this.fullName = fullName;
        this.username = username;
        this.passwordHash = passwordHash;
        this.accessLevel = accessLevel;
        this.hasDoneTutorial = Boolean(parseInt(hasDoneTutorial));
    }
}

module.exports = User;