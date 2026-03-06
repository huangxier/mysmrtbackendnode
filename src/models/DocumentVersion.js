const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const DocumentVersion = sequelize.define('document_versions', {
  id: { type: DataTypes.STRING(36), primaryKey: true, defaultValue: () => uuidv4() },
  // ★ document_id 跟随 Document.id 改为 STRING(36)
  document_id: { type: DataTypes.STRING(36), allowNull: false },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  version_number: { type: DataTypes.INTEGER, allowNull: false },
  content: { type: DataTypes.TEXT('medium'), allowNull: false },
  summary: { type: DataTypes.STRING(255), defaultValue: '' },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  is_current: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
  tableName: 'document_versions',
  timestamps: false,
  indexes: [{ unique: true, fields: ['document_id', 'version_number'] }],
});

DocumentVersion.prototype.toDict = function () {
  return {
    id: this.id,
    document_id: this.document_id,
    user_id: this.user_id,
    version_number: this.version_number,
    content: this.content,
    summary: this.summary,
    created_at: this.created_at ? this.created_at.toISOString() : null,
    is_current: this.is_current,
  };
};

module.exports = DocumentVersion;