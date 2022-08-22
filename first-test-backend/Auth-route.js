const router = require('express').Router();
const authController = require('./controllers/auth-controllers');

router.post('/auth', authController.login);

module.exports = router;