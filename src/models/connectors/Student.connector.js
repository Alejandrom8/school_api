const { performQuery } = require('./Connector'),
      config = require('../../../config'),
      Student = require('../entities/Student'),
      ConfigurationConnector = require('./Configuration.connector');

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

        let result = await performQuery(
            config.database.mongodb.dbSchool,
            'student',
            async collection => (
                await collection.insertOne(studentObj)
            )
        )

        if(!result.success) throw {
            error: 'We cannot create the user correctly',
            status: 500
        };

        let configResult = await ConfigurationConnector.createGlobalConfig(this.userID);
        
        if(!configResult.success) throw {
            error: 'we cannot create the configuration for this user.',
            status: 500
        };
        
        return result;
    }

    /**
     * 
     * @param {string} userID 
     */
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