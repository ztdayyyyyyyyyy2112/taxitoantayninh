import React, { useState } from 'react';
import './Services.css';

const SERVICES = [
  { icon: '', title: 'Taxi Nội Thành', desc: 'Di chuyển nhanh trong tỉnh Tây Ninh, đồng hồ tính cước minh bạch, không vòng vèo.', tag: 'Phổ biến' },
  { icon: '', title: 'Đưa Đón Sân Bay', desc: 'Phục vụ sân bay Tân Sơn Nhất, Căn cứ quân sự. Theo dõi chuyến bay thực tế.', tag: 'Hot' },
  { icon: '', title: 'Đưa Đón Bệnh Viện', desc: 'Phục vụ đưa đón tại tất cả bệnh viện ở TP.HCM và các tỉnh lân cận, đúng lịch, an toàn và thuận tiện.', tag: 'Mới' },
  { icon: '', title: 'Thuê Xe Theo Giờ', desc: 'Thuê xe 4-12 giờ/ngày với tài xế. Phù hợp công tác, thăm quan, mua sắm.', tag: '' },
  { icon: '', title: 'Xe Cưới & Sự Kiện', desc: 'Đội xe limousine, sedan sang trọng cho đám cưới, hội nghị, tiếp khách VIP.', tag: 'Cao cấp' },
  { icon: '', title: 'Đưa Đón Doanh Nghiệp', desc: 'Hợp đồng dài hạn cho công ty — hóa đơn VAT, quản lý công nợ, chiết khấu ưu đãi.', tag: '' },
];

export default function Services() {
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: 'Gọi ngay cho hotline',
    text: 'Để đặt xe ngay, vui lòng gọi cho hotline dưới đây.',
  });

  const handleServiceClick = title => {
    if (title === 'Xe Cưới & Sự Kiện' || title === 'Đưa Đón Doanh Nghiệp') {
      setModalContent({
        title: 'Không còn xe trống cho dịch vụ này',
        text: 'Hiện tại dịch vụ này hiện không còn xe trống. Vui lòng gọi hotline để được hỗ trợ.',
      });
    } else {
      setModalContent({
        title: 'Gọi ngay cho hotline',
        text: 'Để đặt xe ngay, vui lòng gọi cho hotline dưới đây.',
      });
    }
    setBookingModalOpen(true);
  };

  const closeModal = () => setBookingModalOpen(false);

  return (
    <section id="services" className="section section--alt">
      <div className="container">
        <div className="section-label">Dịch vụ</div>
        <h2 className="section-title">Đa dạng dịch vụ vận chuyển</h2>
        <p className="section-sub" style={{ marginBottom: 16 }}>
          Từ chuyến đi ngắn trong phố đến hành trình xuyên tỉnh, Taxi Tây Ninh đều có giải pháp phù hợp cho bạn.
        </p>
        <p className="section-sub" style={{ marginBottom: 48, maxWidth: 760 }}>
          Dịch vụ taxi giá rẻ Tây Ninh phù hợp cho khách cần đi làm, đi thăm thân, taxi đưa đón sân bay Tây Ninh,
          đặt xe taxi tòa thánh Tây Ninh hoặc di chuyển nhanh giữa các điểm trong thành phố và tỉnh lân cận.
        </p>
        <div className="grid-3">
          {SERVICES.map((s, i) => (
            <div key={i} className="svc-card card">
              <div className="svc-card__icon">{s.icon}</div>
              <div className="svc-card__body">
                <div className="svc-card__title-row">
                  <h3 className="svc-card__title">{s.title}</h3>
                  {s.tag && <span className="svc-card__tag">{s.tag}</span>}
                </div>
                <p className="svc-card__desc">{s.desc}</p>
                <button
                  type="button"
                  className="svc-card__link"
                  onClick={() => handleServiceClick(s.title)}
                >
                  Đặt ngay →
                </button>
              </div>
            </div>
          ))}
        </div>

        {bookingModalOpen && (
          <div className="svc-modal" role="dialog" aria-modal="true" onClick={closeModal}>
            <div className="svc-modal__card" onClick={e => e.stopPropagation()}>
              <h3>{modalContent.title}</h3>
              <p>{modalContent.text}</p>
              {modalContent.title !== 'Không còn xe trống cho dịch vụ này' && (
                <>
                  <a href="tel:0329537532" className="svc-modal__phone-link">📞 0329 537 532</a>
                  <a href="tel:0978202606" className="svc-modal__phone-link">📞 0978 202 606</a>
                </>
              )}
              <button type="button" className="btn btn-primary" onClick={closeModal}>Đóng</button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
