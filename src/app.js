const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./routes/index');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// 中间件
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// 健康检查
app.get('/', (req, res) => res.json({ message: '妙笔后端服务运行中', status: 'ok' }));

// 注册所有路由
app.use(routes);

// 全局错误处理
app.use(errorHandler);

module.exports = app;