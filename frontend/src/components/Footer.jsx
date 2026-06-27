import React from 'react';
import { useWebsiteConfig } from '../contexts/WebsiteConfigContext';
import './Footer.css';

export default function Footer() {
  const { phone, formattedPhone, email } = useWebsiteConfig();
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          {/* Brand */}
          <div className="footer__brand">
            <div className="footer__logo"> Taxi Tây Ninh</div>
            <p className="footer__tagline">An toàn · Đúng giờ · Minh bạch</p>
            <p className="footer__desc">
              Hãng taxi uy tín hàng đầu tỉnh Tây Ninh, cung cấp taxi giá rẻ, taxi nhanh chóng, taxi an toàn 24/7 với đội xe hiện đại và tài xế chuyên nghiệp.
            </p>
            <div className="footer__socials">
              <a href="https://facebook.com/taxitaynin" target="_blank" rel="noreferrer" aria-label="Facebook">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="https://zalo.me/taxitaynin" target="_blank" rel="noreferrer" aria-label="Zalo">
                <span style={{ fontWeight: 800, fontSize: '0.75rem' }}>ZL</span>
              </a>
              <a href="https://youtube.com/@taxitaynin" target="_blank" rel="noreferrer" aria-label="YouTube">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#1A2B4A"/></svg>
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="footer__col">
            <h5>Dịch vụ</h5>
            <ul>
              <li><a href="#services">Taxi nội thành</a></li>
              <li><a href="#services">Đưa đón sân bay</a></li>
              <li><a href="#services">Thuê xe theo giờ</a></li>
              <li><a href="#services">Xe cưới & sự kiện</a></li>
            </ul>
          </div>
          <div className="footer__col">
            <h5>Hỗ trợ</h5>
            <ul>
              <li><a href="#contact">Khiếu nại / Phản hồi</a></li>
              <li><a href="#pricing">Bảng giá</a></li>
              <li><a href="#fleet">Đội xe</a></li>
              <li><a href="#about">Về chúng tôi</a></li>
            </ul>
          </div>
          <div className="footer__col">
            <h5>Liên hệ</h5>
            <ul>
              <li>📞 <a href={`tel:${phone}`}>{formattedPhone}</a></li>
              <li>✉️ <a href={`mailto:${email}`}>{email}</a></li>
              <li>📍 Xã Trường Tây, phường Long Hòa, tỉnh Tây Ninh</li>
            </ul>
          </div>
        </div>

        <div className="footer__legal">
          <div className="footer__legal-info">
            <p style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}>
              taxi giá rẻ taxi nhanh chóng taxi an toàn taxi 24/7 taxi Tây Ninh taxi sân bay taxi nội thành taxi công ty taxi cưới taxi sự kiện taxi chuyến dài taxi tiện lợi taxi uy tín taxi giá tốt taxi gọi xe nhanh taxi đúng giờ
            </p>
          </div>
          <div className="footer__copyright">
            © {year} Taxi Tây Ninh. All rights reserved.
            <span className="footer__dev"> · Website by [VietThanh]</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
