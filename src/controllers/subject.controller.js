const { requestValidator } = require('../util/validator'),
      SubjectConnector = require('../models/connectors/Subject.connector'),
      CompleteModuleConnector = require('../models/connectors/complements/CompleteModule.connector');


exports.getSubject = [
    (req, res, next) => requestValidator(res, next, req.params, 'subjectID'),
    function (req, res) {
        let { subjectID } = req.params;

        SubjectConnector
            .getSubject(subjectID)
            .then(result => res.json(result))
            .catch(error => console.log(error));
    }
];

exports.getSubjectsBySemester = [
    (req, res, next) => requestValidator(res, next, req.params, 'semesterID'),
    function (req, res) {
        let semesterID = parseInt(req.params.semesterID);

        SubjectConnector
            .getSubjectsBySemester(semesterID)
            .then(result => res.json(result))
            .catch(error => console.log(error));
    }
];

exports.getModulesForSubject = [
    (req, res, next) => requestValidator(res, next, req.params, 'subjectID'),
    function (req, res) {
        let {subjectID} = req.params;
        
        CompleteModuleConnector
            .getCompleteModulesForSubject(subjectID)
            .then(result => res.json(result))
            .catch(error => console.log(error));
    }
];

