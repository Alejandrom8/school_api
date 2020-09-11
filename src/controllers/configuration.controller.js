const {requestValidator} = require('../util/validator'),
      ConfigurationConnector = require('../models/connectors/Configuration.connector');

exports.setSelectedSemester = [
    (req, res, next) => requestValidator(
        res,
        next,
        {...req.body, ...req.params},
        'configurationID', 'semesterID'
    ),
    (req, res) => {
        let {configurationID, semesterID} = {...req.body, ...req.params};
        ConfigurationConnector.setConfigElement(
            configurationID,
            {elementName: 'selectedSemester', elementValue: semesterID}
        ).then(result => {
            res.json(result);
        });
    }
]

exports.setActivityState = [
    (req, res, next) => requestValidator(
        res,
        next,
        {...req.body, ...req.params},
        'configurationID', 'activityID', 'activityState'
    ),
    function (req, res) {
        let {configurationID} = req.params;
        let {activityID, activityState} = req.body;

        ConfigurationConnector.setActivityState(
            configurationID,
            activityID,
            activityState
        ).then(result => {
          res.json(result);
        }).catch(error => {
           res.json({success: false, errors: error});
        });
    }
];

