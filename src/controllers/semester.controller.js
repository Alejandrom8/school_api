const { requestValidator } = require('../util/validator'),
      SemesterConnector = require('../models/connectors/Semester.connector'),
      SubjectConnector = require('../models/connectors/Subject.connector'),
      CompleteSubjectConnector = require('../models/connectors/complements/CompleteSubject.connector'),
      CalificationsConnector = require('../models/connectors/Califications.connector');

exports.getSemester = [
    (req, res, next) => requestValidator(res, next, req.params, 'semesterID'),
    async (req, res) => {
        let { semesterID } = req.params;
        let result = await SemesterConnector.getSemester(semesterID);
        res.json(result);
    }
];

exports.createSemester = [
    (req, res, next) => requestValidator(res, next, req.body, 'key', 'subjects'),
    async (req, res) => {
        let { userID } = req;
        let { key, subjects } = req.body;
        let result = await SemesterConnector.createSemester(key, userID, subjects);
        
        res.json(result);
    }
];

exports.getUserSemesters = async (req, res) => {
    let {userID} = req;
    let result = await SemesterConnector.getAllSemestersForUser(userID);
    res.json(result);
};

exports.getSemesterSubjects = [
    (req, res, next) => requestValidator(res, next, req.params, 'semesterID'),
    async (req, res) => {
        let { semesterID } = req.params;
        let result = await SubjectConnector.getSubjectsBySemester(semesterID);
        res.json(result);
    }
];

exports.getCompleteSemesterSubjects = [
    (req, res, next) => requestValidator(res, next, req.params, 'semesterID'),
    async (req, res) => {
        let { semesterID } = req.params;
        let result = await CompleteSubjectConnector.getCompleteSubjectsForSemester(semesterID);
        res.json(result);
    }
];

exports.getCalifications = [
    (req, res, next) => requestValidator(res, next, req.params, 'semesterID'),
    async (req, res) => {
        let {semesterID} = req.params;
        let result = await CalificationsConnector.getCalificationsForSemester(semesterID);
        res.json(result);
    }
]