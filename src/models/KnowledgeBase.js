const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const KnowledgeBase = sequelize.define('knowledge_bases', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  icon: {
    type: DataTypes.STRING(255),
    defaultValue: 'default_icon',
  },
  creator_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'knowledge_bases',
  timestamps: false,
});

module.exports = KnowledgeBase;