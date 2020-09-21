const Auth = require('../models/entities/Auth');

const express = require('express'),
      router = express.Router(),
      withAuthRouter = express.Router(),
      AuthController = require('../controllers/auth.controller'),
      {tokenValidator} = require('../util/validator');

router.post('/signin', AuthController.signIn);
router.post('/signup', AuthController.signUp);
router.patch('/refresh_token', AuthController.refresh);
    withAuthRouter.use(tokenValidator);
    withAuthRouter.delete('/logout', AuthController.logout);
router.use('/auth', withAuthRouter);

module.exports = router;