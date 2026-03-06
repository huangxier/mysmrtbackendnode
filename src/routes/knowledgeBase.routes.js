const router = require('express').Router();
const ctrl = require('../controllers/knowledgeBase.controller');
const auth = require('../middleware/auth.middleware');

// 知识库 CRUD
router.post('/knowledge-bases', auth, ctrl.createKnowledgeBase);
router.get('/knowledge-bases', auth, ctrl.getUserKnowledgeBases);
router.get('/knowledge-bases/:kbId', auth, ctrl.getKnowledgeBaseDetails);
router.put('/knowledge-bases/:kbId', auth, ctrl.updateKnowledgeBase);
router.delete('/knowledge-bases/:kbId', auth, ctrl.deleteKnowledgeBase);

// 知识库-文档关联
router.get('/knowledge-bases/:kbId/documents', auth, ctrl.getDocumentsInKnowledgeBase);
router.post('/knowledge-bases/:kbId/documents', auth, ctrl.addDocumentToKnowledgeBase);
router.delete('/knowledge-bases/:kbId/documents/:docId', auth, ctrl.removeDocumentFromKnowledgeBase);

// 最近访问
router.get('/user/recent-documents', auth, ctrl.getRecentDocuments);
router.post('/user/document-access', auth, ctrl.recordDocumentAccess);

module.exports = router;