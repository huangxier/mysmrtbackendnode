const redis = require('../config/redis');

const KEY = (email) => `verification_code:${email}`;

exports.setVerificationCode = (email, code) => redis.setex(KEY(email), 300, code);
exports.getVerificationCode = (email) => redis.get(KEY(email));
exports.delVerificationCode = (email) => redis.del(KEY(email));