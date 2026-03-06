const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    if (config.devMode) return next();                    // 开发模式跳过
    return res.status(401).json({ message: '缺少Token', code: '401' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, config.jwtSecret);
    req.userId = payload.sub ?? payload.id;              // 与 create_access_token(identity=user.id) 对应
    next();
  } catch (err) {
    if (config.devMode) return next();
    const msg = err.name === 'TokenExpiredError' ? 'Token已过期' : '无效的Token';
    return res.status(401).json({ message: msg, code: '401' });
  }
};