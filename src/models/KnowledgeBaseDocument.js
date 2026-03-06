const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const KnowledgeBaseDocument = sequelize.define('knowledge_base_documents', {
  knowledge_base_id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
  // ★ document_id 跟随 Document.id 改为 STRING(36)
  document_id: { type: DataTypes.STRING(36), primaryKey: true, allowNull: false },
  added_by_user_id: { type: DataTypes.INTEGER, allowNull: false },
  added_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
}, { tableName: 'knowledge_base_documents', timestamps: false });

module.exports = KnowledgeBaseDocument;