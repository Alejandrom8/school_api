const { performQuery } = require('./Connector'),
      config = require('../../../config'),
      Califications = require('../entities/Califications');

class CalificationsConnector {

    static async getCalifications(califID) {
        return await performQuery(
            config.database.mongodb.dbSchool,
            'califications',
            async collection => (
                await collection.findOne({califID: califID})
            )   
        )
    }

    static async getCalificationsForSemester(semesterID) {
        return await performQuery(
            config.database.mongodb.dbSchool,
            'califications',
            async collection => (
                await collection.findOne({semesterID: semesterID})
            )
        )
    }

    static async createCalifications(userID, semesterID) {
        let califObject = new Califications(userID, semesterID);
        return await performQuery(
            config.database.mongodb.dbSchool,
            'califications',
            async collection => (
                await collection.insertOne(califObject)
            )
        )
    }
}

module.exports = CalificationsConnector;