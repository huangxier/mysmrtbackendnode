const { User } = require('../models');

const DEFAULT_USERS = [
  { username: 'admin',        email: 'admin@smarteditor.com', password: 'admin123' },
  { username: 'template_admin', email: 'template@admin.com', password: 'template123' },
  { username: '测试用户',      email: 'test@example.com',    password: '123456' },
  { username: '用户测试',      email: 'user@test.com',        password: '123456' },
  { username: '示例用户',      email: 'example@test.com',     password: '123456' },
];

exports.seedDefaultUsers = async () => {
  const count = await User.count();
  if (count >= 20) { console.log('[Seed] 用户数充足，跳过初始化'); return; }

  for (const u of DEFAULT_USERS) {
    const exists = await User.findOne({ where: { email: u.email } });
    if (!exists) {
      const user = User.build({ username: u.username, email: u.email });
      await user.setPassword(u.password);
      await user.save();
      console.log(`[Seed] 创建用户: ${u.email}`);
    }
  }
  console.log('[Seed] 默认用户初始化完成');
};