const nodemailer = require('nodemailer');
const config = require('../config');

const transporter = nodemailer.createTransport({
  host: config.mail.host,
  port: config.mail.port,
  secure: config.mail.secure,
  auth: { user: config.mail.user, pass: config.mail.pass },
});

exports.sendVerificationCode = async (username, email, code, type = '注册') => {
  const subject = type === '注册' ? '【妙笔】用户注册邮箱验证' : '【妙笔】用户密码重置';
  const text = `Hi，【${username}】：\n\n您正尝试通过本邮箱${type === '注册' ? '接收注册【妙笔】时所需' : '重置【妙笔】时所需'}的验证码。\n\n验证码：【${code}】，5分钟内有效，如非本人操作，请忽略本邮件。`;
  await transporter.sendMail({ from: config.mail.user, to: email, subject, text });
};