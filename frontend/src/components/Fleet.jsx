import React, { useState } from 'react';
import './Fleet.css';

const FLEET = [
  { 
    type: '4 Chỗ Sedan', 
    models: 'Toyota Vios, Hyundai Accent,...', 
    img: 'https://www.image2url.com/r2/default/images/1782303782068-080b8063-14ad-4fad-9efb-0abaef156852.png', // Đã thay bằng link ảnh của bạn
    features: ['Điều hòa 2 chiều', 'Cáp sạc USB', 'Định vị GPS', 'Camera hành trình'] 
  },
  { type: '7 Chỗ MPV',  models: 'Toyota Innova, Mitsubishi Xpander,...', img: 'https://www.image2url.com/r2/default/images/1782303464530-3d7582c8-cc50-435c-8bbe-d5def80b8d4d.png', features: ['Ghế da cao cấp', 'Điều hòa tự động', 'Cốp rộng', 'Màn hình giải trí'] },
  { type: 'Limousine VIP', models: 'Ford Tourneo, Hyundai Staria,...', img: 'https://www.image2url.com/r2/default/images/1782303575426-1048a77b-89d4-4d22-8bd1-0701510c567d.png', features: ['Ghế massage', 'WiFi riêng', 'Màn hình HD', 'Rèm che riêng tư'] },
];

export default function Fleet() {
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: 'Gọi ngay cho hotline',
    text: 'Để đặt xe ngay, vui lòng gọi cho hotline dưới đây.',
  });

  const openBookingModal = (e, carType) => {
    e.preventDefault();
    if (carType === 'Limousine VIP') {
      setModalContent({
        title: 'Hiện không còn xe trống',
        text: 'Hiện tại loại xe Limousine đang không còn xe trống.',
      });
    } else {
      setModalContent({
        title: 'Gọi ngay cho hotline',
        text: 'Để đặt xe ngay, vui lòng gọi cho hotline dưới đây.',
      });
    }
    setBookingModalOpen(true);
  };

  const closeBookingModal = () => setBookingModalOpen(false);

  return (
    <section id="fleet" className="section">
      <div className="container">
        <div className="section-label">Đội xe</div>
        <h2 className="section-title">Đội xe hiện đại, sạch sẽ</h2>
        <p className="section-sub" style={{ marginBottom: 48 }}>
           xe đời mới nhập khẩu, bảo dưỡng định kỳ mỗi 3 tháng.
        </p>
        <div className="grid-3">
          {FLEET.map((car, i) => (
            <div key={i} className="fleet-card card">
              
              {/* ĐOẠN ĐƯỢC SỬA LẠI ĐỂ HIỂN THỊ ĐƯỢC CẢ LINK ẢNH LẪN EMOJI */}
              <div className="fleet-card__img">
                {car.img.startsWith('http') ? (
                  <img 
                    src={car.img} 
                    alt={car.type} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                ) : (
                  car.img
                )}
              </div>

              <div className="fleet-card__body">
                <div className="fleet-card__count">{car.count}</div>
                <h3 className="fleet-card__type">{car.type}</h3>
                <p className="fleet-card__models">{car.models}</p>
                <ul className="fleet-card__features">
                  {car.features.map((f, j) => (
                    <li key={j}><span>✓</span> {f}</li>
                  ))}
                </ul>
                <button type="button" className="btn btn-outline btn-sm fleet-card__cta" onClick={e => openBookingModal(e, car.type)}>Đặt xe loại này</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {bookingModalOpen && (
        <div className="fleet-modal" role="dialog" aria-modal="true" onClick={closeBookingModal}>
          <div className="fleet-modal__card" onClick={e => e.stopPropagation()}>
            <h3>{modalContent.title}</h3>
            <p>{modalContent.text}</p>
            <a href="tel:0329537532" className="fleet-modal__phone-link">📞 0329 537 532</a>
            <a href="tel:0978202606" className="fleet-modal__phone-link">📞 0978 202 606</a>
            <button type="button" className="btn btn-primary" onClick={closeBookingModal}>Đóng</button>
          </div>
        </div>
      )}
    </section>
  );
}