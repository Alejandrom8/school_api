const { performQuery } = require('./Connector'),
      config = require('../../../config'),
      ScheduledSubject = require('../entities/ScheduledSubject'),
      Responser = require('../sendData/Responser'),
      ModuleConnector = require('./Module.connector'),
      CompleteSubjectConnector = require('./complements/CompleteSubject.connector');

const performQuerySS = async dooer => {
    return await performQuery(
        config.database.mongodb.dbSchool,
        'scheduledSubject',
        dooer
    );
};

class ScheduledSubjectConnector {

    constructor({semesterID}) {
        this.semesterID = semesterID;
    }

    /**
     *
     * @param {String} subjectID - the system generated key for this subject.
     * @returns {Promise<Responser.Responser>} an object describing the proccess
     * result.
     */
    static async getScheduledSubject(scheduledSubjectID) {
        return await performQuerySS(
            async collection => (
                await collection.findOne(
                    {scheduledSubjectID: scheduledSubjectID}
                )
            )
        )
    }

    static async updateElement(scheduledSubjectID, elementName, elementValue) {
        switch(elementName) {
            case 'professorName':
                return await ScheduledSubjectConnector.updateProfessor(scheduledSubjectID, elementValue);
            case 'subjectCalif':
                return await ScheduledSubjectConnector.updateSubjectCalif(scheduledSubjectID, elementValue);
            case 'ponderations':
                return await ScheduledSubjectConnector.addPonderation(scheduledSubjectID, elementValue);
            default:
                throw {
                    status: 405,
                    error: 'Trying to modify a static or not existing element'
                }
        }
    }

    /**
     * 
     * @param {string} subjectID 
     */
    static async getActivitiesForSubject(subjectID) {
        let moduleIDs = await ModuleConnector.getSubjectModules(subjectID);

        if(!moduleIDs.success || !moduleIDs.data)
            throw 'we cannot find any module for this subject';

        moduleIDs = moduleIDs.data.map(mdle => {moduleID: mdle.moduleID});

        return await performQuery(
            config.database.mongodb.dbStaticData,
            'activity',
            async collection => (
                await new Promise((resolve, reject) => {
                    collection.find({
                        $or: moduleIDs
                    }).toArray((error, data) => {
                        if(error) reject(error);
                        resolve(data);
                    })
                })
            )
        )
    }

    /**
     * 
     * @param {string} semesterID 
     * @param {string} subjectID 
     * @param {string} profesorName 
     * @param {string} color 
     * @param {object[]} schedules 
     */
    static async createScheduledSubject(
        semesterID,
        subjectID,
        profesorName,
        color,
        schedules
    ) {
        let sso = new ScheduledSubject(
            semesterID,
            subjectID,
            profesorName,
            color,
            schedules
        );

        return await performQuerySS(
            async collection => (
                await collection.insertOne(sso)
            )
        )
    }

    /**
     * 
     * @param {object[]} scheduledSubjects 
     */
    async createManyScheduledSubjects(scheduledSubjects) {
        if(!scheduledSubjects || !scheduledSubjects.length) throw {
            error: 'scheduled subjects is empty',
            status: 422
        };

        for (let sso of scheduledSubjects) {
            sso.semesterID = this.semesterID;
            let result = await CompleteSubjectConnector.createCompleteSubject(sso);
            if(!result.success) throw {
                error: `We have a problem when insterting scheduledSubject: Error: ${result.errors}`,
                status: 500
            }
        }

        return new Responser({
            success: true,
            messages: 'All the scheduledSubjects has been registered well',
        })
    }

    /**
     *
     * @param {Number} semesterID
     * @returns {Promise<Responser.Responser>} an object describing the proccess
     * result.
     */
    static async getScheduledSubjectsBySemester(semesterID) {
        return await performQuerySS(
            async collection => (
                await new Promise((resolve, reject) => {
                    collection.find({
                        semesterID: semesterID
                    }).toArray(function(err, res){
                        if(err) reject(err);
                        resolve(res);
                    });
                })
            )
        )
    }

    /**
     *
     * @param {string} scheduledSubjectID
     * @param {number} calif
     */
    static async updateSubjectCalif(scheduledSubjectID, calif) {
        return await performQuerySS(
            async collection => (
                await collection.updateOne(
                    { scheduledSubjectID: scheduledSubjectID },
                    { $set: { "califications.subjectCalif": calif } }
                )
            )
        );
    }

    /**
     * 
     * @param {string} scheduledSubjectID
     */
    static async autoUpdateSubjectCalif(scheduledSubjectID) {
        let subject = await ScheduledSubjectConnector.getScheduledSubject(scheduledSubjectID);
        if(!subject.success) throw 'This subject doesnt exists';
        let {ponderations} = subject.data.califications;
        let subjectCalif = ponderations.reduce((act, crt) => {
            return act + crt.calif
        }, 0) / 10;
        return await ScheduledSubjectConnector.updateSubjectCalif(scheduledSubjectID, subjectCalif);
    }

    /**
     * 
     * @param {string} scheduledSubjectID 
     * @param {object} param1
     * @param {string} param1.name
     * @param {number} param1.weight
     * @param {number} param1.calif
     */
    static async addPonderation(scheduledSubjectID, {name, weight, calif}) {
        const ponderation = {name, weight, calif};
        const result = await performQuerySS(
            async collection => (
                collection.updateOne(
                    {scheduledSubjectID},
                    {$addToSet: { "califications.ponderations": ponderation}}
                )
            )
        )
        await ScheduledSubjectConnector.autoUpdateSubjectCalif(scheduledSubjectID);
        return result;
    }

    /**
     * 
     * @param {string} scheduledSubjectID 
     * @param {string} professorName 
     */
    static async updateProfessor(scheduledSubjectID, professorName) {
        return await performQuerySS(
            async collection => (
                await collection.updateOne(
                    {scheduledSubjectID},
                    {$set: {professorName}}
                )
            )
        )
    }
}

module.exports = ScheduledSubjectConnector;
