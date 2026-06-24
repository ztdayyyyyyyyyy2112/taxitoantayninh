import React from 'react';
import './About.css';

const STATS = [
  { num: '8+', label: 'Năm kinh nghiệm' },
  { num: '100+', label: 'Xe' },
  { num: '100+', label: 'Tài xế chuyên nghiệp' },
  { num: '98%', label: 'Khách hàng hài lòng' },
];

const UPSPS = [
  { icon: '', title: 'Xe đời mới sạch sẽ', desc: 'Toàn bộ đội xe đời từ 2020, được khử mùi và vệ sinh sau mỗi ca chạy.' },
  { icon: '', title: 'Tài xế chuyên nghiệp', desc: 'Được đào tạo bài bản, thông thạo đường Tây Ninh, lịch sự và đúng giờ.' },
  { icon: '', title: 'Hoạt động 24/7', desc: 'Tổng đài và đội xe trực chiến 24/7, kể cả ngày lễ Tết.' },
  { icon: '', title: 'Giá không phát sinh', desc: 'Cam kết đúng giá báo. Không vòng vèo, không phụ thu ẩn.' },
  { icon: '', title: 'Bảo hiểm toàn chuyến', desc: 'Mỗi hành khách được bảo hiểm tai nạn cá nhân trong suốt hành trình.' },
  { icon: '', title: 'Hóa đơn VAT', desc: 'Xuất hóa đơn điện tử VAT cho doanh nghiệp ngay sau chuyến đi.' },
];

export default function About() {
  return (
    <section id="about" className="section">
      <div className="container">
        <div className="about__top">
          <div className="about__intro">
            <div className="section-label">Về chúng tôi</div>
            <h2 className="section-title">Hãng taxi uy tín số 1 tỉnh Tây Ninh</h2>
            <p style={{ color: '#5a6b82', lineHeight: 1.8, marginBottom: 20 }}>
              Thành lập đã nhiều năm, Taxi Tây Ninh xuất phát từ đội xe 20 chiếc phục vụ nội thành Tây Ninh.
              Sau hơn nhiều năm không ngừng phát triển, chúng tôi đã mở rộng lên 400+ phương tiện,
              phủ sóng toàn tỉnh Tây Ninh.
            </p>
            <p style={{ color: '#5a6b82', lineHeight: 1.8 }}>
              Với triết lý <em>"An toàn — Đúng giờ — Minh bạch"</em>, chúng tôi tự hào là lựa chọn tin cậy
              của hàng nghìn gia đình, doanh nghiệp và du khách đến Tây Ninh mỗi ngày.
            </p>
          </div>
          <div className="about__stats">
            {STATS.map((s, i) => (
              <div key={i} className="about__stat">
                <div className="about__stat-num">{s.num}</div>
                <div className="about__stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="about__usp-grid">
          {UPSPS.map((u, i) => (
            <div key={i} className="usp-item">
              <div className="usp-item__icon">{u.icon}</div>
              <div>
                <h4 className="usp-item__title">{u.title}</h4>
                <p className="usp-item__desc">{u.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
