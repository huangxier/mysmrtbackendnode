/**
 * 数据库初始化脚本
 * 等价于原 init_db.sql + db.create_all()
 * 用法: node scripts/initDb.js
 */
require('dotenv').config();
const { sequelize } = require('../src/models');

async function init() {
  try {
    await sequelize.authenticate();
    console.log('[initDb] 数据库连接成功');

    // force: false  —— 表已存在则不重建（等价于 CREATE TABLE IF NOT EXISTS）
    // alter: true   —— 自动补全缺失的列（等价于 ALTER TABLE）
    await sequelize.sync({ force: false, alter: true });
    console.log('[initDb] 所有表已同步完成');

    process.exit(0);
  } catch (e) {
    console.error('[initDb] 初始化失败:', e.message);
    process.exit(1);
  }
}

init();