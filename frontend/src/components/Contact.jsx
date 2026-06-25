import React from 'react';
import './Contact.css';

export default function Contact() {
  return (
    <section id="contact" className="section section--alt">
      <div className="container">
        <div className="section-label">Liên hệ</div>
        <h2 className="section-title">Hỗ trợ & Khiếu nại</h2>
        <p className="section-sub" style={{ marginBottom: 16 }}>Liên hệ trực tiếp qua hotline hoặc ghé thăm văn phòng để được hỗ trợ nhanh nhất.</p>
        <p className="section-sub" style={{ marginBottom: 40, maxWidth: 760 }}>
          Nếu bạn cần số điện thoại taxi Tây Ninh 24/7 để đặt xe nhanh, gọi taxi đưa đón sân bay Tây Ninh,
          hoặc yêu cầu xe đi tòa thánh Tây Ninh, hãy liên hệ ngay với chúng tôi để được hỗ trợ tức thì.
        </p>
        <div className="contact__inner">
          <div className="contact__info">
            <div className="contact__info-block">
              <h4>📞 Hotline đặt xe</h4>
              <a href="tel:0329537532" className="contact__hotline">0329 537 532</a>
              <a href="tel:0978202606" className="contact__hotline">0978 202 606</a>
              <p>Hoạt động 24/7 · hỗ trợ đặt xe tức thì</p>
            </div>
            <div className="contact__info-block">
              <h4>📞 Khiếu nại & phản hồi</h4>
              <a href="tel:0329537532" className="contact__hotline contact__hotline--small">0329 537 532</a>
              <a href="tel:0978202606" className="contact__hotline contact__hotline--small">0978 202 606</a>
              <p>Thứ 2 – Thứ 7 · 7:00 – 21:00</p>
            </div>
            <div className="contact__info-block">
              <h4>✉️ Email</h4>
              <p>Đang cập nhật</p>
            </div>
            <div className="contact__info-block">
              <h4>📍 Văn phòng chính</h4>
              <p>Đang cập nhật</p>
            </div>
          </div>

          <div className="contact__panel card">
            <div className="contact__panel-header">
              <h3>Chăm sóc khách hàng</h3>
              <p>Taxi Tây Ninh luôn sẵn sàng hỗ trợ bạn về đặt xe, thay đổi chuyến, và xử lý khiếu nại.</p>
            </div>
            <div className="contact__panel-body">
              <div className="contact__service-item">
                <span>01</span>
                <div>
                  <h4>Đặt xe nhanh</h4>
                  <p>Gọi ngay hotline để được hỗ trợ đặt chuyến trong vài phút.</p>
                </div>
              </div>
              <div className="contact__service-item">
                <span>02</span>
                <div>
                  <h4>Hỗ trợ phản hồi</h4>
                  <p>Chúng tôi tiếp nhận yêu cầu và giải quyết trong thời gian sớm nhất.</p>
                </div>
              </div>
              <div className="contact__service-item">
                <span>03</span>
                <div>
                  <h4>Đội ngũ tận tâm</h4>
                  <p>Luôn lắng nghe và hỗ trợ bạn với thái độ chuyên nghiệp.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
