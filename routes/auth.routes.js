const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { isGuest } = require('../middleware/auth.middleware');

router.get('/login', isGuest, authController.getLogin);
router.post('/login', isGuest, authController.postLogin);
router.get('/register', isGuest, authController.getRegister);
router.post('/register', isGuest, authController.postRegister);
router.get('/logout', authController.logout);

module.exports = router;