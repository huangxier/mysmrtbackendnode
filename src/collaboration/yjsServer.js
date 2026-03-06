const { WebSocketServer } = require('ws');
const { setupWSConnection } = require('y-websocket/bin/utils');

/**
 * 将 Y.js WebSocket 服务器挂载到已有的 HTTP 服务器上。
 * 客户端连接路径: ws://host:port/collaboration/yjs/<documentId>
 * 对应原 Python 的 SocketIO document_operation / join_document 等事件。
 */
function setupYjsServer(httpServer) {
  const wss = new WebSocketServer({ noServer: true });

  wss.on('connection', (ws, req) => {
    // 从 URL path 中提取 docName（如 /collaboration/yjs/123 -> "123"）
    const docName = (req.url || '/').split('/').filter(Boolean).pop() || 'default';
    console.log(`[YJS] 客户端连接文档: ${docName}`);
    setupWSConnection(ws, req, { docName });
  });

  // Upgrade 请求路由：只处理 /collaboration/yjs/* 路径
  httpServer.on('upgrade', (request, socket, head) => {
    if (request.url && request.url.startsWith('/collaboration/yjs/')) {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    } else {
      socket.destroy();
    }
  });

  console.log('[YJS] Y.js WebSocket 服务器已挂载 (path: /collaboration/yjs/:docId)');
  return wss;
}

module.exports = { setupYjsServer };