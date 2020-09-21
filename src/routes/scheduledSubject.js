const router = require('express').Router(),
      {tokenValidator} = require('../util/validator'),
      ScheduledSubjectController = require('../controllers/scheduledSubject.controller');

router.use(tokenValidator);

router.get('/:scheduledSubjectID', ScheduledSubjectController.getCompleteSubject);
router.patch('/:scheduledSubjectID', ScheduledSubjectController.updateSubject);
router.put('/:scheduledSubjectID/subjectCalif', ScheduledSubjectController.updateSubjectCalif);
router.put('/:scheduledSubjectID/ponderation', ScheduledSubjectController.updatePonderations);
router.put('/:scheduledSubjectID/professorName', ScheduledSubjectController.updateProfessor);

module.exports = router;