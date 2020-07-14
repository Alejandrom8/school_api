const express = require('express');
const router = express.Router();

let ConfigurationController = require('../controllers/configurationController');

router.get('/semester/:semesterID', ConfigurationController.semester_obj_get);

module.exports = router;