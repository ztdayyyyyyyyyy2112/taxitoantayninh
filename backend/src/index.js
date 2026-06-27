const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const express = require('express');
const cors = require('cors');
const { createDatabase, initializeDatabase } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;
const ADMIN_USER = process.env.ADMIN_USER || 'taxitayninh12';
const ADMIN_PASS = process.env.ADMIN_PASS || 'Taxi@001133';
const adminSessions = new Set();
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://taxitoantayninh.vercel.app',
  'https://www.taxitoantayninh.vercel.app',
  process.env.CORS_ORIGIN,
].filter(Boolean);
const isAllowedOrigin = origin => {
  if (!origin) return true;
  if (allowedOrigins.includes(origin)) return true;
  return /^https:\/\/.*\.vercel\.app$/i.test(origin);
};

const createAdminToken = () => crypto.randomBytes(24).toString('hex');

const requireAdminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
  if (!token || !adminSessions.has(token)) {
    return res.status(401).json({ success: false, message: 'Unauthorized access. Please login as admin.' });
  }
  next();
};

app.use(cors({
  origin: (origin, callback) => {
    if (isAllowedOrigin(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false,
}));
app.options('*', cors());
app.use(express.json());

const db = createDatabase();
initializeDatabase(db);

// ─── In-memory store for demo ─────────────────────────────────────
const bookings = [];
const contacts = [];
const partners = [];
const recruitments = [];

// ─── Routes ───────────────────────────────────────────────────────

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Taxi Tây Ninh API đang hoạt động' });
});

// GET /api/configuration - Website configuration for frontend
app.get('/api/configuration', (req, res) => {
  db.all(
    "SELECT key, value FROM configurations WHERE key IN ('phone','email')",
    (err, rows) => {
      if (err) {
        console.error('[CONFIG] GET error', err);
        return res.status(500).json({ success: false, message: 'Lỗi khi tải cấu hình trang web.' });
      }
      const data = rows.reduce((acc, row) => {
        acc[row.key] = row.value;
        return acc;
      }, {});
      res.json({ success: true, data });
    }
  );
});

// GET /api/admin/configuration - Admin-only website configuration
app.get('/api/admin/configuration', requireAdminAuth, (req, res) => {
  db.all(
    "SELECT key, value FROM configurations WHERE key IN ('phone','email')",
    (err, rows) => {
      if (err) {
        console.error('[ADMIN CONFIG] GET error', err);
        return res.status(500).json({ success: false, message: 'Lỗi khi tải cấu hình quản trị.' });
      }
      const data = rows.reduce((acc, row) => {
        acc[row.key] = row.value;
        return acc;
      }, {});
      res.json({ success: true, data });
    }
  );
});

// PATCH /api/admin/configuration - Update website configuration
app.patch('/api/admin/configuration', requireAdminAuth, (req, res) => {
  const { phone, email } = req.body;
  if (!phone || !email) {
    return res.status(400).json({ success: false, message: 'Vui lòng cung cấp đầy đủ thông tin cấu hình.' });
  }

  const now = new Date().toISOString();
  const updates = [
    { key: 'phone', value: phone.trim() },
    { key: 'email', value: email.trim() },
  ];

  const query = `INSERT INTO configurations (key, value, updated_at) VALUES (?, ?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`;

  const runNextUpdate = index => {
    if (index >= updates.length) {
      return res.json({ success: true, message: 'Cập nhật cấu hình thành công.' });
    }

    const item = updates[index];
    db.run(query, [item.key, item.value, now], err => {
      if (err) {
        console.error('[ADMIN CONFIG] PATCH error', err);
        return res.status(500).json({ success: false, message: 'Lỗi khi cập nhật cấu hình.' });
      }
      runNextUpdate(index + 1);
    });
  };

  runNextUpdate(0);
});

// POST /api/admin/login - Admin login for dashboard access
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Vui lòng điền tài khoản và mật khẩu.' });
  }

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const token = createAdminToken();
    adminSessions.add(token);
    setTimeout(() => adminSessions.delete(token), 1000 * 60 * 60);
    return res.json({ success: true, message: 'Đăng nhập thành công.', token });
  }

  res.status(401).json({ success: false, message: 'Tài khoản hoặc mật khẩu không đúng.' });
});

// GET /api/reviews - Danh sách đánh giá công khai
app.get('/api/reviews', (req, res) => {
  db.all(
    'SELECT id, name, role, text, stars, created_at FROM reviews WHERE is_visible = 1 ORDER BY created_at DESC',
    (err, rows) => {
      if (err) {
        console.error('[REVIEWS] GET error', err);
        return res.status(500).json({ success: false, message: 'Lỗi khi tải đánh giá.' });
      }
      res.json({ success: true, data: rows });
    }
  );
});

// GET /api/admin/reviews - Danh sách toàn bộ đánh giá cho admin
app.get('/api/admin/reviews', requireAdminAuth, (req, res) => {
  db.all(
    'SELECT id, name, role, text, stars, is_visible, created_at FROM reviews ORDER BY created_at DESC',
    (err, rows) => {
      if (err) {
        console.error('[ADMIN REVIEWS] GET error', err);
        return res.status(500).json({ success: false, message: 'Lỗi khi tải danh sách đánh giá.' });
      }
      res.json({ success: true, data: rows });
    }
  );
});

// PATCH /api/admin/reviews/:id/visibility - Toggle visibility for a review
app.patch('/api/admin/reviews/:id/visibility', requireAdminAuth, (req, res) => {
  const reviewId = Number(req.params.id);
  if (!Number.isInteger(reviewId) || reviewId <= 0) {
    return res.status(400).json({ success: false, message: 'ID đánh giá không hợp lệ.' });
  }

  db.run(
    'UPDATE reviews SET is_visible = CASE WHEN is_visible = 1 THEN 0 ELSE 1 END WHERE id = ?',
    [reviewId],
    function (err) {
      if (err) {
        console.error('[ADMIN REVIEWS] PATCH visibility error', err);
        return res.status(500).json({ success: false, message: 'Không thể đổi trạng thái hiển thị.' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy đánh giá.' });
      }
      db.get('SELECT id, is_visible FROM reviews WHERE id = ?', [reviewId], (selectErr, row) => {
        if (selectErr) {
          console.error('[ADMIN REVIEWS] SELECT after toggle error', selectErr);
          return res.status(500).json({ success: false, message: 'Đã đổi trạng thái nhưng không đọc được dữ liệu mới.' });
        }
        res.json({ success: true, message: 'Đã đổi trạng thái hiển thị.', data: row });
      });
    }
  );
});

// DELETE /api/admin/reviews/:id - Permanently delete a review
app.delete('/api/admin/reviews/:id', requireAdminAuth, (req, res) => {
  const reviewId = Number(req.params.id);
  if (!Number.isInteger(reviewId) || reviewId <= 0) {
    return res.status(400).json({ success: false, message: 'ID đánh giá không hợp lệ.' });
  }

  db.run('DELETE FROM reviews WHERE id = ?', [reviewId], function (err) {
    if (err) {
      console.error('[ADMIN REVIEWS] DELETE error', err);
      return res.status(500).json({ success: false, message: 'Không thể xóa đánh giá.' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đánh giá.' });
    }
    res.json({ success: true, message: 'Đã xóa đánh giá khỏi database.' });
  });
});

// POST /api/reviews - Gửi đánh giá mới
app.post('/api/reviews', (req, res) => {
  const { name, role, text, stars } = req.body;
  if (!name || !text) {
    return res.status(400).json({ success: false, message: 'Vui lòng điền họ tên và nội dung đánh giá.' });
  }

  let rating = Number(stars);
  if (Number.isNaN(rating) || rating < 1 || rating > 5) {
    rating = 5;
  }

  db.run(
    'INSERT INTO reviews (name, role, text, stars, is_visible) VALUES (?, ?, ?, ?, 1)',
    [name.trim(), (role || 'Khách hàng').trim(), text.trim(), rating],
    function (err) {
      if (err) {
        console.error('[REVIEWS] POST error', err);
        return res.status(500).json({ success: false, message: 'Lỗi khi lưu đánh giá.' });
      }
      res.json({ success: true, message: 'Cảm ơn bạn đã gửi đánh giá!', reviewId: this.lastID });
    }
  );
});

// POST /api/booking - Đặt xe
app.post('/api/booking', (req, res) => {
  const { pickup, destination, datetime, carType, name, phone, note } = req.body;
  if (!pickup || !destination || !name || !phone) {
    return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ thông tin bắt buộc.' });
  }
  const booking = {
    id: `BK${Date.now()}`,
    pickup,
    destination,
    datetime: datetime || new Date().toISOString(),
    carType: carType || '4 chỗ',
    name,
    phone,
    note: note || '',
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  bookings.push(booking);
  console.log('[BOOKING]', booking);
  res.json({
    success: true,
    message: `Đặt xe thành công! Mã chuyến: ${booking.id}. Chúng tôi sẽ liên hệ bạn trong vài phút.`,
    bookingId: booking.id,
  });
});

// GET /api/bookings - Danh sách đặt xe (admin demo)
app.get('/api/bookings', (req, res) => {
  res.json({ success: true, data: bookings });
});

// POST /api/contact - Gửi liên hệ / khiếu nại
app.post('/api/contact', (req, res) => {
  const { name, phone, email, subject, message } = req.body;
  if (!name || !message) {
    return res.status(400).json({ success: false, message: 'Tên và nội dung là bắt buộc.' });
  }
  const contact = { id: `CT${Date.now()}`, name, phone, email, subject, message, createdAt: new Date().toISOString() };
  contacts.push(contact);
  console.log('[CONTACT]', contact);
  res.json({ success: true, message: 'Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong 24 giờ.' });
});

// POST /api/partner - Đăng ký đối tác doanh nghiệp
app.post('/api/partner', (req, res) => {
  const { company, contactName, phone, email, employees, note } = req.body;
  if (!company || !contactName || !phone) {
    return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ thông tin.' });
  }
  const partner = { id: `PT${Date.now()}`, company, contactName, phone, email, employees, note, createdAt: new Date().toISOString() };
  partners.push(partner);
  console.log('[PARTNER]', partner);
  res.json({ success: true, message: 'Đăng ký đối tác thành công! Phòng kinh doanh sẽ liên hệ trong 1-2 ngày làm việc.' });
});

// POST /api/recruitment - Đăng ký tài xế
app.post('/api/recruitment', (req, res) => {
  const { name, phone, licenseType, hasOwnCar, experience, note } = req.body;
  if (!name || !phone || !licenseType) {
    return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ thông tin.' });
  }
  const record = { id: `RCT${Date.now()}`, name, phone, licenseType, hasOwnCar, experience, note, createdAt: new Date().toISOString() };
  recruitments.push(record);
  console.log('[RECRUITMENT]', record);
  res.json({ success: true, message: 'Hồ sơ của bạn đã được tiếp nhận! HR sẽ liên hệ trong 3 ngày làm việc.' });
});

// POST /api/estimate - Ước tính giá cước
app.post('/api/estimate', (req, res) => {
  const { carType, distanceKm } = req.body;
  if (!distanceKm || isNaN(distanceKm)) {
    return res.status(400).json({ success: false, message: 'Vui lòng nhập khoảng cách hợp lệ.' });
  }
  const km = parseFloat(distanceKm);
  const rates = { '4 chỗ': { open: 12000, perKm: 14500 }, '7 chỗ': { open: 15000, perKm: 16500 }, 'Limousine': { open: 20000, perKm: 22000 } };
  const rate = rates[carType] || rates['4 chỗ'];
  const estimate = Math.round(rate.open + km * rate.perKm);
  res.json({
    success: true,
    carType: carType || '4 chỗ',
    distanceKm: km,
    estimatedPrice: estimate,
    formatted: estimate.toLocaleString('vi-VN') + ' VNĐ',
  });
});

app.listen(PORT, () => {
  console.log(`✅ Taxi Tây Ninh API chạy tại http://localhost:${PORT}`);
});
