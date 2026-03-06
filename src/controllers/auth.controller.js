const jwt = require('jsonwebtoken');
const { User } = require('../models');
const redisService = require('../services/redis.service');
const mailService = require('../services/mail.service');
const config = require('../config');

// GET /auth/varify/:username/:email  — 注册前校验 + 发送验证码
exports.sendVerificationCode = async (req, res) => {
  try {
    const { username, email } = req.params;

    // ★ 新增：检查用户名是否已被占用
    if (await User.findOne({ where: { username } }))
      return res.json({ message: '用户名已被占用！', code: '400' });

    // ★ 新增：检查邮箱是否已被注册
    if (await User.findOne({ where: { email } }))
      return res.json({ message: '邮箱已被注册！', code: '400' });

    const code = String(Math.floor(100000 + Math.random() * 900000));
    await redisService.setVerificationCode(email, code);
    await mailService.sendVerificationCode(username, email, code, '注册');
    res.json({ message: '验证码已发送，请注意查收！', code: '200' });
  } catch (e) {
    res.status(500).json({ message: `发送验证码失败: ${e.message}`, code: '500' });
  }
};

// POST /auth/register
exports.register = async (req, res) => {
  try {
    const { username, email, password, verification_code } = req.body;
    const stored = await redisService.getVerificationCode(email);
    if (!stored || stored !== verification_code)
      return res.json({ message: '验证码错误或已失效！', code: '400' });
    if (await User.findOne({ where: { email } }))
      return res.json({ message: '邮箱已被注册！', code: '400' });

    const user = User.build({ username, email });
    await user.setPassword(password);
    await user.save();
    // ★ 注册成功后删除验证码
    await redisService.delVerificationCode(email);
    res.json({ message: '用户注册成功！', code: '200' });
  } catch (e) {
    res.status(500).json({ message: `注册失败: ${e.message}`, code: '500' });
  }
};

// POST /auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) return res.json({ message: '缺少邮箱！', code: '400' });
    if (!password) return res.json({ message: '缺少密码！', code: '400' });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.json({ message: '邮箱未注册！', code: '400' });
    if (!(await user.checkPassword(password)))
      return res.json({ message: '密码错误！', code: '400' });

    const token = jwt.sign({ sub: user.id }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
    // ★ code 统一用字符串 '200'，与其他 controller 保持一致
    res.json({
      message: '用户登录成功！', code: '200',
      data: { access_token: token, username: user.username, email: user.email, user_id: user.id },
    });
  } catch (e) {
    res.status(500).json({ message: `登录失败: ${e.message}`, code: '500' });
  }
};

// GET /auth/reset_varify  [jwt]
exports.sendResetCode = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);
    if (!user) return res.json({ message: '用户不存在！', code: '400' });
    const code = String(Math.floor(100000 + Math.random() * 900000));
    await redisService.setVerificationCode(user.email, code);
    await mailService.sendVerificationCode(user.username, user.email, code, '密码重置');
    res.json({ message: '验证码已发送，请注意查收！', code: '200' });
  } catch (e) {
    res.status(500).json({ message: `发送验证码失败: ${e.message}`, code: '500' });
  }
};

// POST /auth/reset_password  [jwt]
exports.resetPassword = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);
    if (!user) return res.json({ message: '用户不存在！', code: '400' });
    const { verification_code, password } = req.body;
    const stored = await redisService.getVerificationCode(user.email);
    if (!stored || stored !== verification_code)
      return res.json({ message: '验证码错误或已失效！', code: '400' });
    await user.setPassword(password);
    await user.save();
    // ★ 重置成功后删除验证码
    await redisService.delVerificationCode(user.email);
    res.json({ message: '用户密码重置成功！', code: '200' });
  } catch (e) {
    res.status(500).json({ message: `重置密码失败: ${e.message}`, code: '500' });
  }
};