class User {

    /**
     * @param {String} userID - the ID of this user. It's supoused ot be created
     * by a third part object.
     * @param {String} name - the first name of this user.
     * @param {String} lastName - the last name of this user.
     * @param {String} email - the email of this user.
     */
    constructor(userID, name, lastName, email) {
        this.userID = userID;
        this.name = name;
        this.lastName = lastName;
        this.email = email;
    }
}

module.exports = User;