import React, { useState } from 'react';
import './FAQ.css';

const FAQS = [
  { q: 'Thanh toán bằng thẻ hoặc QR Code được không?', a: 'Được. Trên mỗi xe đều có máy POS và mã QR tĩnh hỗ trợ VietQR, MoMo, ZaloPay, VNPay, thẻ Visa/Mastercard.' },
  { q: 'Quên đồ trên xe thì liên hệ như thế nào?', a: 'Gọi ngay Tổng đài 1900 1234, cung cấp mã chuyến (trong SMS xác nhận). Chúng tôi liên hệ tài xế và hoàn trả đồ trong 12-24 giờ hoặc sớm hơn.' },
  { q: 'Có cho mang thú cưng không?', a: 'Được phép mang thú cưng nhỏ (dưới 5kg) đã được nhốt trong lồng hoặc túi vải kín. Quý khách vui lòng thông báo khi đặt xe để điều phối xe phù hợp.' },
  { q: 'Đặt xe trước bao lâu thì có xe?', a: 'Đặt xe nội thành: có xe trong 5-10 phút. Tuyến dài hoặc xe limousine: đặt trước ít nhất 2 giờ. Sân bay: đặt trước 3-4 giờ để đảm bảo.' },
  { q: 'Tài xế có đi theo vào sân bay không?', a: 'Tài xế đưa đón sân bay sẽ đợi tại cổng đón khách với biển tên (nếu được yêu cầu) và hỗ trợ hành lý. Không tính thêm phí hỗ trợ hành lý cơ bản.' },
  { q: 'Chính sách hủy chuyến như thế nào?', a: 'Hủy trước 30 phút: miễn phí. Hủy trong 15-30 phút trước giờ đón: phí hủy 20% giá chuyến. Hủy sau khi tài xế đến: phí hủy 50%. Riêng xe cưới/sự kiện theo hợp đồng riêng.' },
  { q: 'Có bảo hiểm hành khách không?', a: 'Có. Tất cả xe Taxi Tây Ninh đều mua bảo hiểm trách nhiệm dân sự và bảo hiểm hành khách. Mức bồi thường theo quy định pháp luật hiện hành.' },
];

export default function FAQ() {
  const [open, setOpen] = useState(null);
  return (
    <section id="faq" className="section">
      <div className="container">
        <div className="section-label">Hỏi đáp</div>
        <h2 className="section-title">Câu hỏi thường gặp</h2>
        <p className="section-sub" style={{ marginBottom: 50 }}>Không tìm thấy câu trả lời? Gọi 0329.537.532 để được hỗ trợ ngay.</p>
        <div className="faq-list">
          {FAQS.map((f, i) => (
            <div key={i} className={`faq-item${open === i ? ' faq-item--open' : ''}`}>
              <button className="faq-item__q" onClick={() => setOpen(open === i ? null : i)}>
                <span>{f.q}</span>
                <span className="faq-item__icon">{open === i ? '−' : '+'}</span>
              </button>
              {open === i && <div className="faq-item__a">{f.a}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
