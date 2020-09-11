const router = require('express').Router(),
      UserController = require('../controllers/user.controller'),
      { tokenValidator } = require('../util/validator');

router.use(tokenValidator);

router.get('/', UserController.getUser);

module.exports = router;