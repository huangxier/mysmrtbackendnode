const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const DocumentAccess = sequelize.define('document_accesses', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  // ★ document_id 跟随 Document.id 改为 STRING(36)
  document_id: { type: DataTypes.STRING(36), allowNull: false },
  document_title: { type: DataTypes.STRING(64), allowNull: false },
  accessed_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
}, { tableName: 'document_accesses', timestamps: false });

module.exports = DocumentAccess;