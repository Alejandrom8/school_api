const router = require('express').Router(),
      ConfigurationController = require('../controllers/configuration.controller');

router.put('/:configurationID/selectedSemester', ConfigurationController.setSelectedSemester);
router.put('/:configurationID/activityState', ConfigurationController.setActivityState);

module.exports = router;
