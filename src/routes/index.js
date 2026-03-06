const router = require('express').Router();

router.use('/auth', require('./auth.routes'));
router.use('/document', require('./document.routes'));
router.use('/document', require('./comment.routes'));      // /document/comment/*
router.use('/function', require('./function.routes'));
router.use('/knowledge_base', require('./knowledgeBase.routes'));
router.use('/collaboration', require('./collaboration.routes'));

module.exports = router;