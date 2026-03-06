/**
 * 手动执行默认用户创建脚本
 * 等价于原 create_default_user.py / create_test_user.py
 * 用法: node scripts/createDefaultUsers.js
 */
require('dotenv').config();
const { sequelize, User } = require('../src/models');

const DEFAULT_USERS = [
  { username: 'admin', email: 'admin@smarteditor.com', password: 'admin123' },
  { username: 'template_admin', email: 'template@admin.com', password: 'template123' },
  { username: '测试用户', email: 'test@example.com', password: '123456' },
  { username: '用户测试', email: 'user@test.com', password: '123456' },
  { username: '示例用户', email: 'example@test.com', password: '123456' },
];

async function run() {
  await sequelize.authenticate();
  console.log('[Seed] 数据库连接成功');

  for (const u of DEFAULT_USERS) {
    const exists = await User.findOne({ where: { email: u.email } });
    if (exists) {
      console.log(`[Seed] 已存在，跳过: ${u.email}`);
      continue;
    }
    const user = User.build({ username: u.username, email: u.email });
    await user.setPassword(u.password);
    await user.save();

    // 验证密码写入是否正确
    const ok = await user.checkPassword(u.password);
    console.log(`[Seed] 创建用户: ${u.email}  密码验证: ${ok ? '✅' : '❌'}`);
  }

  console.log('[Seed] 完成');
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });