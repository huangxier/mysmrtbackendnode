const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const Document = sequelize.define('documents', {
  id: {
    // ★ 改为 UUID 字符串，防止文档被枚举访问
    type: DataTypes.STRING(36),
    primaryKey: true,
    defaultValue: () => uuidv4(),
  },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  title: { type: DataTypes.STRING(64), allowNull: false },
  content: { type: DataTypes.TEXT('medium'), allowNull: false },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  is_favorite: { type: DataTypes.BOOLEAN, defaultValue: false },
  is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
  is_template: { type: DataTypes.BOOLEAN, defaultValue: false },
  category: { type: DataTypes.STRING(32), defaultValue: 'general' },
  word_count: { type: DataTypes.INTEGER, defaultValue: 0 },
}, { tableName: 'documents', timestamps: false });

Document.prototype.toDict = function () {
  return {
    id: this.id,
    user_id: this.user_id,
    title: this.title,
    content: this.content,
    created_at: this.created_at ? this.created_at.toISOString() : null,
    updated_at: this.updated_at ? this.updated_at.toISOString() : null,
    is_favorite: this.is_favorite,
    is_deleted: this.is_deleted,
    is_template: this.is_template,
    category: this.category,
    word_count: this.word_count,
  };
};

module.exports = Document;