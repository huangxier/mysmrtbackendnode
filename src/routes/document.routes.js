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

// 版本历史
router.get('/versions/:id', auth, ctrl.getDocumentVersions);
router.post('/versions/:id', auth, ctrl.createDocumentVersion);
router.put('/versions/:id/restore', auth, ctrl.restoreDocumentVersion);
router.delete('/versions/:id/:verId', auth, ctrl.deleteDocumentVersion);

// 通用 CRUD 放最后
router.post('/', auth, ctrl.createDocument);
router.get('/:id', auth, ctrl.getDocument);
router.put('/:id', auth, ctrl.updateDocument);
router.delete('/:id', auth, ctrl.deleteDocument);

module.exports = router;