class User {
    constructor(userID, fullName, email, passwordHash, accessLevel, hasDoneTutorial) {

        this.personId = userID;
        this.fullName = fullName;
        this.email = email;
        this.passwordHash = passwordHash;
        this.accessLevel = accessLevel;
        this.hasDoneTutorial = Boolean(parseInt(hasDoneTutorial));
    }
}

module.exports = User;