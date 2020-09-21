const {requestValidator} = require('../util/validator'),
      ConfigurationConnector = require('../models/connectors/Configuration.connector');


exports.setSelectedSemester = [
    (req, res, next) => requestValidator(res,next,req.body,'semesterID'),
    function (req, res) {
        let {semesterID} = req.body;
        let {userID} = req;
        
        ConfigurationConnector.setConfigElement(
            {type: 'global', userID},
            {elementName: 'selectedSemester', elementValue: semesterID}
        ).then(result => {
            res.json(result);
        });
    }
];

exports.setActivityState = [
    (req, res, next) => requestValidator(
        res,
        next,
        {...req.body, ...req.params},
        'scheduledSubjectID', 'activityID', 'state'
    ),
    function (req, res) {
        let {scheduledSubjectID} = req.params;
        let {activityID, state} = req.body;
        console.log("state", state);

        ConfigurationConnector.updateActivitiesProgress(
            scheduledSubjectID,
            activityID,
            state
        ).then(result => {
            console.log("response", result);
            res.json(result);
        }).catch(error => {
           res.json({success: false, errors: error});
        });
    }
];

exports.getSubjectConfig = [
    (req, res, next) => requestValidator(res, next, req.params, 'scheduledSubjectID'),
    function (req, res) {
        let {scheduledSubjectID} = req.params;

        ConfigurationConnector
            .getConfiguration({scheduledSubjectID, type: 'subject'})
            .then(result => {
                res.status(200).json(result);
            })
            .catch(({status, error}) => {
                res.status(status).json({success:false, errors: error});
            });
    }
];

