const router = require('express').Router();
const UserController = require('../controllers/user.controller');

router.get('/', UserController.getUserInfo);
router.get('/email/:email', UserController.searchEmail);

module.exports = router;