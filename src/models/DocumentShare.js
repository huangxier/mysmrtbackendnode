const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const DocumentShare = sequelize.define('document_shares', {
  id: { type: DataTypes.STRING(36), primaryKey: true, defaultValue: () => uuidv4() },
  // ★ document_id 跟随 Document.id 改为 STRING(36)
  document_id: { type: DataTypes.STRING(36), allowNull: false },
  owner_id: { type: DataTypes.INTEGER, allowNull: false },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  share_token: { type: DataTypes.STRING(64), allowNull: false, defaultValue: () => uuidv4() },
}, { tableName: 'document_shares', timestamps: false });

DocumentShare.prototype.toDict = function () {
  return {
    id: this.id,
    document_id: this.document_id,
    owner_id: this.owner_id,
    created_at: this.created_at ? this.created_at.toISOString() : null,
    share_token: this.share_token,
    share_link: `/edit/${this.document_id}?share=${this.id}`,
  };
};

module.exports = DocumentShare;