const axios = require('axios');
const config = require('../config');

// POST /function/ocr
exports.ocr = async (req, res) => {
  if (!req.file) return res.json({ message: '无文件上传!', code: 400 });
  const imageBase64 = req.file.buffer.toString('base64');
  try {
    const resp = await axios.post(config.ai.ocrApiUrl, { image: imageBase64 }, {
      headers: {
        Authorization: `token ${config.ai.accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    let result = '';
    for (const t of resp.data.result.texts) result += t.text + '\n';
    res.json({ message: result, code: 200 });
  } catch (e) {
    res.json({ message: '后端小模型OCR服务未启动！', code: 400 });
  }
};

// POST /function/asr
exports.asr = async (req, res) => {
  if (!req.file) return res.json({ message: '无文件上传!', code: 400 });
  // ASR 服务占位（对应原 Python 的 sleep(1.33) + 未实现）
  await new Promise(r => setTimeout(r, 1330));
  res.json({ message: '后端小模型ASR服务未启动！', code: 400 });
};

// POST /function/AIFunc  (SiliconFlow 流式 SSE)
exports.aiFunc = async (req, res) => {
  const { command, text } = req.body;
  const prompt = buildPrompt(command, text, req.body);

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    const response = await axios.post(
      config.ai.siliconflowBaseUrl,
      {
        model: 'Qwen/Qwen2.5-7B-Instruct',
        messages: [{ role: 'user', content: prompt }],
        stream: true,
        max_tokens: 2048,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${config.ai.siliconflowApiKey}`,
          'Content-Type': 'application/json',
        },
        responseType: 'stream',
      }
    );

    response.data.on('data', (chunk) => {
      const lines = chunk.toString().split('\n').filter(Boolean);
      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const data = line.slice(6).trim();
        if (data === '[DONE]') { res.end(); return; }
        try {
          const json = JSON.parse(data);
          const content = json.choices?.[0]?.delta?.content || '';
          if (content) res.write(content);
        } catch (_) { }
      }
    });
    response.data.on('end', () => res.end());
    response.data.on('error', () => res.end());
  } catch (e) {
    res.write(`处理请求时发生错误: ${e.message}`);
    res.end();
  }
};

// POST /function/chatglm  (非流式)
exports.chatglm = async (req, res) => {
  if (!config.ai.chatglmApiKey)
    return res.json({ message: 'ChatGLM API 密钥未配置', code: 400 });

  const { messages = [], model = 'glm-4-flash', temperature = 0.7, top_p = 0.9, max_tokens = 1024 } = req.body;
  try {
    const resp = await axios.post(
      config.ai.chatglmApiUrl,
      { model, messages, temperature, top_p, max_tokens },
      { headers: { Authorization: `Bearer ${config.ai.chatglmApiKey}`, 'Content-Type': 'application/json' } }
    );
    const aiMsg = resp.data?.choices?.[0]?.message?.content || '';
    res.json({ message: aiMsg, code: 200 });
  } catch (e) {
    res.json({ message: `调用 ChatGLM API 失败: ${e.message}`, code: 500 });
  }
};

// POST /function/chatglm/stream  (流式 SSE)
exports.chatglmStream = async (req, res) => {
  if (!config.ai.chatglmApiKey)
    return res.json({ message: 'ChatGLM API 密钥未配置', code: 400 });

  const { messages = [], model = 'glm-4-flash', temperature = 0.7, top_p = 0.9, max_tokens = 1024 } = req.body;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    const response = await axios.post(
      config.ai.chatglmApiUrl,
      { model, messages, temperature, top_p, max_tokens, stream: true },
      {
        headers: { Authorization: `Bearer ${config.ai.chatglmApiKey}`, 'Content-Type': 'application/json' },
        responseType: 'stream',
      }
    );

    response.data.on('data', (chunk) => {
      const lines = chunk.toString().split('\n').filter(Boolean);
      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const data = line.slice(6).trim();
        if (data === '[DONE]') { res.end(); return; }
        try {
          const json = JSON.parse(data);
          const content = json.choices?.[0]?.delta?.content || '';
          if (content) res.write(content);
        } catch (_) { }
      }
    });
    response.data.on('end', () => res.end());
    response.data.on('error', () => res.end());
  } catch (e) {
    res.write(`错误: ${e.message}`);
    res.end();
  }
};

// ── 内部辅助：构建 AI Prompt（对应原 build_prompt）──────────
function buildPrompt(command, text, data) {
  const promptMap = {
    'polish': `请对以下文本进行润色，使其更加流畅自然：\n\n${text}`,
    'translate': `请将以下文本翻译成${data.target_lang || '英文'}：\n\n${text}`,
    'summarize': `请对以下文本进行摘要总结：\n\n${text}`,
    'expand': `请对以下文本进行扩写，丰富内容：\n\n${text}`,
    'fix_grammar': `请修正以下文本中的语法错误：\n\n${text}`,
    'simplify': `请简化以下文本，使其更易理解：\n\n${text}`,
  };
  return promptMap[command] || `${command}：\n\n${text}`;
}