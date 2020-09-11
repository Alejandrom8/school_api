const { requestValidator } = require('../util/validator'),
      ScheduledSubjectConnector = require('../models/connectors/ScheduledSubject.connector'),
      CompleteSubjectConnector = require('../models/connectors/complements/CompleteSubject.connector');


exports.createManyScheduledSubjects = [
    (req, res, next) => requestValidator(
        res,
        next,
        req.body,
        'scheduledSubjects'
    ),
    (req, res) => {
        let {scheduledSubjects} = req.body;
        ScheduledSubjectConnector
            .createManyScheduledSubjects(scheduledSubjects)
            .then(result => res.json(result))
            .catch(error => console.log(error));
    }
];

exports.getCompleteSubject = [
    (req, res, next) => requestValidator(
        res,
        next,
        req.params,
        'scheduledSubjectID'
    ),
    (req, res) => {
        let {scheduledSubjectID} = req.params;
        CompleteSubjectConnector
            .getCompleteSubject(scheduledSubjectID)
            .then(result => res.json(result))
            .catch(error => console.log(error));
    }
];

exports.getCompleteSubjectsForSemester = [
    (req, res, next) => requestValidator(res, next, req.params, 'semesterID'),
    (req, res) => {
        let {semesterID} = req.params;
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
    (req, res) => {
        let {scheduledSubjectID, calif} = {...req.params, ...req.body};
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
    (req, res) => {
        let { scheduledSubjectID, ponderation } = {...req.params, ...req.body};
        ScheduledSubjectConnector
            .addPonderation(scheduledSubjectID, ponderation)
            .then(result => res.json(result))
            .catch(error => console.log(error));
    }
];

exports.updateProfessor = [
    (req, res, next) => requestValidator(res, next, req.body, 'professorName'),
    (req, res) => {
        let { professorName } = req.body;
        ScheduledSubjectConnector.updateProfessor(professorName)
            .then(result => res.json(result))
            .catch(error => console.log(error));
    }
];
