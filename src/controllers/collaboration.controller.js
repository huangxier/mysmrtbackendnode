// GET /collaboration/test  —— WebSocket 测试页面（对应原 websocket_test.py）
exports.testPage = (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(`<!DOCTYPE html>
<html>
<head>
  <title>WebSocket & Y.js Test</title>
</head>
<body>
  <h1>Y.js WebSocket Connection Test</h1>
  <div>
    <label>文档ID: <input id="docId" value="example-document" /></label>
    <button onclick="connect()">连接</button>
    <button onclick="disconnect()">断开</button>
  </div>
  <div id="status" style="margin:10px 0;color:gray">未连接</div>
  <div id="messages" style="border:1px solid #ccc;padding:10px;min-height:100px;font-family:monospace"></div>

  <script>
    let ws = null;
    const status   = document.getElementById('status');
    const messages = document.getElementById('messages');

    function log(msg, color = 'black') {
      messages.innerHTML += '<p style="color:' + color + ';margin:2px 0">' + msg + '</p>';
    }

    function connect() {
      const docId = document.getElementById('docId').value.trim() || 'default';
      const url = 'ws://' + location.host + '/collaboration/yjs/' + docId;
      ws = new WebSocket(url);
      ws.binaryType = 'arraybuffer';
      ws.onopen    = () => { status.textContent = '已连接: ' + url; status.style.color = 'green'; log('✅ WebSocket 连接成功'); };
      ws.onclose   = () => { status.textContent = '已断开'; status.style.color = 'red';   log('❌ 连接已断开', 'red'); };
      ws.onerror   = (e) => log('���️ 连接错误: ' + e, 'orange');
      ws.onmessage = (e) => log('📥 收到二进制消息，字节数: ' + e.data.byteLength);
    }

    function disconnect() { if (ws) ws.close(); }
  </script>
</body>
</html>`);
};