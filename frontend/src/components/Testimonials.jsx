import React, { useState } from 'react';
import './Testimonials.css';

const REVIEWS = [
  { name: 'Nguyễn Thị Mai', role: 'Khách hàng cá nhân', text: 'Đặt xe lúc 3 giờ sáng ra sân bay, tài xế đến đúng 5 phút. Xe sạch, lái xe rất lịch sự. Sẽ dùng lâu dài!', stars: 5 },
  { name: 'Trần Văn Hùng', role: 'Giám đốc Cty TNHH Phú Cường', text: 'Hợp đồng đưa đón nhân viên 2 năm qua rất hài lòng. Hóa đơn VAT nhanh, quản lý công nợ gọn gàng. Recommend!', stars: 5 },
  { name: 'Lê Thị Ánh', role: 'Khách du lịch từ TP.HCM', text: 'Về thăm núi Bà Đen, thuê xe 7 chỗ cả ngày. Tài xế biết rõ từng điểm tham quan, rất tận tình. Giá hợp lý.', stars: 5 },
  { name: 'Phạm Quốc Dũng', role: 'Nhân viên công tác', text: 'Chạy tuyến Tây Ninh – Bình Dương 2 lần/tuần. Đặt hôm trước xe đến đúng giờ, không lo trễ họp.', stars: 5 },
  { name: 'Võ Thị Thu', role: 'Chủ tiệm áo cưới', text: 'Thuê xe cưới hãng này cho chị gái. Xe sạch đẹp, tài xế mặc đồ tươm tất. Khách mời khen nhiều lắm!', stars: 5 },
  { name: 'Nguyễn Minh Tú', role: 'Kỹ sư xây dựng', text: 'Công trình xa trung tâm, hay gọi taxi đi lại. Hãng này ổn nhất vùng — đúng giờ, giá cước không ép.', stars: 5 },
];

export default function Testimonials() {
  const [start, setStart] = useState(0);
  const visible = REVIEWS.slice(start, start + 3);

  return (
    <section className="section section--alt">
      <div className="container">
        <div className="section-label">Đánh giá</div>
        <h2 className="section-title">Khách hàng nói gì về chúng tôi</h2>
        <p className="section-sub" style={{ marginBottom: 40 }}>
          Hơn 10.000 lượt đánh giá 5 sao trên Google và Zalo.
        </p>
        <div className="grid-3" style={{ marginBottom: 24 }}>
          {visible.map((r, i) => (
            <div key={i} className="review-card card">
              <div className="review-card__stars">{'★'.repeat(r.stars)}</div>
              <p className="review-card__text">"{r.text}"</p>
              <div className="review-card__author">
                <div className="review-card__avatar">{r.name[0]}</div>
                <div>
                  <div className="review-card__name">{r.name}</div>
                  <div className="review-card__role">{r.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="testi__nav">
          <button className="testi__btn" disabled={start === 0} onClick={() => setStart(s => Math.max(0, s - 3))}>←</button>
          <span>{Math.floor(start / 3) + 1} / {Math.ceil(REVIEWS.length / 3)}</span>
          <button className="testi__btn" disabled={start + 3 >= REVIEWS.length} onClick={() => setStart(s => Math.min(REVIEWS.length - 3, s + 3))}>→</button>
        </div>
      </div>
    </section>
  );
}
