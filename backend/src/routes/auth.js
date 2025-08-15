// backend/src/routes/auth.js
const express = require('express');
const router  = express.Router();

const {
  checkUsername,
  checkEmail,
  checkWallet,
  getSponsor,

  signup,
  login,
  verifyPin,
  walletLogin,
  me,

  forgotPassword,
  resetPassword,
} = require('../controllers/authController');

const authCtrl = require('../controllers/authController');

// VALIDATION
router.post('/username',     checkUsername);
router.post('/email',        checkEmail);
router.post('/wallet',       checkWallet);
router.get( '/sponsor/:code', getSponsor);

// AUTH
router.post('/register',      signup);
router.post('/login',         login);
router.post('/verify-pin',    verifyPin);
router.post('/wallet-login',  walletLogin);
router.get( '/me',            me);

// PASSWORD RESET
router.post('/forgot-password', forgotPassword);
router.post('/reset-password',  resetPassword);

router.post('/change-password', authCtrl.changePassword);
router.post('/change-pin',      authCtrl.changePin);
module.exports = router;
