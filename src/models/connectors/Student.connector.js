const { performQuery } = require('./Connector'),
      config = require('../../../config'),
      Student = require('../entities/Student');

class StudentConnector {
    /**
     * 
     * @param {String} userID 
     * @param {String} email 
     */
    constructor(userID, email) {
        this.userID = userID;
        this.email = email;
    }

    /**
     * 
     * @param {String} name - the first name of this student.
     * @param {String} lastName - the last name of this student.
     * @param {String} university - the university name to wich this student
     * belongs.
     * @param {String} career - the career name to wich this student belongs.
     */
    async signUp(name, lastName, university, career) {
        let studentObj = new Student(
            this.userID,
            name,
            lastName,
            this.email,
            university,
            career
        );

        return await performQuery(
            config.database.mongodb.dbSchool,
            'student',
            async collection => (
                await collection.insertOne(studentObj)
            )
        )
    }

    static async getStudent(userID) {
        return await performQuery(
            config.database.mongodb.dbSchool,
            'student',
            async collection => (
                await collection.findOne({userID: userID})
            )
        )
    }
}

module.exports = StudentConnector;