# smrt-backend-node

妙笔富文本知识库系统后端 —— Node.js 重写版（原 Python/Flask → Node.js/Express + Y.js）

## 技术栈

| 模块     | 技术                    |
| -------- | ----------------------- |
| Web 框架 | Express 4               |
| ORM      | Sequelize 6 + MySQL2    |
| 缓存     | ioredis                 |
| 认证     | jsonwebtoken + bcryptjs |
| 邮件     | Nodemailer              |
| 协同编辑 | **Y.js + y-websocket**  |
| 容器化   | Docker + docker-compose |

## 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 配置环境变量
cp .env.example .env
# 编辑 .env 填入 MySQL / Redis / 邮件等配置

# 3. 初始化数据库
npm run init-db

# 4. 创建默认用户
npm run seed

# 5. 启动开发服务器
npm run dev
```

## Y.js 协同编辑接入

前端 WebSocket 地址：

```
ws://localhost:5000/collaboration/yjs/<documentId>
```

Tiptap 示例：

```js
import { HocuspocusProvider } from "@hocuspocus/provider";
// 或直接使用 y-websocket
import { WebsocketProvider } from "y-websocket";
const provider = new WebsocketProvider(
  "ws://localhost:5000/collaboration/yjs",
  documentId,
  ydoc
);
```

## API 路由总览

| 前缀                                | 说明                                      |
| ----------------------------------- | ----------------------------------------- |
| `POST /auth/login`                  | 用户登录                                  |
| `POST /auth/register`               | 用户注册                                  |
| `/document/*`                       | 文档 CRUD、收藏、回收站、模板、分享、版本 |
| `/document/comment/*`               | 评论增删查                                |
| `/function/*`                       | OCR / ASR / AI 写作辅助                   |
| `/knowledge_base/*`                 | 知识库管理 + 最近访问                     |
| `/collaboration/test`               | WebSocket 测试页面                        |
| `ws://.../collaboration/yjs/:docId` | Y.js 协同编辑                             |
