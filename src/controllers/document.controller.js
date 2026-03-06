const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const { Document, DocumentVersion, DocumentShare, User } = require('../models');



// POST /document
exports.createDocument = async (req, res) => {
  try {
    const { title, content } = req.body;
    const doc = await Document.create({
      id: uuidv4(),           // ★ 手动生成 UUID
      user_id: req.userId,
      title,
      content,
      created_at: new Date(),
      updated_at: new Date(),
    });
    res.json({ message: '文档创建成功！', code: '200', id: doc.id });
  } catch (e) {
    res.status(500).json({ message: `创建失败: ${e.message}`, code: '500' });
  }
};

// GET /document/:id
exports.getDocument = async (req, res) => {
  try {
    const doc = await Document.findByPk(req.params.id);
    if (!doc || doc.is_deleted)
      return res.json({ message: '文档不存在！', code: '404' });
    res.json({ message: '获取文档成功！', code: '200', document: doc.toJSON() });
  } catch (e) {
    res.status(500).json({ message: `获取失败: ${e.message}`, code: '500' });
  }
};

// GET /document/user
exports.getDocumentsByUser = async (req, res) => {
  try {
    const docs = await Document.findAll({
      where: { user_id: req.userId, is_deleted: false, is_template: false },
      order: [['updated_at', 'DESC']],
    });
    res.json({ message: '获取成功！', code: '200', documents: docs.map(d => d.toJSON()) });
  } catch (e) {
    res.status(500).json({ message: `获取失败: ${e.message}`, code: '500' });
  }
};

// PUT /document/:id
exports.updateDocument = async (req, res) => {
  try {
    const doc = await Document.findOne({ where: { id: req.params.id, user_id: req.userId } });
    if (!doc) return res.json({ message: '文档不存在！', code: '404' });
    await doc.update({ ...req.body, updated_at: new Date() });
    res.json({ message: '文档更新成功！', code: '200' });
  } catch (e) {
    res.status(500).json({ message: `更新失败: ${e.message}`, code: '500' });
  }
};

// DELETE /document/:id  (物理删除)
exports.deleteDocument = async (req, res) => {
  try {
    const doc = await Document.findOne({ where: { id: req.params.id, user_id: req.userId } });
    if (!doc) return res.json({ message: '文档不存在！', code: '404' });
    await doc.destroy();
    res.json({ message: '文档删除成功！', code: '200' });
  } catch (e) {
    res.status(500).json({ message: `删除失败: ${e.message}`, code: '500' });
  }
};

// PUT /document/favorite/:id
exports.favoriteDocument = async (req, res) => {
  try {
    const doc = await Document.findOne({ where: { id: req.params.id, user_id: req.userId } });
    if (!doc) return res.json({ message: '文档不存在！', code: '404' });
    await doc.update({ is_favorite: true });
    res.json({ message: '收藏成功！', code: '200' });
  } catch (e) {
    res.status(500).json({ message: `操作失败: ${e.message}`, code: '500' });
  }
};

// PUT /document/unfavorite/:id
exports.unfavoriteDocument = async (req, res) => {
  try {
    const doc = await Document.findOne({ where: { id: req.params.id, user_id: req.userId } });
    if (!doc) return res.json({ message: '文档不存在！', code: '404' });
    await doc.update({ is_favorite: false });
    res.json({ message: '已取消收藏！', code: '200' });
  } catch (e) {
    res.status(500).json({ message: `操作失败: ${e.message}`, code: '500' });
  }
};

// GET /document/favorites/user
exports.getFavoriteDocuments = async (req, res) => {
  try {
    const docs = await Document.findAll({
      where: { user_id: req.userId, is_favorite: true, is_deleted: false },
      order: [['updated_at', 'DESC']],
    });
    res.json({ message: '获取成功！', code: '200', documents: docs.map(d => d.toJSON()) });
  } catch (e) {
    res.status(500).json({ message: `获取失败: ${e.message}`, code: '500' });
  }
};

// PUT /document/delete/:id  (逻辑删除，移入回收站)
exports.softDeleteDocument = async (req, res) => {
  try {
    const doc = await Document.findOne({ where: { id: req.params.id, user_id: req.userId } });
    if (!doc) return res.json({ message: '文档不存在！', code: '404' });
    await doc.update({ is_deleted: true, updated_at: new Date() });
    res.json({ message: '文档已移入回收站！', code: '200' });
  } catch (e) {
    res.status(500).json({ message: `操作失败: ${e.message}`, code: '500' });
  }
};

// PUT /document/recover/:id
exports.recoverDocument = async (req, res) => {
  try {
    const doc = await Document.findOne({ where: { id: req.params.id, user_id: req.userId } });
    if (!doc) return res.json({ message: '文档不存在！', code: '404' });
    await doc.update({ is_deleted: false, updated_at: new Date() });
    res.json({ message: '文档已恢复！', code: '200' });
  } catch (e) {
    res.status(500).json({ message: `操作失败: ${e.message}`, code: '500' });
  }
};

// GET /document/deleted/user
exports.getDeletedDocuments = async (req, res) => {
  try {
    const docs = await Document.findAll({
      where: { user_id: req.userId, is_deleted: true },
      order: [['updated_at', 'DESC']],
    });
    res.json({ message: '获取成功！', code: '200', documents: docs.map(d => d.toJSON()) });
  } catch (e) {
    res.status(500).json({ message: `获取失败: ${e.message}`, code: '500' });
  }
};

// GET /document/template/all  (所有模板，包括系统模板)
exports.getTemplateDocuments = async (req, res) => {
  try {
    const docs = await Document.findAll({
      where: { is_template: true, is_deleted: false },
      order: [['updated_at', 'DESC']],
    });
    res.json({ message: '获取成功！', code: '200', documents: docs.map(d => d.toJSON()) });
  } catch (e) {
    res.status(500).json({ message: `获取失败: ${e.message}`, code: '500' });
  }
};

// GET /document/template/user  (当前用户自己的模板)
exports.getTemplateDocumentsByUser = async (req, res) => {
  try {
    const docs = await Document.findAll({
      where: { user_id: req.userId, is_template: true, is_deleted: false },
      order: [['updated_at', 'DESC']],
    });
    res.json({ message: '获取成功！', code: '200', documents: docs.map(d => d.toJSON()) });
  } catch (e) {
    res.status(500).json({ message: `获取失败: ${e.message}`, code: '500' });
  }
};

// PUT /document/template/set/:id
exports.setTemplate = async (req, res) => {
  try {
    const doc = await Document.findOne({ where: { id: req.params.id, user_id: req.userId } });
    if (!doc) return res.json({ message: '文档不存在！', code: '404' });
    await doc.update({ is_template: true });
    res.json({ message: '已设为模板！', code: '200' });
  } catch (e) {
    res.status(500).json({ message: `操作失败: ${e.message}`, code: '500' });
  }
};

// PUT /document/template/unset/:id
exports.unsetTemplate = async (req, res) => {
  try {
    const doc = await Document.findOne({ where: { id: req.params.id, user_id: req.userId } });
    if (!doc) return res.json({ message: '文档不存在！', code: '404' });
    await doc.update({ is_template: false });
    res.json({ message: '已取消模板！', code: '200' });
  } catch (e) {
    res.status(500).json({ message: `操作失败: ${e.message}`, code: '500' });
  }
};

// POST /document/share/:id
exports.shareDocument = async (req, res) => {
  try {
    const doc = await Document.findOne({ where: { id: req.params.id, user_id: req.userId } });
    if (!doc) return res.json({ message: '文档不存在！', code: '404' });

    // 已存在分享则直接返回
    let share = await DocumentShare.findOne({ where: { document_id: doc.id, owner_id: req.userId } });
    if (!share) {
      share = await DocumentShare.create({
        id: uuidv4(),
        document_id: doc.id,
        owner_id: req.userId,
        share_token: uuidv4(),
        created_at: new Date(),
      });
    }
    res.json({ message: '分享成功！', code: '200', share: share.toDict() });
  } catch (e) {
    res.status(500).json({ message: `分享失败: ${e.message}`, code: '500' });
  }
};

// GET /document/share/view/:shareId  (无需登录)
exports.getSharedDocument = async (req, res) => {
  try {
    const share = await DocumentShare.findByPk(req.params.shareId);
    if (!share) return res.json({ message: '分享不存在！', code: '404' });
    const doc = await Document.findByPk(share.document_id);
    if (!doc || doc.is_deleted) return res.json({ message: '文档不存在！', code: '404' });
    res.json({ message: '获取成功！', code: '200', document: doc.toJSON() });
  } catch (e) {
    res.status(500).json({ message: `获取失败: ${e.message}`, code: '500' });
  }
};

// GET /document/search/:title
exports.searchDocuments = async (req, res) => {
  try {
    const docs = await Document.findAll({
      where: {
        user_id: req.userId,
        is_deleted: false,
        title: { [Op.like]: `%${req.params.title}%` },
      },
      order: [['updated_at', 'DESC']],
    });
    res.json({ message: '搜索成功！', code: '200', documents: docs.map(d => d.toJSON()) });
  } catch (e) {
    res.status(500).json({ message: `搜索失败: ${e.message}`, code: '500' });
  }
};

// ── 版本历史 ──────────────────────────────────────────────

// GET /document/versions/:id
exports.getDocumentVersions = async (req, res) => {
  try {
    const versions = await DocumentVersion.findAll({
      where: { document_id: req.params.id },
      order: [['version_number', 'DESC']],
    });
    res.json({ message: '获取成功！', code: '200', versions: versions.map(v => v.toDict()) });
  } catch (e) {
    res.status(500).json({ message: `获取失败: ${e.message}`, code: '500' });
  }
};

// POST /document/versions/:id  (保存新版本)
exports.createDocumentVersion = async (req, res) => {
  try {
    const doc = await Document.findOne({ where: { id: req.params.id, user_id: req.userId } });
    if (!doc) return res.json({ message: '文档不存在！', code: '404' });

    // 计算下一个版本号
    const last = await DocumentVersion.findOne({
      where: { document_id: doc.id },
      order: [['version_number', 'DESC']],
    });
    const nextVersion = last ? last.version_number + 1 : 1;

    // 将之前的 is_current 全部置为 false
    await DocumentVersion.update({ is_current: false }, { where: { document_id: doc.id } });

    const version = await DocumentVersion.create({
      id: uuidv4(),
      document_id: doc.id,
      user_id: req.userId,
      version_number: nextVersion,
      content: req.body.content || doc.content,
      summary: req.body.summary || '',
      is_current: true,
      created_at: new Date(),
    });
    res.json({ message: '版本保存成功！', code: '200', version: version.toDict() });
  } catch (e) {
    res.status(500).json({ message: `保存失败: ${e.message}`, code: '500' });
  }
};

// PUT /document/versions/:id/restore  (恢复到某版本)
exports.restoreDocumentVersion = async (req, res) => {
  try {
    const { version_id } = req.body;
    const version = await DocumentVersion.findByPk(version_id);
    if (!version) return res.json({ message: '版本不存在！', code: '404' });

    const doc = await Document.findOne({ where: { id: req.params.id, user_id: req.userId } });
    if (!doc) return res.json({ message: '文档不存在！', code: '404' });

    await doc.update({ content: version.content, updated_at: new Date() });
    res.json({ message: '版本恢复成功！', code: '200' });
  } catch (e) {
    res.status(500).json({ message: `恢复失败: ${e.message}`, code: '500' });
  }
};

// DELETE /document/versions/:id/:verId
exports.deleteDocumentVersion = async (req, res) => {
  try {
    const version = await DocumentVersion.findOne({
      where: { id: req.params.verId, document_id: req.params.id },
    });
    if (!version) return res.json({ message: '版本不存在！', code: '404' });
    await version.destroy();
    res.json({ message: '版本删除成功！', code: '200' });
  } catch (e) {
    res.status(500).json({ message: `删除失败: ${e.message}`, code: '500' });
  }
};