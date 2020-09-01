const User = require('../models/entities/User');

const express = require('express'),
      userRouter = express.Router(),
      UserController = require('../controllers/user.controller'),
      { tokenValidator } = require('../util/validator');

userRouter.use(tokenValidator);

//need to recive a token as a query param.
userRouter.get('/', UserController.getUser);


module.exports = userRouter;