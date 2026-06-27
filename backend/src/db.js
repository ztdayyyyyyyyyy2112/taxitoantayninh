const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

function createSqliteDatabase(dbPath) {
  const sqliteDb = new sqlite3.Database(dbPath, err => {
    if (err) {
      console.error('❌ Không thể mở database SQLite:', err);
    }
  });

  return {
    type: 'sqlite',
    run(query, params, callback) {
      if (typeof params === 'function') {
        callback = params;
        params = [];
      }
      sqliteDb.run(query, params || [], function (err) {
        if (callback) callback.call(this, err);
      });
    },
    get(query, params, callback) {
      if (typeof params === 'function') {
        callback = params;
        params = [];
      }
      sqliteDb.get(query, params || [], (err, row) => {
        if (callback) callback(err, row);
      });
    },
    all(query, params, callback) {
      if (typeof params === 'function') {
        callback = params;
        params = [];
      }
      sqliteDb.all(query, params || [], (err, rows) => {
        if (callback) callback(err, rows);
      });
    },
    close(callback) {
      sqliteDb.close(callback);
    },
  };
}

function createPostgresDatabase(connectionString) {
  const { Pool } = require('pg');
  const pool = new Pool({
    connectionString,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  const normalizeQuery = (query, params) => {
    const values = Array.isArray(params) ? params : [];
    let index = 0;
    const normalized = query.replace(/\?/g, () => {
      index += 1;
      return `$${index}`;
    });
    return { query: normalized, params: values };
  };

  return {
    type: 'postgres',
    run(query, params, callback) {
      if (typeof params === 'function') {
        callback = params;
        params = [];
      }
      const { query: normalizedQuery, params: normalizedParams } = normalizeQuery(query, params);
      pool.query(normalizedQuery, normalizedParams || [], (err, result) => {
        if (callback) callback.call({ changes: result?.rowCount || 0, lastID: result?.rows?.[0]?.id }, err);
      });
    },
    get(query, params, callback) {
      if (typeof params === 'function') {
        callback = params;
        params = [];
      }
      const { query: normalizedQuery, params: normalizedParams } = normalizeQuery(query, params);
      pool.query(normalizedQuery, normalizedParams || [], (err, result) => {
        if (callback) callback(err, result?.rows?.[0] || null);
      });
    },
    all(query, params, callback) {
      if (typeof params === 'function') {
        callback = params;
        params = [];
      }
      const { query: normalizedQuery, params: normalizedParams } = normalizeQuery(query, params);
      pool.query(normalizedQuery, normalizedParams || [], (err, result) => {
        if (callback) callback(err, result?.rows || []);
      });
    },
    close(callback) {
      pool.end(callback);
    },
  };
}

function createDatabase() {
  const databaseUrl = process.env.DATABASE_URL;
  const dataDir = process.env.DATA_DIR || path.resolve(__dirname, '../data');
  const dbPath = process.env.DATABASE_PATH || path.join(dataDir, 'reviews.db');

  fs.mkdirSync(path.dirname(dbPath), { recursive: true });

  if (databaseUrl) {
    console.log('✅ Sử dụng PostgreSQL từ DATABASE_URL');
    return createPostgresDatabase(databaseUrl);
  }

  console.log('✅ Sử dụng SQLite local tại', dbPath);
  return createSqliteDatabase(dbPath);
}

function initializeDatabase(db) {
  const defaultConfig = [
    { key: 'phone', value: '0329537532' },
    { key: 'email', value: 'huynhlong2410@gmail.com' },
  ];

  const sampleReviews = [
    { name: 'Nguyễn Thị Mai', role: 'Khách hàng cá nhân', text: 'Đặt xe lúc 3 giờ sáng ra sân bay, tài xế đến đúng 5 phút. Xe sạch, lái xe rất lịch sự. Sẽ dùng lâu dài!', stars: 5 },
    { name: 'Trần Văn Hùng', role: 'Giám đốc Cty TNHH Phú Cường', text: 'Hợp đồng đưa đón nhân viên 2 năm qua rất hài lòng. Hóa đơn VAT nhanh, quản lý công nợ gọn gàng. Recommend!', stars: 5 },
    { name: 'Lê Thị Ánh', role: 'Khách du lịch từ TP.HCM', text: 'Về thăm núi Bà Đen, thuê xe 7 chỗ cả ngày. Tài xế biết rõ từng điểm tham quan, rất tận tình. Giá hợp lý.', stars: 5 },
  ];

  const createTables = () => {
    const isPostgres = db.type === 'postgres';
    const createReviews = isPostgres ? `CREATE TABLE IF NOT EXISTS reviews (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      text TEXT NOT NULL,
      stars INTEGER NOT NULL DEFAULT 5,
      is_visible INTEGER NOT NULL DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )` : `CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      text TEXT NOT NULL,
      stars INTEGER NOT NULL DEFAULT 5,
      is_visible INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`;

    const createConfigurations = isPostgres ? `CREATE TABLE IF NOT EXISTS configurations (
      id SERIAL PRIMARY KEY,
      key TEXT NOT NULL UNIQUE,
      value TEXT NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )` : `CREATE TABLE IF NOT EXISTS configurations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT NOT NULL UNIQUE,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`;

    db.run(createReviews, () => {
      db.run(createConfigurations, err => {
        if (err) return console.error('❌ Không thể tạo bảng cấu hình:', err);
        seedData();
      });
    });
  };

  const seedData = () => {
    db.get('SELECT COUNT(*) AS count FROM configurations', (err, row) => {
      if (!err && row.count === 0) {
        const now = new Date().toISOString();
        defaultConfig.forEach(item => {
          db.run('INSERT INTO configurations (key, value, updated_at) VALUES (?, ?, ?)', [item.key, item.value, now]);
        });
      }
    });

    db.get('SELECT COUNT(*) AS count FROM reviews', (err, row) => {
      if (!err && row.count === 0) {
        sampleReviews.forEach(review => {
          db.run('INSERT INTO reviews (name, role, text, stars, is_visible) VALUES (?, ?, ?, ?, 1)', [review.name, review.role, review.text, review.stars]);
        });
      }
    });
  };

  createTables();
}

module.exports = { createDatabase, initializeDatabase };
