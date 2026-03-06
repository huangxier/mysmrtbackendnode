const router = require('express').Router();
const ctrl = require('../controllers/function.controller');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/ocr', upload.single('file'), ctrl.ocr);
router.post('/asr', upload.single('file'), ctrl.asr);
router.post('/AIFunc', ctrl.aiFunc);
router.post('/chatglm', ctrl.chatglm);
router.post('/chatglm/stream', ctrl.chatglmStream);

module.exports = router;