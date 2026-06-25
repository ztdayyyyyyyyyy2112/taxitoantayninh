import React from 'react';
import './Pricing.css';

const QUOTE_ROWS = [
  {
    service: 'Xe 4 chỗ',
    detail: 'Phù hợp cho đi lại nội thành, tuyến ngắn và khách cá nhân.',
  },
  {
    service: 'Xe 7 chỗ',
    detail: 'Lý tưởng cho gia đình, nhóm nhỏ và hành lý vừa phải.',
  },
  {
    service: 'Limousine VIP',
    detail: 'Dành cho khách cao cấp, sân bay, công tác và chuyến cần sự thoải mái.',
  },
  {
    service: 'Đưa đón sân bay',
    detail: 'Đón trả tận cổng, hỗ trợ lịch trình và thời gian đặt xe.',
  },
  {
    service: 'Đưa đón bệnh viện',
    detail: 'Dành cho bệnh nhân và người nhà, đảm bảo thời gian và chuyến đi an toàn',
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="section section--alt">
      <div className="container">
        <div className="section-label">Báo giá</div>
        <h2 className="section-title">Liên hệ để nhận báo giá nhanh nhất</h2>
        <p className="section-sub" style={{ marginBottom: 32 }}>
          Chúng tôi không công khai giá cố định trên website. Quý khách chỉ cần liên hệ qua hotline/Zalo hoặc điền biểu mẫu phía trên để nhận báo giá ngay lập tức.
        </p>

        <div className="pricing__table">
          <div className="pricing__table-head">
            <span>Dịch vụ</span>
            <span>Thông tin</span>
          </div>
          {QUOTE_ROWS.map((row, i) => (
            <div key={i} className="pricing__table-row">
              <strong>{row.service}</strong>
              <span>{row.detail}</span>
            </div>
          ))}
        </div>

        <div className="pricing__contact-card">
          <h3>📞 Hotline </h3>
          <a href="tel:0329537532">0329.537.532</a>
          <a href="tel:0978202606">0978.202.606</a>         
          <p>Hoặc điền biểu mẫu phía trên để được đội ngũ liên hệ báo giá trong thời gian sớm nhất.</p>
        </div>
      </div>
    </section>
  );
}
