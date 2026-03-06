const Redis = require('ioredis');
const config = require('./index');

let redis;
try {
  redis = new Redis(config.redis.uri);
  redis.on('connect', () => console.log('[Redis] 连接成功'));
  redis.on('error', (e) => console.error('[Redis] 连接错误:', e.message));
} catch (e) {
  // 降级：内存模拟（对应原 MockRedis）
  console.warn('[Redis] 使用内存模拟 Redis');
  const store = new Map();
  redis = {
    get: async (k) => store.get(k) || null,
    set: async (k, v) => store.set(k, v),
    setex: async (k, ttl, v) => {
      store.set(k, v);
      setTimeout(() => store.delete(k), ttl * 1000);
    },
    del: async (k) => store.delete(k),
  };
}

module.exports = redis;