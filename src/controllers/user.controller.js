const StudentConnector = require('../models/connectors/Student.connector');

exports.getUser = async (req, res) => {
    let { userID } = req,
        data = await StudentConnector.getStudent(userID);
    res.json(data);
};