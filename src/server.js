require('dotenv').config();
const http = require('http');
const app = require('./app');
const { setupYjsServer } = require('./collaboration/yjsServer');
const { sequelize } = require('./config/database');
const { seedDefaultUsers } = require('./services/seed.service');

const PORT = process.env.PORT || 5000;

async function bootstrap() {
  // 同步数据库模型（等价于 db.create_all()）
  await sequelize.sync({ alter: false });
  console.log('[DB] 数据库表已同步');

  // 初始化默认用户
  await seedDefaultUsers();

  // 创建 HTTP 服务器
  const server = http.createServer(app);

  // 挂载 Y.js WebSocket 服务器（协同编辑）
  setupYjsServer(server);

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] 服务已启动: http://0.0.0.0:${PORT}`);
    console.log(`[YJS]    Y.js WebSocket 已就绪`);
  });
}

bootstrap().catch((err) => {
  console.error('[Bootstrap] 启动失败:', err);
  process.exit(1);
});