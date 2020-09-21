const { requestValidator } = require('../util/validator'),
      ScheduledSubjectConnector = require('../models/connectors/ScheduledSubject.connector'),
      CompleteSubjectConnector = require('../models/connectors/complements/CompleteSubject.connector');

exports.getCompleteSubject = [
    (req, res, next) => requestValidator(
        res,
        next,
        req.params,
        'scheduledSubjectID'
    ),
    function (req, res) {
        let { scheduledSubjectID } = req.params;

        CompleteSubjectConnector
            .getCompleteSubject(scheduledSubjectID)
            .then(result => res.json(result))
            .catch(error => console.log(error));
    }
];

exports.updateSubject = [
    (req, res, next) => requestValidator(
        res, 
        next, 
        {...req.body, ...req.params},
        'scheduledSubjectID', 'elementName', 'elementValue'
    ),
    function (req, res) {
        let {scheduledSubjectID} = req.params;
        let {elementName, elementValue} = req.body;

        ScheduledSubjectConnector
            .updateElement(scheduledSubjectID, elementName, elementValue)
            .then(result => {
                res.status(200).json(result);
            })
            .catch(({status, error}) => {
                res.status(status).json({success: false, errors: error});
            })
    }
]

exports.getCompleteSubjectsForSemester = [
    (req, res, next) => requestValidator(res, next, req.params, 'semesterID'),
    function (req, res) {
        let { semesterID } = req.params;

        CompleteSubjectConnector
            .getCompleteSubjectsForSemester(semesterID)
            .then(result => res.json(result))
            .catch(error => console.log(error));
    }
];

exports.updateSubjectCalif = [
    (req, res, next) => requestValidator(
        res,
        next,
        {...req.params, ...req.body},
        'scheduledSubjectID', 'calif'
    ),
    function (req, res) {
        let { scheduledSubjectID, calif } = {...req.params, ...req.body};

        ScheduledSubjectConnector
            .updateSubjectCalif(scheduledSubjectID, calif)
            .then(result => res.json(result))
            .catch(error => console.log(error));
    }
];

exports.updatePonderations = [
    (req, res, next) => requestValidator(
        res,
        next,
        {...req.params, ...req.body},
        'scheduledSubjectID', 'ponderation'
    ),
    function (req, res) {
        let { scheduledSubjectID, ponderation } = {...req.params, ...req.body};

        ScheduledSubjectConnector
            .addPonderation(scheduledSubjectID, ponderation)
            .then(result => res.json(result))
            .catch(error => console.log(error));
    }
];

exports.updateProfessor = [
    (req, res, next) => requestValidator(res, next, req.body, 'professorName'),
    function (req, res) {
        let { professorName } = req.body;

        ScheduledSubjectConnector
            .updateProfessor(professorName)
            .then(result => res.json(result))
            .catch(error => console.log(error));
    }
];
