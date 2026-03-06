const router = require('express').Router();
const ctrl = require('../controllers/collaboration.controller');

// WebSocket 测试页面（对应原 websocket_test.py 的 /test 路由）
router.get('/test', ctrl.testPage);

module.exports = router;