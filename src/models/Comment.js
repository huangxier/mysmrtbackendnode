const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Comment = sequelize.define('comments', {
  id: { type: DataTypes.STRING(36), primaryKey: true },
  // ★ document_id 跟随 Document.id 改为 STRING(36)
  document_id: { type: DataTypes.STRING(36), allowNull: false },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  text: { type: DataTypes.TEXT, allowNull: false },
  selected_text: { type: DataTypes.TEXT },
  range_from: { type: DataTypes.INTEGER, allowNull: false },
  range_to: { type: DataTypes.INTEGER, allowNull: false },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { tableName: 'comments', timestamps: false });

module.exports = Comment;