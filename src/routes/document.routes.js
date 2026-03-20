const router = require('express').Router();
const ctrl = require('../controllers/document.controller');
const auth = require('../middleware/auth.middleware');

// 静态路径必须在动态路径 /:id 之前

router.get('/user', auth, ctrl.getDocumentsByUser);
router.get('/favorites/user', auth, ctrl.getFavoriteDocuments);
router.get('/deleted/user', auth, ctrl.getDeletedDocuments);

// 模板
router.get('/template/all', auth, ctrl.getTemplateDocuments);
// ★ 前端 TemplateRepo.vue 调用 GET /document/template（无 /all 后缀），兼容两种路径
router.get('/template', auth, ctrl.getTemplateDocuments);
router.get('/template/user', auth, ctrl.getTemplateDocumentsByUser);
router.put('/template/set/:id', auth, ctrl.setTemplate);
router.put('/template/unset/:id', auth, ctrl.unsetTemplate);
// ★ 前端 MyTemplate.vue 调用 PUT /document/template/:id（另存为模板）
router.put('/template/:id', auth, ctrl.setTemplate);
// ★ 前端 MyTemplate.vue 调用 PUT /document/untemplate/:id（撤销模板）
router.put('/untemplate/:id', auth, ctrl.unsetTemplate);

// 收藏
router.put('/favorite/:id', auth, ctrl.favoriteDocument);
router.put('/unfavorite/:id', auth, ctrl.unfavoriteDocument);

// 回收站
router.put('/delete/:id', auth, ctrl.softDeleteDocument);
router.put('/recover/:id', auth, ctrl.recoverDocument);

// 分享
router.get('/share/view/:shareId', ctrl.getSharedDocument);
router.post('/share/:id', auth, ctrl.shareDocument);

// 搜索
router.get('/search/:title', auth, ctrl.searchDocuments);

// ==========================================
// ★ 版本历史 (完全适配前端的真实请求路径)
// ==========================================

// 1. 获取文档的历史版本列表 (你之前请求成功的是 GET /document/:id/versions)
router.get('/:id/versions', auth, ctrl.getDocumentVersions);

// 2. 创建新版本 (终端报错 404 的 POST /document/versions/:id)
router.post('/versions/:id', auth, ctrl.createDocumentVersion);

// 3. 恢复到某版本 (终端报错 404 的 POST /document/:id/restore)
router.post('/:id/restore', auth, ctrl.restoreDocumentVersion);

// 4. 删除某版本
router.delete('/versions/:id', auth, ctrl.deleteDocumentVersion);

// ==========================================

// 通用 CRUD 放最后
router.post('/', auth, ctrl.createDocument);
router.get('/:id', auth, ctrl.getDocument);
router.put('/:id', auth, ctrl.updateDocument);
router.delete('/:id', auth, ctrl.deleteDocument);

module.exports = router;