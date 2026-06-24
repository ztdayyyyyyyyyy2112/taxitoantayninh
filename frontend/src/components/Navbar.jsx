import React, { useState, useEffect } from 'react';
import './Navbar.css';

const links = [
  { label: 'Trang chủ', href: '#hero' },
  { label: 'Dịch vụ', href: '#services' },
  { label: 'Bảng giá', href: '#pricing' },
  { label: 'Về chúng tôi', href: '#about' },
  { label: 'Tuyển dụng', href: '#recruitment' },
  { label: 'Liên hệ', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [callModalOpen, setCallModalOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const openCallModal = e => {
    e.preventDefault();
    setCallModalOpen(true);
  };

  const closeCallModal = () => setCallModalOpen(false);

  return (
    <header className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>
      <div className="container navbar__inner">
        <a href="#hero" className="navbar__logo">
         
          <div>
            <div className="navbar__logo-name">Taxi Toàn Tây Ninh</div>
            <div className="navbar__logo-sub">Đặt xe 24/7</div>
          </div>
        </a>

        <nav className={`navbar__nav${open ? ' navbar__nav--open' : ''}`}>
          {links.map(l => (
            <a key={l.href} href={l.href} className="navbar__link" onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <button type="button" className="btn btn-danger btn-sm navbar__cta" onClick={openCallModal}>
            <img 
    src="https://www.image2url.com/r2/default/images/1782290563210-985d23dc-409a-4ede-a6ee-6384548da4c7.png" 
    alt="Taxi Hotline Logo"
    style={{ height: '30px', width: 'auto', marginRight: '10px' }} 
  /> Gọi Đặt Xe Ngay
          </button>
        </nav>

        <button className="navbar__burger" onClick={() => setOpen(!open)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </div>

      {callModalOpen && (
        <div className="navbar__modal" role="dialog" aria-modal="true" onClick={closeCallModal}>
          <div className="navbar__modal-card" onClick={e => e.stopPropagation()}>
            <h3>Liên hệ đặt xe</h3>
            <p>Chọn một số bên dưới để gọi trực tiếp.</p>
            <a href="tel:0329537532" className="navbar__phone-link">0329 537 532</a>
            <a href="tel:0978202606" className="navbar__phone-link">0978 202 606</a>
            <button type="button" className="btn btn-primary" onClick={closeCallModal}>Đóng</button>
          </div>
        </div>
      )}
    </header>
  );
}
