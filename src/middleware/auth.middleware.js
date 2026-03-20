const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: '缺少Token', code: '401' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, config.jwtSecret);
    req.userId = payload.sub ?? payload.id;
    next();
  } catch (err) {
    const msg = err.name === 'TokenExpiredError' ? 'Token已过期' : '无效的Token';
    return res.status(401).json({ message: msg, code: '401' });
  }
};