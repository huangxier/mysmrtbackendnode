-- ★ 文档ID改UUID迁移脚本
-- 警告：此操作会清空并重建相关表，请先备份数据

USE smart_editor;

-- 删除有外键依赖的子表
DROP TABLE IF EXISTS document_accesses;
DROP TABLE IF EXISTS knowledge_base_documents;
DROP TABLE IF EXISTS document_shares;
DROP TABLE IF EXISTS document_versions;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS documents;

-- 重建 documents 表（id 改为 VARCHAR(36) UUID）
CREATE TABLE documents (
  id          VARCHAR(36)   NOT NULL PRIMARY KEY,
  user_id     INT           NOT NULL,
  title       VARCHAR(64)   NOT NULL,
  content     MEDIUMTEXT    NOT NULL,
  created_at  DATETIME      DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_favorite BOOLEAN       DEFAULT FALSE,
  is_deleted  BOOLEAN       DEFAULT FALSE,
  is_template BOOLEAN       DEFAULT FALSE,
  category    VARCHAR(32)   DEFAULT 'general',
  word_count  INT           DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_documents_user_id   ON documents(user_id);
CREATE INDEX idx_documents_is_deleted ON documents(is_deleted);
CREATE INDEX idx_documents_is_template ON documents(is_template);
CREATE INDEX idx_documents_is_favorite ON documents(is_favorite);

-- 重建 comments（document_id 改为 VARCHAR(36)）
CREATE TABLE comments (
  id            VARCHAR(36) NOT NULL PRIMARY KEY,
  document_id   VARCHAR(36) NOT NULL,
  user_id       INT         NOT NULL,
  text          TEXT        NOT NULL,
  selected_text TEXT,
  range_from    INT         NOT NULL,
  range_to      INT         NOT NULL,
  created_at    DATETIME    DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted    BOOLEAN     DEFAULT FALSE,
  FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 重建 document_versions（document_id 改为 VARCHAR(36)）
CREATE TABLE document_versions (
  id             VARCHAR(36)  NOT NULL PRIMARY KEY,
  document_id    VARCHAR(36)  NOT NULL,
  user_id        INT          NOT NULL,
  version_number INT          NOT NULL,
  content        MEDIUMTEXT   NOT NULL,
  summary        VARCHAR(255) DEFAULT '',
  created_at     DATETIME     DEFAULT CURRENT_TIMESTAMP,
  is_current     BOOLEAN      DEFAULT FALSE,
  FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_document_version (document_id, version_number)
);

-- 重建 document_shares（document_id 改为 VARCHAR(36)）
CREATE TABLE document_shares (
  id           VARCHAR(36) NOT NULL PRIMARY KEY,
  document_id  VARCHAR(36) NOT NULL,
  owner_id     INT         NOT NULL,
  created_at   DATETIME    DEFAULT CURRENT_TIMESTAMP,
  share_token  VARCHAR(64) NOT NULL,
  FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 重建 knowledge_base_documents（document_id 改为 VARCHAR(36)）
CREATE TABLE knowledge_base_documents (
  knowledge_base_id INT         NOT NULL,
  document_id       VARCHAR(36) NOT NULL,
  added_by_user_id  INT         NOT NULL,
  added_at          DATETIME    DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (knowledge_base_id, document_id),
  FOREIGN KEY (knowledge_base_id) REFERENCES knowledge_bases(id) ON DELETE CASCADE,
  FOREIGN KEY (document_id)       REFERENCES documents(id)        ON DELETE CASCADE,
  FOREIGN KEY (added_by_user_id)  REFERENCES users(id)            ON DELETE CASCADE
);

-- 重建 document_accesses（document_id 改为 VARCHAR(36)）
CREATE TABLE document_accesses (
  id             INT         NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id        INT         NOT NULL,
  document_id    VARCHAR(36) NOT NULL,
  document_title VARCHAR(64) NOT NULL,
  accessed_at    DATETIME    DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)     REFERENCES users(id)      ON DELETE CASCADE,
  FOREIGN KEY (document_id) REFERENCES documents(id)  ON DELETE CASCADE
);