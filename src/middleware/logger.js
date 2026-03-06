const morgan = require('morgan');

// 开发环境使用 'dev' 格式，生产环境使用 'combined' 格式
const format = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';

module.exports = morgan(format);