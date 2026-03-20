const jwt = require('jsonwebtoken');
const { User } = require('../models');
const config = require('../config');

// GET /auth/varify/:username/:email  — 注册前校验用户名/邮箱是否可用
exports.sendVerificationCode = async (req, res) => {
  try {
    const { username, email } = req.params;

    if (await User.findOne({ where: { username } }))
      return res.json({ message: '用户名已被占用！', code: '400' });

    if (await User.findOne({ where: { email } }))
      return res.json({ message: '邮箱已被注册！', code: '400' });

    // 不再发送邮件，直接返回成功（前端收到200后可直接注册）
    res.json({ message: '验证通过，可以注册！', code: '200' });
  } catch (e) {
    res.status(500).json({ message: `校验失败: ${e.message}`, code: '500' });
  }
};

// POST /auth/register
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (await User.findOne({ where: { email } }))
      return res.json({ message: '邮箱已被注册！', code: '400' });

    if (await User.findOne({ where: { username } }))
      return res.json({ message: '用户名已被占用！', code: '400' });

    const user = User.build({ username, email });
    await user.setPassword(password);
    await user.save();
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
    res.json({
      message: '登录成功！',
      code: '200',
      token,
      username: user.username,
      email: user.email,
    });
  } catch (e) {
    res.status(500).json({ message: `登录失败: ${e.message}`, code: '500' });
  }
};

// GET /auth/reset_varify  [jwt]  — 不再发送邮件，直接返回成功
exports.sendResetCode = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);
    if (!user) return res.status(404).json({ message: '用户不存在！', code: '404' });
    res.json({ message: '验证通过，可以重置密码！', code: '200' });
  } catch (e) {
    res.status(500).json({ message: `操作失败: ${e.message}`, code: '500' });
  }
};

// POST /auth/reset_password  [jwt]
exports.resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) return res.json({ message: '缺少新密码！', code: '400' });

    const user = await User.findByPk(req.userId);
    if (!user) return res.status(404).json({ message: '用户不存在！', code: '404' });

    await user.setPassword(password);
    await user.save();
    res.json({ message: '密码重置成功！', code: '200' });
  } catch (e) {
    res.status(500).json({ message: `重置密码失败: ${e.message}`, code: '500' });
  }
};