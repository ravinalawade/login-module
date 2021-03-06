const express = require('express');
const router = express.Router();

const ctrlUser = require('../controller/user.controller');

// const jwtHelper = require('../config/jwtHelper');

router.post('/register', ctrlUser.register);
router.post('/login', ctrlUser.login);
router.post('/resend', ctrlUser.resend);
router.post('/otpverify',ctrlUser.otpverify);
router.post('/visit',ctrlUser.visit);
router.post('/feedback',ctrlUser.feedback);
router.post('/feedback_expo',ctrlUser.feedback_expo);

//frontend urls
// router.get('/booth_info',ctrlUser.booth_info);
// router.post('/forget_password',ctrlUser.email_userid);
// router.get('/reset_password',ctrlUser.updatepassword);
// router.post('/authenticate', ctrlUser.authenticate);
// router.get('/userProfile',jwtHelper.verifyJwtToken, ctrlUser.userProfile);

module.exports = router;
