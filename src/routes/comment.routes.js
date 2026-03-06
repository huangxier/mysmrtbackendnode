const router = require('express').Router();
const ctrl = require('../controllers/comment.controller');
const auth = require('../middleware/auth.middleware');

router.post('/comment', auth, ctrl.addComment);
router.get('/comment/document/:documentId', auth, ctrl.getDocumentComments);
router.delete('/comment/:commentId', auth, ctrl.deleteComment);

module.exports = router;