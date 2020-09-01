const express = require('express'),
      subjectRouter = express.Router(),
      SubjectController = require('../controllers/subject.controller.js');

subjectRouter.get('/:subjectID', SubjectController.getSubject);

subjectRouter.use('/:subjectID/modules', SubjectController.getModulesForSubject);
subjectRouter.get('/semesterID/:semesterID', SubjectController.getSubjectsBySemester);

module.exports = subjectRouter;