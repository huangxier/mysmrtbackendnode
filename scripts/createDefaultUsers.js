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
    let user = await User.findOne({ where: { email: u.email } });

    if (user) {
      console.log(`[Seed] 用户已存在，正在将旧 Python 密码更新为 Node.js bcrypt 格式: ${u.email}`);
    } else {
      user = User.build({ username: u.username, email: u.username });
      console.log(`[Seed] 创建新用户: ${u.email}`);
    }

    // 这会调用 User 模型里的 setPassword，使用 bcryptjs 生成新哈希
    await user.setPassword(u.password);
    await user.save();

    const ok = await user.checkPassword(u.password);
    console.log(`[Seed] 状态: ${u.email} 校验: ${ok ? '✅' : '❌'}`);
  }

  console.log('[Seed] 完成');
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });