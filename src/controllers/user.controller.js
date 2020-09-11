const StudentConnector = require('../models/connectors/Student.connector');

exports.getUser = ({userID}, res) => {
    StudentConnector
        .getStudent(userID)
        .then(result => res.json(result))
        .catch(error => console.log(error));
};
