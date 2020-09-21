const { performQuery } = require('./Connector'),
      config = require('../../../config'),
      Semester = require('../entities/Semester'),
      Responser = require('../sendData/Responser'),
      ScheduledSubjectConnector = require('./ScheduledSubject.connector'),
      ConfigurationConnector = require('./Configuration.connector');

class SemesterConnector {

    /**
     * creates a new Semester record in the school DB.
     * @param {Number} key - the real key of the semester.
     * @param {String} userID - the system generated ID of the user to
     * which this semester belongs.
     * @returns {Promise<ScheduledSubjectConnector>}
     */
    static async createSemester(key, userID) {
        let semObj = new Semester(key, userID);

        let semesterCreationResult = await performQuery(
            config.database.mongodb.dbSchool,
            'semester',
            async collection => (
                await collection.insertOne(semObj)
            )
        );

        if(!semesterCreationResult.success) throw {
            error: 'The semester could not be created.',
            status: 500
        };
        
        let updateResult = await ConfigurationConnector.updateSelectedSemester(userID, semObj.semesterID);

        if(!updateResult.success) {
            console.log("We cannot put the configuration correctly");
        }

        return new ScheduledSubjectConnector({
            semesterID: semObj.semesterID
        });
    }

    /**
     *
     * @param {String} semesterID - the system generated ID of the wanted
     * semester.
     * @returns {Promise<Responser.Responser>}
     */
    static async getSemester(semesterID) {
        return await performQuery(
            config.database.mongodb.dbSchool,
            'semester',
            async collection => (
                await collection.findOne({semesterID: semesterID})
            )
        )
    }

    /**
     * 
     * @param {string} userID 
     */
    static async getAllSemestersForUser(userID) {
        return await performQuery(
            config.database.mongodb.dbSchool,
            'semester',
            async collection => (
                await new Promise((resolve, reject) => {
                    collection.find(
                        {userID: userID}
                    ).toArray(function(err, data) {
                        if(err) reject(err);
                        resolve(data);
                    })
                })
            )
        )
    }
}

module.exports = SemesterConnector;
