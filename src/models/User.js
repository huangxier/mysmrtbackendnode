const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('users', {
  id:            { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username:      { type: DataTypes.STRING(32), unique: true, allowNull: false },
  password_hash: { type: DataTypes.STRING(256), allowNull: false },
  email:         { type: DataTypes.STRING(64), unique: true, allowNull: false },
}, { tableName: 'users', timestamps: false });

// 实例方法（对应 set_password / check_password）
User.prototype.setPassword = async function (password) {
  this.password_hash = await bcrypt.hash(password, 12);
};
User.prototype.checkPassword = async function (password) {
  return bcrypt.compare(password, this.password_hash);
};

module.exports = User;