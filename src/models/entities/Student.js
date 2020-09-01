const User = require('./User');

class Student extends User {
    /**
     * 
     * @param {String} name - the first name of this student.
     * @param {String} lastName - the last name of this student.
     * @param {String} email - thie email of this student.
     * @param {String} university - the university name to wich this student
     * belongs.
     * @param {String} career - the career name to wich this student belongs.
     */
    constructor(userID, name, lastName, email, university, career) {
        super(userID, name, lastName, email);
        this.university = university;
        this.career = career;
    }
}

module.exports = Student;