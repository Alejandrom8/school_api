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
    async (req, res) => {
        let {scheduledSubjects} = req.body, result;
        try{
            result = await ScheduledSubjectConnector
                                .createManyScheduledSubjects(scheduledSubjects);
        }catch(error){
            console.log(error);
        }
        res.json(result);
    }
];

exports.getCompleteSubject = [
    (req, res, next) => requestValidator(
        res,
        next,
        req.params, 
        'scheduledSubjectID'
    ),
    async (req, res) => {
        let {scheduledSubjectID} = req.params, result;
        try{
            result = await CompleteSubjectConnector
                                    .getCompleteSubject(scheduledSubjectID);
        }catch(error) {
            console.log(error);
        }
        res.json(result);
    }
];

exports.getCompleteSubjectsForSemester = [
    (req, res, next) => requestValidator(res, next, req.params, 'semesterID'),
    async (req, res) => {
        let {semesterID} = req.params, result;
        try{
            result = await CompleteSubjectConnector
                                    .getCompleteSubjectsForSemester(semesterID);
        }catch(error){
            console.log(error);
        }
        res.json(result);
    }
];

exports.updateSubjectCalif = [
    (req, res, next) => requestValidator(
        res,
        next, 
        {...req.params, ...req.body}, 
        'scheduledSubjectID', 'calif'
    ),
    async (req, res) => {
        let {scheduledSubjectID, calif} = {...req.params, ...req.body};
        let result;
        try{
            result = await ScheduledSubjectConnector.updateSubjectCalif(
                scheduledSubjectID, 
                calif
            );
        }catch(error){
            console.log(error);
        }
        res.json(result);
    }
];

exports.updatePonderations = [
    (req, res, next) => requestValidator(
        res,
        next,
        {...req.params, ...req.body},
        'scheduledSubjectID', 'ponderation'
    ),
    async (req, res) => {
        let {scheduledSubjectID, ponderation} = {...req.params, ...req.body};
        let result;
        try{
            result = await ScheduledSubjectConnector.addPonderation(
                scheduledSubjectID,
                ponderation
            );
        }catch(error){
            console.log(error);
        }
        res.json(result);
    }
];

exports.updateProfesor = [
    (req, res, next) => requestValidator(res, next, req.body, 'profesorName'),
    async (req, res) => {
        let {profesorName} = req.body, result;
        try{
            result = await ScheduledSubjectConnector
                                    .updateProfesor(profesorName);
        }catch(error){
            console.log(error);
        }
        res.json(result);
    }
];
