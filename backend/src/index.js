const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const dataDir = path.resolve(__dirname, '../data');
const dbPath = path.join(dataDir, 'reviews.db');
fs.mkdirSync(dataDir, { recursive: true });
const db = new sqlite3.Database(dbPath, err => {
  if (err) return console.error('❌ Không thể mở database:', err);
  console.log('✅ Database reviews đã sẵn sàng ở', dbPath);
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    text TEXT NOT NULL,
    stars INTEGER NOT NULL DEFAULT 5,
    is_visible INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`);

  db.get('SELECT COUNT(*) AS count FROM reviews', (err, row) => {
    if (!err && row.count === 0) {
      const sampleReviews = [
        { name: 'Nguyễn Thị Mai', role: 'Khách hàng cá nhân', text: 'Đặt xe lúc 3 giờ sáng ra sân bay, tài xế đến đúng 5 phút. Xe sạch, lái xe rất lịch sự. Sẽ dùng lâu dài!', stars: 5 },
        { name: 'Trần Văn Hùng', role: 'Giám đốc Cty TNHH Phú Cường', text: 'Hợp đồng đưa đón nhân viên 2 năm qua rất hài lòng. Hóa đơn VAT nhanh, quản lý công nợ gọn gàng. Recommend!', stars: 5 },
        { name: 'Lê Thị Ánh', role: 'Khách du lịch từ TP.HCM', text: 'Về thăm núi Bà Đen, thuê xe 7 chỗ cả ngày. Tài xế biết rõ từng điểm tham quan, rất tận tình. Giá hợp lý.', stars: 5 },
      ];
      const stmt = db.prepare('INSERT INTO reviews (name, role, text, stars, is_visible) VALUES (?, ?, ?, ?, 1)');
      sampleReviews.forEach(r => stmt.run(r.name, r.role, r.text, r.stars));
      stmt.finalize();
    }
  });
});

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
