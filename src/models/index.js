const { sequelize } = require('../config/database');

// 导入所有模型
const User = require('./User');
const Document = require('./Document');
const DocumentVersion = require('./DocumentVersion');
const DocumentShare = require('./DocumentShare');
const Comment = require('./Comment');
const KnowledgeBase = require('./KnowledgeBase');
const KnowledgeBaseDocument = require('./KnowledgeBaseDocument');
const DocumentAccess = require('./DocumentAccess');

// ── 关联关系 ──────────────────────────────────────────────

// User <-> Document
User.hasMany(Document, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Document.belongsTo(User, { foreignKey: 'user_id' });

// Document <-> DocumentVersion
Document.hasMany(DocumentVersion, {
  foreignKey: 'document_id',
  onDelete: 'CASCADE',
  as: 'versions',
});
DocumentVersion.belongsTo(Document, { foreignKey: 'document_id' });
DocumentVersion.belongsTo(User, { foreignKey: 'user_id', as: 'author' });

// Document <-> DocumentShare
Document.hasMany(DocumentShare, {
  foreignKey: 'document_id',
  onDelete: 'CASCADE',
  as: 'shares',
});
DocumentShare.belongsTo(Document, { foreignKey: 'document_id' });
DocumentShare.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' });

// Document <-> Comment
Document.hasMany(Comment, { foreignKey: 'document_id', onDelete: 'CASCADE' });
Comment.belongsTo(Document, { foreignKey: 'document_id' });
Comment.belongsTo(User, { foreignKey: 'user_id', as: 'author' });

// User <-> KnowledgeBase
User.hasMany(KnowledgeBase, { foreignKey: 'creator_id', onDelete: 'CASCADE' });
KnowledgeBase.belongsTo(User, { foreignKey: 'creator_id', as: 'creator' });

// KnowledgeBase <-> Document (通过 KnowledgeBaseDocument 中间表)
KnowledgeBase.belongsToMany(Document, {
  through: KnowledgeBaseDocument,
  foreignKey: 'knowledge_base_id',
  otherKey: 'document_id',
  as: 'documents',
});
Document.belongsToMany(KnowledgeBase, {
  through: KnowledgeBaseDocument,
  foreignKey: 'document_id',
  otherKey: 'knowledge_base_id',
  as: 'knowledgeBases',
});
KnowledgeBaseDocument.belongsTo(User, { foreignKey: 'added_by_user_id', as: 'addedBy' });

// User <-> DocumentAccess
User.hasMany(DocumentAccess, { foreignKey: 'user_id', onDelete: 'CASCADE' });
DocumentAccess.belongsTo(User, { foreignKey: 'user_id' });
DocumentAccess.belongsTo(Document, { foreignKey: 'document_id' });

module.exports = {
  sequelize,
  User,
  Document,
  DocumentVersion,
  DocumentShare,
  Comment,
  KnowledgeBase,
  KnowledgeBaseDocument,
  DocumentAccess,
};