const { requestValidator } = require('../util/validator'),
      SemesterConnector = require('../models/connectors/Semester.connector'),
      SubjectConnector = require('../models/connectors/Subject.connector'),
      CompleteSubjectConnector = require('../models/connectors/complements/CompleteSubject.connector');

exports.getSemester = [
    (req, res, next) => requestValidator(res, next, req.params, 'semesterID'),
    (req, res) => {
        let { semesterID } = req.params;
        SemesterConnector
            .getSemester(semesterID)
            .then(result => res.json(result))
            .catch(error => console.log(error));
    }
];

exports.createSemester = [
    (req, res, next) => requestValidator(res, next, req.body, 'key', 'subjects'),
    (req, res) => {
        let { userID } = req, { key, subjects } = req.body;
        SemesterConnector
            .createSemester(key, userID)
            .then(ssc => ssc.createManyScheduledSubjects(subjects))
            .then(result => res.json(result))
            .catch(error => console.log(error));
    }
];

exports.getUserSemesters = ({userID}, res) => {
    SemesterConnector
        .getAllSemestersForUser(userID)
        .then(result => res.json(result))
        .catch(error => console.log(error));
};

exports.getSemesterSubjects = [
    (req, res, next) => requestValidator(res, next, req.params, 'semesterID'),
    (req, res) => {
        let { semesterID } = req.params;
        SubjectConnector
            .getSubjectsBySemester(semesterID)
            .then(result => res.json(result))
            .catch(error => console.log(error));
    }
];

exports.getCompleteSemesterSubjects = [
    (req, res, next) => requestValidator(res, next, req.params, 'semesterID'),
    (req, res) => {
        let { semesterID } = req.params;
        CompleteSubjectConnector
            .getCompleteSubjectsForSemester(semesterID)
            .then(result => res.json(result))
            .catch(error => console.log(error));
    }
];