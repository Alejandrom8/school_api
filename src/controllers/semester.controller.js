const { requestValidator } = require('../util/validator'),
      SemesterConnector = require('../models/connectors/Semester.connector'),
      SubjectConnector = require('../models/connectors/Subject.connector'),
      CompleteSubjectConnector = require('../models/connectors/complements/CompleteSubject.connector');


exports.getSemester = [
    (req, res, next) => requestValidator(res, next, req.params, 'semesterID'),
    function (req, res) {
        let { semesterID } = req.params;

        SemesterConnector
            .getSemester(semesterID)
            .then(result => res.json(result))
            .catch(error => console.log(error));
    }
];

/**
 * creates all the necesary elements in the database to get a user ready
 * to start his semester
 */
exports.createSemester = [
    (req, res, next) => requestValidator(res, next, req.body, 'key', 'subjects'),
    function (req, res) {
        let { userID } = req, { key, subjects } = req.body;

        SemesterConnector
            .createSemester(key, userID)
            .then(ssc => ssc.createManyScheduledSubjects(subjects))
            .then(result => res.json(result))
            .catch(({error, status}) => {
                res.status(status).json({success: false, errors: error});
            });
    }
];

exports.getUserSemesters = function ({userID}, res) {
    SemesterConnector
        .getAllSemestersForUser(userID)
        .then(result => res.json(result))
        .catch(error => console.log(error));
};

exports.getSemesterSubjects = [
    (req, res, next) => requestValidator(res, next, req.params, 'semesterID'),
    function (req, res) {
        let { semesterID } = req.params;

        SubjectConnector
            .getSubjectsBySemester(semesterID)
            .then(result => res.json(result))
            .catch(error => console.log(error));
    }
];

exports.getCompleteSemesterSubjects = [
    (req, res, next) => requestValidator(res, next, req.params, 'semesterID'),
    function (req, res) {
        let { semesterID } = req.params;

        CompleteSubjectConnector
            .getSubjectAndConfigForSemester(semesterID)
            .then(result => res.json({success: true, data: result}))
            .catch(({status = 500, error}) => {
                res.status(status).json({success:false, errors: error})
            });
    }
];