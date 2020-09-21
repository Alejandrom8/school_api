const ScheduledSubjectConnector = require('../ScheduledSubject.connector'),
      SubjectConnector = require('../Subject.connector'),
      CompleteSubject = require('../../entities/CompleteSubject'),
      ScheduledSubject = require('../../entities/ScheduledSubject'),
      Subject = require('../../entities/FCA/Subject'),
      {performQuery} = require('../Connector'),
      config = require('../../../../config'),
      ConfigurationConnector = require('../Configuration.connector');

      
class CompleteSubjectConnector {
    
    static async getCompleteSubject(scheduledSubjectID) {
        let sso = await ScheduledSubjectConnector.getScheduledSubject(scheduledSubjectID);
        if(!sso.success) throw 'the subject doesnt exists';

        let completeSubject;

        if(!sso.data.subjectID){
            completeSubject = sso.data;
        }else{
            let subject = await SubjectConnector.getSubject(sso.data.subjectID);
            if(!subject.success) throw 'We can not find a subject with that ID';
            completeSubject = CompleteSubject.getInstance(subject.data, sso.data);
        }

        return completeSubject;
    }

    static async getSubjectAndConfig(scheduledSubjectID) {
        let result = {};
        result.data = await CompleteSubjectConnector.getCompleteSubject(scheduledSubjectID);
        result.config = await ConfigurationConnector.getConfiguration({scheduledSubjectID});
        return result;
    }

    static async getSubjectAndConfigForSemester(semesterID) {
        let subjects = await performQuery(
            config.database.mongodb.dbSchool,
            'scheduledSubject',
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
        if(!subjects.success) throw {
            status: 404,
            error: 'no subjects for indicated semester'
        }
        subjects = await Promise.all(subjects.data.map(async s => {
            let result = {};
            result.scheduledSubjectID = s.scheduledSubjectID;
            result.data = s;
            let cfr = await ConfigurationConnector.getConfiguration({scheduledSubjectID: s.scheduledSubjectID})
            result.config = cfr.data;
            return result;
        }));
        return subjects;
    }

    static async getCompleteSubjectsForSemester(semesterID) {
        let scheduledSubjects = await performQuery(
            config.database.mongodb.dbSchool,
            'scheduledSubject',
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

        if(!scheduledSubjects.success) throw {
            error: 'We cannot find the subjects for the given semester',
            status: 404
        };
        let result = [];

        for(let ss of scheduledSubjects.data) {
            if(!ss.subjectID) {
                result.push(ss);
            }else{
                let subject = await SubjectConnector.getSubject(ss.subjectID);
                result.push(
                    CompleteSubject.getInstance(
                        subject.data,
                        ss
                    )
                );
            }
        }

        return result;
    }

    static async createCompleteSubject({
        semesterID, //the scheduledSubject semesterID
        subjectID = '', //subject
        name = '', // subject
        key = {}, //subject
        planDeTrabajoURL = '', //subject 
        apunteURL = '', //subject
        actividadesURL = '', //subject
        professorName, //scheduledSubject
        color, //scheduledSubject
        schedules, //scheduledSubject
        califications = { //scheduledSubject
            subjectCalif: 0, 
            ponderations: []
        }
    }) {
        let subjectData;

        if(subjectID) { //subject exists and scheduledSubject will be created starting with existing data
            let result = await SubjectConnector.getSubject(subjectID);
            if(!result.success) return result;

            subjectData = result.data;
            subjectData = CompleteSubject.getInstance(
                subjectData,
                new ScheduledSubject(
                    semesterID,
                    subjectID,
                    professorName,
                    color,
                    schedules,
                    califications
                ) 
            );
        }else{
            let so = new Subject(semesterID, name, key, planDeTrabajoURL, apunteURL, actividadesURL);
            let sso =  new ScheduledSubject(
                semesterID,
                subjectID,
                professorName,
                color,
                schedules,
                califications
            );
            subjectData = CompleteSubject.getInstance(so, sso);
        }

        let subjectResult = await performQuery(
            config.database.mongodb.dbSchool,
            'scheduledSubject',
            async collection => (
                await collection.insertOne(subjectData)
            )
        )

        if(!subjectResult.success) throw {
            error: 'We cannot create the subject',
            status: 500
        }

        let {success: configSuccess} = await ConfigurationConnector.createSubjectConfig(
            semesterID, 
            subjectData.scheduledSubjectID
        );

        if(!configSuccess) throw {
            error: 'We cannot create the subject configuration',
            status: 500
        }

        return subjectResult;
    }


}

module.exports = CompleteSubjectConnector;