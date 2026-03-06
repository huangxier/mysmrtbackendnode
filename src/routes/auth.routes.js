const router = require('express').Router();
const ctrl = require('../controllers/auth.controller');
const auth = require('../middleware/auth.middleware');

router.get('/varify/:username/:email', ctrl.sendVerificationCode);  // 发送注册验证码
router.post('/register',               ctrl.register);              // 用户注册
router.post('/login',                  ctrl.login);                 // 用户登录
router.get('/reset_varify',   auth,    ctrl.sendResetCode);         // 发送重置密码验证码
router.post('/reset_password', auth,   ctrl.resetPassword);         // 重置密码

module.exports = router;