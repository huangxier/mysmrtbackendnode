const { KnowledgeBase, KnowledgeBaseDocument, Document, DocumentAccess, User } = require('../models');
const { Op } = require('sequelize');

// POST /knowledge_base/knowledge-bases
exports.createKnowledgeBase = async (req, res) => {
  try {
    const { name, description, icon } = req.body;
    if (!name) return res.json({ message: '知识库名称不能为空！', code: '400' });

    const kb = await KnowledgeBase.create({
      name,
      description: description || '',
      icon: icon || 'ri-book-2-line',
      creator_id: req.userId,
      created_at: new Date(),
      updated_at: new Date(),
    });
    res.json({ message: '创建成功！', code: '200', knowledge_base: kb.toJSON() });
  } catch (e) {
    res.status(500).json({ message: `创建失败: ${e.message}`, code: '500' });
  }
};

// GET /knowledge_base/knowledge-bases
exports.getUserKnowledgeBases = async (req, res) => {
  try {
    const kbs = await KnowledgeBase.findAll({
      where: { creator_id: req.userId },
      order: [['updated_at', 'DESC']],
    });
    res.json({ message: '获取成功！', code: '200', knowledge_bases: kbs.map(k => k.toJSON()) });
  } catch (e) {
    res.status(500).json({ message: `获取失败: ${e.message}`, code: '500' });
  }
};

// GET /knowledge_base/knowledge-bases/:kbId
exports.getKnowledgeBaseDetails = async (req, res) => {
  try {
    const kb = await KnowledgeBase.findOne({
      where: { id: req.params.kbId, creator_id: req.userId },
    });
    if (!kb) return res.json({ message: '知识库不存在！', code: '404' });

    // 获取知识库内的文档
    const kbDocs = await KnowledgeBaseDocument.findAll({
      where: { knowledge_base_id: kb.id },
    });
    const docIds = kbDocs.map(d => d.document_id);
    const documents = docIds.length > 0
      ? await Document.findAll({ where: { id: { [Op.in]: docIds }, is_deleted: false } })
      : [];

    res.json({
      message: '获取成功！',
      code: '200',
      knowledge_base: kb.toJSON(),
      documents: documents.map(d => d.toJSON()),
    });
  } catch (e) {
    res.status(500).json({ message: `获取失败: ${e.message}`, code: '500' });
  }
};

// PUT /knowledge_base/knowledge-bases/:kbId
exports.updateKnowledgeBase = async (req, res) => {
  try {
    const kb = await KnowledgeBase.findOne({
      where: { id: req.params.kbId, creator_id: req.userId },
    });
    if (!kb) return res.json({ message: '知识库不存在！', code: '404' });

    const { name, description, icon } = req.body;
    await kb.update({
      name: name ?? kb.name,
      description: description ?? kb.description,
      icon: icon ?? kb.icon,
      updated_at: new Date(),
    });
    res.json({ message: '更新成功！', code: '200', knowledge_base: kb.toJSON() });
  } catch (e) {
    res.status(500).json({ message: `更新失败: ${e.message}`, code: '500' });
  }
};

// DELETE /knowledge_base/knowledge-bases/:kbId
exports.deleteKnowledgeBase = async (req, res) => {
  try {
    const kb = await KnowledgeBase.findOne({
      where: { id: req.params.kbId, creator_id: req.userId },
    });
    if (!kb) return res.json({ message: '知识库不存在！', code: '404' });

    // 先删除关联文档记录
    await KnowledgeBaseDocument.destroy({ where: { knowledge_base_id: kb.id } });
    await kb.destroy();
    res.json({ message: '删除成功！', code: '200' });
  } catch (e) {
    res.status(500).json({ message: `删除失败: ${e.message}`, code: '500' });
  }
};

// GET /knowledge_base/knowledge-bases/:kbId/documents
exports.getDocumentsInKnowledgeBase = async (req, res) => {
  try {
    const kb = await KnowledgeBase.findOne({
      where: { id: req.params.kbId, creator_id: req.userId },
    });
    if (!kb) return res.json({ message: '知识库不存在！', code: '404' });

    const kbDocs = await KnowledgeBaseDocument.findAll({
      where: { knowledge_base_id: kb.id },
    });
    const docIds = kbDocs.map(d => d.document_id);
    const documents = docIds.length > 0
      ? await Document.findAll({ where: { id: { [Op.in]: docIds }, is_deleted: false } })
      : [];

    res.json({ message: '获取成功！', code: '200', documents: documents.map(d => d.toJSON()) });
  } catch (e) {
    res.status(500).json({ message: `获取失败: ${e.message}`, code: '500' });
  }
};

// POST /knowledge_base/knowledge-bases/:kbId/documents
exports.addDocumentToKnowledgeBase = async (req, res) => {
  try {
    const kb = await KnowledgeBase.findOne({
      where: { id: req.params.kbId, creator_id: req.userId },
    });
    if (!kb) return res.json({ message: '知识库不存在！', code: '404' });

    const { document_id } = req.body;
    if (!document_id) return res.json({ message: '文档ID不能为空！', code: '400' });

    const doc = await Document.findOne({ where: { id: document_id, is_deleted: false } });
    if (!doc) return res.json({ message: '文档不存在！', code: '404' });

    // 检查是否已关联
    const exists = await KnowledgeBaseDocument.findOne({
      where: { knowledge_base_id: kb.id, document_id },
    });
    if (exists) return res.json({ message: '文档已在该知识库中！', code: '400' });

    await KnowledgeBaseDocument.create({
      knowledge_base_id: kb.id,
      document_id,
      added_by_user_id: req.userId,
      added_at: new Date(),
    });

    // 更新知识库的 updated_at
    await kb.update({ updated_at: new Date() });

    res.json({ message: '添加成功！', code: '200' });
  } catch (e) {
    res.status(500).json({ message: `添加失败: ${e.message}`, code: '500' });
  }
};

// DELETE /knowledge_base/knowledge-bases/:kbId/documents/:docId
exports.removeDocumentFromKnowledgeBase = async (req, res) => {
  try {
    const kb = await KnowledgeBase.findOne({
      where: { id: req.params.kbId, creator_id: req.userId },
    });
    if (!kb) return res.json({ message: '知识库不存在！', code: '404' });

    const deleted = await KnowledgeBaseDocument.destroy({
      where: { knowledge_base_id: kb.id, document_id: req.params.docId },
    });
    if (!deleted) return res.json({ message: '文档不在该知识库中！', code: '404' });

    await kb.update({ updated_at: new Date() });
    res.json({ message: '移除成功！', code: '200' });
  } catch (e) {
    res.status(500).json({ message: `移除失败: ${e.message}`, code: '500' });
  }
};

// GET /knowledge_base/user/recent-documents
exports.getRecentDocuments = async (req, res) => {
  try {
    const records = await DocumentAccess.findAll({
      where: { user_id: req.userId },
      order: [['accessed_at', 'DESC']],
      limit: 20,
    });

    // 去重（同一文档只保留最新访问记录）
    const seen = new Set();
    const unique = [];
    for (const r of records) {
      if (!seen.has(r.document_id)) {
        seen.add(r.document_id);
        unique.push(r);
      }
    }

    const result = unique.map(r => ({
      id: r.document_id,
      title: r.document_title,
      accessTime: r.accessed_at,
    }));

    res.json({ message: '获取成功！', code: '200', documents: result });
  } catch (e) {
    res.status(500).json({ message: `获取失败: ${e.message}`, code: '500' });
  }
};

// POST /knowledge_base/user/document-access
exports.recordDocumentAccess = async (req, res) => {
  try {
    const { document_id, title } = req.body;
    if (!document_id) return res.json({ message: '文档ID不能为空！', code: '400' });

    // 更新已有记录或新建
    const existing = await DocumentAccess.findOne({
      where: { user_id: req.userId, document_id },
    });

    if (existing) {
      await existing.update({
        document_title: title || existing.document_title,
        accessed_at: new Date(),
      });
    } else {
      await DocumentAccess.create({
        user_id: req.userId,
        document_id,
        document_title: title || '未命名文档',
        accessed_at: new Date(),
      });
    }

    res.json({ message: '记录成功！', code: '200' });
  } catch (e) {
    res.status(500).json({ message: `记录失败: ${e.message}`, code: '500' });
  }
};