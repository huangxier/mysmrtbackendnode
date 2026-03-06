const request = require('supertest');
const app = require('../src/app');

// 对应原 check_server.py
describe('Auth API', () => {
  const TEST_EMAIL = 'test@example.com';
  const TEST_PASSWORD = '123456';

  test('GET / 健康检查', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('POST /auth/login 登录成功', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: TEST_EMAIL, password: TEST_PASSWORD });

    expect(res.body.code).toBe(200);
    expect(res.body.data).toHaveProperty('access_token');
    expect(res.body.data.email).toBe(TEST_EMAIL);
  });

  test('POST /auth/login 密码错误', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: TEST_EMAIL, password: 'wrongpassword' });
    expect(res.body.code).toBe(400);
    expect(res.body.message).toMatch('密码错误');
  });

  test('POST /auth/login 邮箱未注册', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'notfound@example.com', password: '123456' });
    expect(res.body.code).toBe(400);
    expect(res.body.message).toMatch('未注册');
  });
});