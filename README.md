#  Taxi Tây Ninh — Website 

Website quảng bá hãng taxi với đầy đủ tính năng frontend (React/JSX) và backend (Node.js/Express).

---

Cấu trúc dự án

```
taxi-taynin/
├── backend/          # Node.js + Express API
│   ├── src/index.js
│   └── package.json
├── frontend/         # React (JSX) UI
│   ├── public/
│   ├── src/
│   │   ├── components/   # Tất cả các section
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
└── README.md
```

---

Chạy dự án

1. Backend (cổng 5000)
```bash
cd backend
npm install
npm run dev        # hoặc npm start
```

2. Frontend (cổng 3000)
```bash
cd frontend
npm install
npm start
```


---

API Endpoints

| Method | Endpoint | Chức năng |
|--------|----------|-----------|
| GET | `/api/health` | Kiểm tra server |



---

Các tính năng đã có

-  **Hero** — Form đặt xe, hotline Click-to-Call, ước tính giá
-  **Dịch vụ** — 6 loại hình (nội thành, liên tỉnh, sân bay, theo giờ, cưới, doanh nghiệp)
-  **Đội xe** — 3 loại (4 chỗ, 7 chỗ, Limousine) với tính năng
-  **Bảng giá** — Giá đồng hồ + giá tuyến cố định theo từng loại xe
-  **Về chúng tôi** — Số liệu, cam kết USP
-  **Đánh giá** — 6 testimonials có phân trang
-  **FAQ** — 8 câu hỏi thường gặp (accordion)
-  **Đối tác** — Form đăng ký hợp tác doanh nghiệp
-  **Tuyển dụng** — Form nộp hồ sơ tài xế
-  **Liên hệ** — Form khiếu nại + thông tin liên hệ
-  **Footer** — Đầy đủ thông tin pháp lý, mạng xã hội

---

 Design

- **Màu chính:** Navy `#1A2B4A` + Vàng `#F5A623`
- **Font:** Baloo 2 (display) + Inter (body)
- **Responsive:** Mobile, tablet, desktop
- **Toast notifications** cho mọi hành động form

---

 Biến môi trường

Frontend: tạo file `.env` trong thư mục `frontend/`:
```
REACT_APP_API_URL=http://localhost:5000
```

---

 Ghi chú thông tin cần cập nhật

- [ ] Địa chỉ văn phòng thực tế
- [ ] MST và giấy phép kinh doanh vận tải
- [ ] Link Facebook Fanpage, Zalo OA thực tế
- [ ] Tích hợp Google Maps API
- [ ] Link App Store / Google Play
