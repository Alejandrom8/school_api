const ScheduledSubjectConnector = require('../ScheduledSubject.connector'),
      SubjectConnector = require('../Subject.connector'),
      CompleteSubject = require('../../entities/CompleteSubject');

      
class CompleteSubjectConnector {
    static async getCompleteSubject(scheduledSubjectID) {
        let sso = await ScheduledSubjectConnector.getScheduledSubject(scheduledSubjectID);
        if(!sso) throw 'the subject doesnt exists';
        let subject = await SubjectConnector.getSubject(sso.subjectID);
        if(!subject) throw 'We can not find a subject with that ID';
        let completeSubject = CompleteSubject.getInstance(subject, sso);
        return completeSubject;
    }

    static async getCompleteSubjectsForSemester(semesterID) {
        let scheduledSubjects = await ScheduledSubjectConnector.getScheduledSubjectsBySemester(semesterID);
        
        if(!scheduledSubjects.success) throw 'We cannot find the subjects for the given semester';
        let result = [];

        for(let ss of scheduledSubjects.data) {
            let subject = await SubjectConnector.getSubject(ss.subjectID);
            result.push(
                CompleteSubject.getInstance(
                    subject.data,
                    ss
                )
            );
        }

        return result;
    }
}

module.exports = CompleteSubjectConnector;