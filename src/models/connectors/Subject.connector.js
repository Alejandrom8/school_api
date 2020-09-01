const { performQuery } = require('./Connector'),
      config = require('../../../config'),
      Responser = require('../sendData/Responser');


class SubjectConnector {

    /**
     * 
     * @param {String} subjectID - the system generated key for this subject.
     * @returns {Promise<Responser.Responser>} an object describing the proccess 
     * result.
     */
    static async getSubject(subjectID) {
        return await performQuery(
            config.database.mongodb.dbStaticData,
            'subject',
            async collection => (
                await collection.findOne({subjectID: subjectID})
            )
        )
    }

    /**
     * 
     * @param  {String[]} subjectIDs 
     * @returns {Promise<Responser.Responser>} an object describing the proccess 
     * result.
     */
    static async getManySubjects(subjectIDs) {

        let filters = subjectIDs.map(id => {
            return {subjectID: id}
        });

        return await performQuery(
            config.database.mongodb.dbStaticData,
            'subject',
            async collection => {
                return await new Promise((resolve, reject) => {
                    collection.find({
                        $or: filters
                    }).toArray( (err, data) => { 
                        if(err) reject(err);
                        resolve(data);
                    });
                });
            }
        )
    }

    /**
     * 
     * @param {Number} semesterID 
     * @returns {Promise<Responser.Responser>} an object describing the proccess 
     * result.
     */
    static async getSubjectsBySemester(semesterID) {
        return await performQuery(
            config.database.mongodb.dbStaticData,
            'subject',
            async collection => {
                return await new Promise((resolve, reject) => {
                    collection.find({ 
                        semesterID: semesterID
                    }).toArray(function(err, res){
                        if(err) reject(err);
                        resolve(res);
                    });
                });
            }
        )
    }
}

module.exports = SubjectConnector;