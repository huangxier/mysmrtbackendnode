module.exports = function errorHandler(err, req, res, next) {
  console.error('[Error]', err.stack || err.message);
  res.status(500).json({ message: `服务器内部错误: ${err.message}`, code: '500' });
};