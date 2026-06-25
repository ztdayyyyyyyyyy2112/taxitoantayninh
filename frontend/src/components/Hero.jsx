import React, { useState } from 'react';
import './Hero.css';

export default function Hero() {
  const [appModalOpen, setAppModalOpen] = useState(false);
  const [callModalOpen, setCallModalOpen] = useState(false);

  const openAppModal = e => {
    e.preventDefault();
    setAppModalOpen(true);
  };

  const closeAppModal = () => setAppModalOpen(false);
  const openCallModal = e => {
    e.preventDefault();
    setCallModalOpen(true);
  };
  const closeCallModal = () => setCallModalOpen(false);

  return (
    <section id="hero" className="hero">
      <div className="hero__bg" aria-hidden="true">
        <div className="hero__overlay" />
      </div>

      <div className="container hero__inner">
        <div className="hero__copy">
          <div className="hero__badge"> Phục vụ 24/7 — Taxi giá rẻ, nhanh chóng, an toàn toàn tỉnh Tây Ninh</div>
          <h1 className="hero__title">
            Taxi giá rẻ<br />
            <span className="hero__title-accent">nhanh chóng · an toàn · đúng giờ</span>
          </h1>
          <p className="hero__sub">
            Taxi Tây Ninh mang đến dịch vụ taxi giá rẻ Tây Ninh, taxi đưa đón sân bay Tây Ninh, taxi đi tòa thánh Tây Ninh
            và các chuyến nội tỉnh, liên tỉnh 24/7 với đội xe đời mới, tài xế chuyên nghiệp và báo giá minh bạch.
          </p>

          {/* Hotline CTA */}
          <div className="hero__hotline">
            <button type="button" className="btn btn-danger hero__call" onClick={openCallModal}>
              Gọi đặt xe ngay
            </button>
            <span className="hero__hotline-note">· Có xe trong vài phút</span>
          </div>

          {/* Trust badges */}
          <div className="hero__trust">
            <span> 100+ xe</span>
            <span> nhiều năm kinh nghiệm</span>
            <span> Bảo hiểm toàn chuyến</span>
          </div>
        </div>

        <div className="hero__content-card card">
          <div className="hero__content-card-header">
            🗓️ Đặt lịch trước
          </div>
          <div className="hero__content-card-body">
            <p>Đặt lịch trước để giữ chỗ và nhận hỗ trợ nhanh nhất cho chuyến đi của bạn.</p>
            <button type="button" className="btn btn-primary hero__content-card-btn" onClick={openCallModal}>
              Đặt lịch ngay
            </button>
          </div>
        </div>
      </div>

      {callModalOpen && (
        <div className="hero__app-modal" role="dialog" aria-modal="true" onClick={closeCallModal}>
          <div className="hero__app-modal-card" onClick={e => e.stopPropagation()}>
            <h3>Tính năng đặt trước đang cập nhật</h3>
            <p>Tính năng đặt trước đang cập nhật, hãy gọi hotline để đặt xe ngay.</p>
            <a href="tel:0329537532" className="hero__phone-link">📞 0329 537 532</a>
            <a href="tel:0978202606" className="hero__phone-link">📞 0978 202 606</a>
            <button type="button" className="btn btn-primary" onClick={closeCallModal}>Đóng</button>
          </div>
        </div>
      )}

      {appModalOpen && (
        <div className="hero__app-modal" role="dialog" aria-modal="true" onClick={closeAppModal}>
          <div className="hero__app-modal-card" onClick={e => e.stopPropagation()}>
            <div className="hero__app-modal-placeholder">
              <img
                src="https://i.pinimg.com/736x/16/ad/53/16ad53d782ae7f59b7ea4c605c34def4.jpg"
                alt="Chatbot buồn"
              />
            </div>
            <h3>Ứng dụng sắp ra mắt</h3>
            <p>Google Play và App Store sẽ sớm được mở cho khách hàng tải về.</p>
            <button type="button" className="btn btn-primary" onClick={closeAppModal}>Đóng</button>
          </div>
        </div>
      )}

      {/* Wave divider */}
      <div className="hero__wave" aria-hidden="true">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#fff" />
        </svg>
      </div>
    </section>
  );
}
