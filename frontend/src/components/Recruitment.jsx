import React, { useState } from 'react';
import './Recruitment.css';

const PERKS = [
  { icon: '', title: 'Thu nhập đảm bảo ', desc: 'Chiết khấu cạnh tranh 70/30 doanh thu (tài xế/hãng). Ca linh hoạt.' },
  { icon: '', title: 'Điều phối thông minh', desc: 'Websie điều xe tự động, ưu tiên chuyến gần, tránh chờ đợi lâu.' },
  { icon: '', title: 'BHXH đầy đủ', desc: 'Ký hợp đồng lao động chính thức, BHXH + BHYT đầy đủ theo luật.' },
];

export default function Recruitment() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenNotice = () => setIsOpen(true);
  const handleCloseNotice = () => setIsOpen(false);

  return (
    <section id="recruitment" className="section recruit-section">
      <div className="container">
        <div className="section-label" style={{ color: 'rgba(245,166,35,.9)' }}>Tuyển dụng</div>
        <h2 className="section-title" style={{ color: '#fff' }}>Gia nhập đội ngũ tài xế</h2>
        <p style={{ color: 'rgba(255,255,255,.75)', marginBottom: 48, maxWidth: 520 }}>
          Chúng tôi đang tìm kiếm tài xế chuyên nghiệp, thân thiện. Thu nhập ổn định, môi trường làm việc tốt.
        </p>
        <div className="recruit__inner">
          <div>
            <div className="recruit__perks">
              {PERKS.map((p, i) => (
                <div key={i} className="recruit__perk">
                  <div className="recruit__perk-icon">{p.icon}</div>
                  <div>
                    <div className="recruit__perk-title">{p.title}</div>
                    <div className="recruit__perk-desc">{p.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="recruit__requirements">
              <h4> Yêu cầu cơ bản</h4>
              <ul>
                <li>✓ Bằng lái B2 trở lên (còn hiệu lực)</li>
                <li>✓ Tuổi 21–55</li>
                <li>✓ Lý lịch tư pháp sạch</li>
                <li>✓ Thông thạo đường Tây Ninh</li>
                <li>✓ Điện thoại thông minh</li>
              </ul>
            </div>
          </div>
          <div className="recruit__form card">
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--navy)', marginBottom: 20 }}>Nộp hồ sơ ngay</h3>
            <button type="button" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={handleOpenNotice}>
              Nộp hồ sơ
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="recruit__modal" role="dialog" aria-modal="true" onClick={handleCloseNotice}>
            <div className="recruit__modal-card" onClick={e => e.stopPropagation()}>
              <h3>Thông báo</h3>
              <p>Hiện chưa có thông tin tuyển dụng.</p>
              <button type="button" className="btn btn-primary" onClick={handleCloseNotice}>Đóng</button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
