import React, { useState } from 'react';
import { useWebsiteConfig } from '../contexts/WebsiteConfigContext';
import './Partner.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const BENEFITS = [
  { icon: '🏷️', text: 'Chiết khấu 10-20% tùy khối lượng chuyến' },
  { icon: '📋', text: 'Hóa đơn VAT, quản lý công nợ hàng tháng' },
  { icon: '👔', text: 'Xe ưu tiên, xe chuyên dụng đón tiếp khách VIP' },
  { icon: '📱', text: 'App quản lý chuyến đi cho bộ phận hành chính' },
  { icon: '🔔', text: 'Báo cáo chi phí vận chuyển chi tiết theo tháng' },
  { icon: '🤝', text: 'Có nhân viên kinh doanh phụ trách riêng' },
];

export default function Partner({ showToast }) {
  const { phone, formattedPhone, email } = useWebsiteConfig();
  const [form, setForm] = useState({ company: '', contactName: '', phone: '', email: '', employees: '', note: '' });
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.company || !form.contactName || !form.phone) return showToast('Vui lòng điền đầy đủ thông tin', 'error');
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/partner`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      showToast(data.message, data.success ? 'success' : 'error');
      if (data.success) setForm({ company: '', contactName: '', phone: '', email: '', employees: '', note: '' });
    } catch { showToast('Lỗi kết nối. Vui lòng thử lại.', 'error'); }
    finally { setLoading(false); }
  };

  return (
    <section id="partner" className="section section--alt">
      <div className="container">
        <div className="section-label">Đối tác</div>
        <h2 className="section-title">Hợp tác doanh nghiệp</h2>
        <p className="section-sub" style={{ marginBottom: 48 }}>
          Giải pháp vận chuyển toàn diện cho doanh nghiệp — tiết kiệm chi phí, minh bạch quản lý.
        </p>
        <div className="partner__inner">
          <div className="partner__benefits">
            <h3 className="partner__h3">Quyền lợi khi hợp tác</h3>
            <div className="partner__benefit-list">
              {BENEFITS.map((b, i) => (
                <div key={i} className="partner__benefit">
                  <span>{b.icon}</span> {b.text}
                </div>
              ))}
            </div>
            <div className="partner__contact-info">
              <p><strong>Phòng Kinh Doanh:</strong></p>
              <p>📞 <a href={`tel:${phone}`}>{formattedPhone}</a></p>
              <p>✉️ <a href={`mailto:${email}`}>{email}</a></p>
            </div>
          </div>
          <div className="partner__form card">
            <h3 className="partner__form-title">Đăng ký hợp tác</h3>
            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group"><label>Tên công ty *</label><input placeholder="Công ty TNHH ABC" value={form.company} onChange={e => set('company', e.target.value)} /></div>
              <div className="form-row">
                <div className="form-group"><label>Người liên hệ *</label><input placeholder="Nguyễn Văn A" value={form.contactName} onChange={e => set('contactName', e.target.value)} /></div>
                <div className="form-group"><label>Số điện thoại *</label><input type="tel" placeholder="09xx xxx xxx" value={form.phone} onChange={e => set('phone', e.target.value)} /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Email</label><input type="email" placeholder="abc@company.com" value={form.email} onChange={e => set('email', e.target.value)} /></div>
                <div className="form-group"><label>Số nhân viên</label><select value={form.employees} onChange={e => set('employees', e.target.value)}><option value="">-- Chọn --</option><option>1–20</option><option>21–50</option><option>51–200</option><option>200+</option></select></div>
              </div>
              <div className="form-group"><label>Ghi chú nhu cầu</label><textarea placeholder="Mô tả nhu cầu vận chuyển của doanh nghiệp..." value={form.note} onChange={e => set('note', e.target.value)} /></div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
                {loading ? '⏳ Đang gửi...' : '📨 Đăng ký hợp tác'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
