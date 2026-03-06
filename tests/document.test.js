const request = require('supertest');
const app = require('../src/app');

// 对应原 test_document_api.py
describe('Document API', () => {
  let token;
  let documentId;

  // 登录获取 token
  beforeAll(async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'test@example.com', password: '123456' });
    token = res.body.data?.access_token;
    expect(token).toBeTruthy();
  });

  test('POST /document 创建文档', async () => {
    const res = await request(app)
      .post('/document')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: '测试文档', content: '<h1>测试</h1>' });
    expect(res.body.code).toBe('200');
    documentId = res.body.id;
    expect(documentId).toBeTruthy();
  });

  test('GET /document/:id 获取文档', async () => {
    const res = await request(app)
      .get(`/document/${documentId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.body.code).toBe('200');
    expect(res.body.document.title).toBe('测试文档');
  });

  test('GET /document/user 获取用户文档列表', async () => {
    const res = await request(app)
      .get('/document/user')
      .set('Authorization', `Bearer ${token}`);
    expect(res.body.code).toBe('200');
    expect(Array.isArray(res.body.documents)).toBe(true);
  });

  test('PUT /document/:id 更新文档', async () => {
    const res = await request(app)
      .put(`/document/${documentId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: '更新后的文档', content: '<h1>已更新</h1>' });
    expect(res.body.code).toBe('200');
  });

  test('PUT /document/favorite/:id 收藏文档', async () => {
    const res = await request(app)
      .put(`/document/favorite/${documentId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.body.code).toBe('200');
  });

  test('GET /document/favorites/user 获取收藏列表', async () => {
    const res = await request(app)
      .get('/document/favorites/user')
      .set('Authorization', `Bearer ${token}`);
    expect(res.body.code).toBe('200');
    expect(Array.isArray(res.body.documents)).toBe(true);
  });

  test('PUT /document/delete/:id 移入回收站', async () => {
    const res = await request(app)
      .put(`/document/delete/${documentId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.body.code).toBe('200');
  });

  test('GET /document/deleted/user 获取回收站列表', async () => {
    const res = await request(app)
      .get('/document/deleted/user')
      .set('Authorization', `Bearer ${token}`);
    expect(res.body.code).toBe('200');
    expect(Array.isArray(res.body.documents)).toBe(true);
  });
});