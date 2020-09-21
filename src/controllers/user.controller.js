const StudentConnector = require('../models/connectors/Student.connector'),
      { requestValidator } = require('../util/validator'),
      ConfigurationConnector = require('../models/connectors/Configuration.connector'),
      SemesterConnector = require('../models/connectors/Semester.connector'),
      CompleteSubjectConnector = require('../models/connectors/complements/CompleteSubject.connector');

exports.getUser = function ({userID}, res) {
    StudentConnector
        .getStudent(userID)
        .then(result => res.json(result))
        .catch(error => console.log(error));
};

exports.getHomeData = [
    (req, res, next) => requestValidator(res, next, req, 'userID'),
    function ( {userID} , res) {
        let response = {};

        StudentConnector
            .getStudent(userID)
            .then(({data: user}) => { //getting semesters and globalConfig
                response.user = user;
                let configuration = ConfigurationConnector.getConfiguration({userID, type: 'global'});
                let semester = SemesterConnector.getAllSemestersForUser(userID);
                return Promise.all([configuration, semester]);
            })
            .then(([configResult, semestersResult]) => {
                response.semesters = semestersResult.data;
                response.configuration = configResult.data;
                res.status(200).json({success: true, data: response});
            })
            .catch(({error, status = 500}) => {
                res.status(status).json({success: false, errors: error});
            });
    }
];

exports.updateSelectedSemester = [
    (req, res, next) => requestValidator(res, next, req.body, 'semesterID'),
    function (req, res) {
        let {userID} = req;
        let {semesterID} = req.body;

        ConfigurationConnector.setConfigElement(
            {type: 'global', userID},
            {elementName: 'selectedSemester', elementValue: semesterID}
        ).then(() => (
            CompleteSubjectConnector.getSubjectAndConfigForSemester(semesterID)
        ))
        .then(subjects => {
            console.log(subjects);
            res.status(200).json({success:true, data: subjects});
        })
        .catch(({error, status = 500}) => {
            res.status(status).json({success: false, errors: error});
        })
    }
]