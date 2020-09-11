const { performQuery } = require('./Connector'),
      config = require('../../../config'),
      ScheduledSubject = require('../entities/ScheduledSubject'),
      Responser = require('../sendData/Responser'),
      ModuleConnector = require('./Module.connector');

const performQuerySS = async dooer => {
    return await performQuery(
        config.database.mongodb.dbSchool,
        'scheduledSubject',
        dooer
    );
};

class ScheduledSubjectConnector {

    constructor({semesterID}) {
        this.semesterId = semesterID;
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

    async createManyScheduledSubjects(scheduledSubjects) {
        if(!scheduledSubjects || !scheduledSubjects.length)
            throw 'scheduled subjects is empty';

        for(let sso of scheduledSubjects) {
            let result = await performQuerySS(
                async collection => {
                    await collection.insertOne(new ScheduledSubject(
                        this.semesterID,
                        sso.subjectID,
                        sso.profesorName,
                        sso.color,
                        sso.schedules
                    ))
                }
            );

            if(!result.success) {
                throw `We have a problem when insterting scheduledSubject: Error: ${result.errors}`;
            }
        }
        let results = await Promise.all(scheduledSubjects.map(sso => {
            return performQuerySS(
                async collection => {
                    await collection.insertOne(new ScheduledSubject(
                        this.semesterID,
                        sso.subjectID,
                        sso.profesorName,
                        sso.color,
                        sso.schedules
                    ))
                }
            );
        }));

        let errorIndex = null;

        if(results.some((r, i) => (
            !r.success ? errorIndex = i && true : false
        ))) {
            throw `We have a problem when insterting scheduledSubject: ${results[errorIndex].errors}`;
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
     * @param {String} scheduledSubjectID
     * @param {Number} calif
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

    static async autoUpdateSubjectCalif(scheduledSubjectID) {
        let subject = await ScheduledSubjectConnector
                                    .getScheduledSubject(scheduledSubjectID);
        if(!subject.success) throw 'This subject doesnt exists';
        let {ponderations} = subject.data.califications;
        let subjectCalif = ponderations.reduce((act, crt) => {
            return act + crt.calif
        }, 0) / 10;
        return await ScheduledSubjectConnector
                        .updateSubjectCalif(scheduledSubjectID, subjectCalif);
    }

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
        await ScheduledSubjectConnector
                    .autoUpdateSubjectCalif(scheduledSubjectID);
        return result;
    }

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
