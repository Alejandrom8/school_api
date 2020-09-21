const router = require('express').Router(),
      ConfigurationController = require('../controllers/configuration.controller'),
      {tokenValidator} = require('../util/validator');

router.use(tokenValidator);

router.patch('/selectedSemester', ConfigurationController.setSelectedSemester);
router.put('/scheduledSubject/:scheduledSubjectID/activityState', ConfigurationController.setActivityState);
router.get('/scheduledSubject/:scheduledSubjectID', ConfigurationController.getSubjectConfig);

module.exports = router;