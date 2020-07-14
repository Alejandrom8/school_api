const express = require('express');
const router = express.Router();
const SignController = require('../controllers/sign.controller');

router.use( (req, res, next) => {
    console.log(req.body);
    next();
});

router.post('/in', SignController.sign_in_post);
router.delete('/out', SignController.sign_out_delete);
router.post('/up', SignController.sign_up_post);

module.exports = router;