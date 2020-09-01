const { requestValidator } = require('../util/validator'),
      SubjectConnector = require('../models/connectors/Subject.connector'),
      CompleteModuleConnector = require('../models/connectors/complements/CompleteModule.connector');

exports.getSubject = [
    (req, res, next) => requestValidator(res, next, req.params, 'subjectID'),
    async (req, res) => {
        let { subjectID } = req.params;
        let result = await SubjectConnector.getSubject(subjectID);
        res.json(result);
    }
];

exports.getSubjectsBySemester = [
    (req, res, next) => requestValidator(res, next, req.params, 'semesterID'),
    async (req, res) => {
        let semesterID = parseInt(req.params.semesterID);
        let result = await SubjectConnector.getSubjectsBySemester(semesterID);
        res.json(result);
    }
];

exports.getModulesForSubject = [
    (req, res, next) => requestValidator(res, next, req.params, 'subjectID'),
    async (req, res) => {
        let {subjectID} = req.params;
        let result = await CompleteModuleConnector.getCompleteModulesForSubject(subjectID);
        res.json(result);
    }
];

