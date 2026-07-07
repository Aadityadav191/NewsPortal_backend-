const express = require('express');
const router = express.Router();
// const {signup,login, getme} from '../controllers/auth.controller.js'
const {signup,login, getMe} = require('../controllers/auth.controller.js')

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', getMe);

// router.get('/logout', logout);
// router.post('/forgot-password', forgotPassword);
// router.post('/reset-password/', resetPassword);

module.exports = router;