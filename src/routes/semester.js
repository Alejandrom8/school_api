const express = require('express'),
      router = express.Router(),
      subjectRouter = express.Router({mergeParams:true}),
      SemesterController = require('../controllers/semester.controller'),
      { tokenValidator } = require('../util/validator');

router.use(tokenValidator);

router.post('/', SemesterController.createSemester);
router.get('/userID', SemesterController.getUserSemesters);
router.get('/:semesterID', SemesterController.getSemester);

router.use('/:semesterID/subjects', subjectRouter);
subjectRouter.get('/', SemesterController.getSemesterSubjects);
subjectRouter.get('/complete', SemesterController.getCompleteSemesterSubjects);

module.exports = router;
