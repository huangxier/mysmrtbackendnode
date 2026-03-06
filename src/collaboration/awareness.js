/**
 * awareness.js
 *
 * Y.js 的 Awareness 协议由 y-websocket 原生处理，
 * 本文件提供业务层的辅助工具：解析感知状态、提取用户信息。
 *
 * 前端使用示例：
 *   import { Awareness } from 'y-protocols/awareness'
 *   awareness.setLocalStateField('user', { name: '张三', color: '#ff0000' })
 */

/**
 * 从 Y.js awareness states Map 中提取所有在线用户信息。
 * @param {Map} awarenessStates  —— awareness.getStates() 返回值
 * @returns {Array<{ clientId, name, color, cursor }>}
 */
function getOnlineUsers(awarenessStates) {
  const users = [];
  awarenessStates.forEach((state, clientId) => {
    if (state?.user) {
      users.push({
        clientId,
        name: state.user.name || '匿名用户',
        color: state.user.color || '#cccccc',
        cursor: state.cursor || null,
      });
    }
  });
  return users;
}

/**
 * 生成随机协作者颜色（避免颜色冲突）。
 */
function randomColor() {
  const colors = ['#f87171', '#fb923c', '#facc15', '#4ade80', '#34d399', '#38bdf8', '#818cf8', '#e879f9'];
  return colors[Math.floor(Math.random() * colors.length)];
}

module.exports = { getOnlineUsers, randomColor };