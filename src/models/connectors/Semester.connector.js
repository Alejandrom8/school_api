const { performQuery } = require('./Connector'),
      config = require('../../../config'),
      Semester = require('../entities/Semester'),
      CalificationsConnector = require('./Califications.connector'),
      Responser = require('../sendData/Responser'),
      ScheduledSubjectConnector = require('./ScheduledSubject.connector');

class SemesterConnector {

    /**
     * creates a new Semester record in the school DB.
     * @param {Number} key - the real key of the semester.
     * @param {String} userID - the system generated ID of the user to 
     * which this semester belongs.
     * @param {String[]} subjects - an array of subjectID's that belongs to
     * this semester.
     */
    static async createSemester(key, userID, subjects) {
        let semObj = new Semester(key, userID);
        let semesterCreationResult = await performQuery(
            config.database.mongodb.dbSchool,
            'semester',
            async collection => (
                await collection.insertOne(semObj)
            )
        );

        if(!semesterCreationResult.success) 
            throw 'The semester could not be created.';

        
        let newSubjects = subjects.map(s => {
            s.semesterID = semObj.semesterID;
            return s;
        });

        let subjectsResult = await ScheduledSubjectConnector.createManyScheduledSubjects(newSubjects);
        
        if(!subjectsResult.success) throw 'We cannot insert all the subjects';

        let califCreationResult = await CalificationsConnector.createCalifications(userID, semObj.semesterID);

        if(!califCreationResult.success) 
            throw 'The califications object could not be created.';
        
        return new Responser({
            success: true,
            messages: 'the semester was created with success'
        });
    }

    /**
     * 
     * @param {String} semesterID - the system generated ID of the wanted 
     * semester.
     */
    static async getSemester(userID, semesterID) {
        return await performQuery(
            config.database.mongodb.dbSchool,
            'semester',
            async collection => (
                await collection.findOne({userID: userID, semesterID: semesterID})
            )
        )
    }

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