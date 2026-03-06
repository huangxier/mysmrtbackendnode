module.exports = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || 'prod_secret_key',
  jwtExpiresIn: '24h',

  db: {
    uri: process.env.SQLALCHEMY_DATABASE_URI || 'mysql://root:root@localhost:3306/smart_editor',
  },

  redis: {
    uri: process.env.REDIS_DATABASE_URI || 'redis://localhost:6379/0',
  },

  mail: {
    host: process.env.MAIL_SERVER || 'smtp.qq.com',
    port: parseInt(process.env.MAIL_PORT || '465'),
    secure: process.env.MAIL_USE_SSL !== 'false',
    user: process.env.MAIL_USERNAME || '',
    pass: process.env.MAIL_PASSWORD || '',
  },

  ai: {
    siliconflowApiKey: process.env.SILICONFLOW_API_KEY || '',
    siliconflowBaseUrl: 'https://api.siliconflow.cn/v1/chat/completions',
    chatglmApiUrl: process.env.CHATGLM_API_URL || 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
    chatglmApiKey: process.env.CHATGLM_API_KEY || '',
    ocrApiUrl: process.env.OCR_API_URL || '',
    accessToken: process.env.ACCESS_TOKEN || '',
  },

  devMode: process.env.DEVELOPMENT_MODE === 'true',
};