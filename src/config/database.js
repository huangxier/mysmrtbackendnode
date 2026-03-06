const { Sequelize } = require('sequelize');
const config = require('./index');

// 解析原始 URI（兼容 mysql+pymysql:// 和 mysql:// 两种写法）
const rawUri = config.db.uri.replace('mysql+pymysql://', 'mysql://');

const sequelize = new Sequelize(rawUri, {
  dialect: 'mysql',
  logging: false,
  pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
  define: { underscored: false, timestamps: false },
});

module.exports = { sequelize };