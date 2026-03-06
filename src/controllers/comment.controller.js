const { Comment, Document, User } = require('../models');

// POST /document/comment
exports.addComment = async (req, res) => {
  try {
    const user_id = req.userId;
    const data = req.body;

    // 必填字段校验
    for (const field of ['id', 'document_id', 'text', 'selected_text']) {
      if (!(field in data))
        return res.status(400).json({ message: `缺少必要字段: ${field}`, code: '400' });
    }

    // range 字段兼容两种格式：range_from/range_to 或 range.from/range.to
    const range_from = data.range_from ?? data?.range?.from;
    const range_to = data.range_to ?? data?.range?.to;
    if (range_from == null || range_to == null)
      return res.status(400).json({ message: '缺少必要字段: range_from/range_to 或 range.from/range.to', code: '400' });

    const doc = await Document.findByPk(data.document_id);
    if (!doc) return res.status(404).json({ message: '文档不存在', code: '404' });

    const comment = await Comment.create({
      id: data.id,
      document_id: data.document_id,
      user_id,
      text: data.text,
      selected_text: data.selected_text,
      range_from,
      range_to,
      created_at: new Date(),
      updated_at: new Date(),
    });

    const user = await User.findByPk(user_id);
    const result = {
      ...comment.toJSON(),
      range: { from: comment.range_from, to: comment.range_to },
      timestamp: comment.created_at,
      user: { id: user.id, name: user.username },
    };

    res.json({ message: '评论添加成功', comment: result, code: '200' });
  } catch (e) {
    res.status(500).json({ message: `添加评论失败: ${e.message}`, code: '500' });
  }
};

// GET /document/comment/document/:documentId
exports.getDocumentComments = async (req, res) => {
  try {
    const doc = await Document.findByPk(req.params.documentId);
    if (!doc) return res.status(404).json({ message: '文档不存在', code: '404' });

    const comments = await Comment.findAll({
      where: { document_id: req.params.documentId, is_deleted: false },
      order: [['created_at', 'ASC']],
    });

    const result = await Promise.all(comments.map(async (c) => {
      const user = await User.findByPk(c.user_id);
      return {
        ...c.toJSON(),
        range: { from: c.range_from, to: c.range_to },
        timestamp: c.created_at,
        user: { id: user.id, name: user.username },
      };
    }));

    res.json({ comments: result, code: '200' });
  } catch (e) {
    res.status(500).json({ message: `获取评论失败: ${e.message}`, code: '500' });
  }
};

// DELETE /document/comment/:commentId
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.commentId);
    if (!comment) return res.status(404).json({ message: '评论不存在', code: '404' });

    // 只有评论作者或文档所有者可以删除
    if (comment.user_id !== req.userId) {
      const doc = await Document.findByPk(comment.document_id);
      if (!doc || doc.user_id !== req.userId)
        return res.status(403).json({ message: '无权删除此评论', code: '403' });
    }

    await comment.update({ is_deleted: true });
    res.json({ message: '评论删除成功', code: '200' });
  } catch (e) {
    res.status(500).json({ message: `删除评论失败: ${e.message}`, code: '500' });
  }
};