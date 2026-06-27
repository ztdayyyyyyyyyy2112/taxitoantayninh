import React, { useEffect, useState } from 'react';
import { getApiUrl } from '../config/api';
import './Testimonials.css';

export default function Testimonials({ showToast }) {
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ name: '', role: '', text: '', stars: 5 });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadReviews = async () => {
    try {
      const response = await fetch(getApiUrl('/api/reviews'));
      const result = await response.json();
      if (result.success) {
        setReviews(result.data);
      } else {
        throw new Error(result.message || 'Không thể tải đánh giá');
      }
    } catch (error) {
      console.error(error);
      if (showToast) showToast('Không tải được đánh giá. Vui lòng thử lại sau.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleChange = event => {
    const { name, value } = event.target;
    setForm(curr => ({ ...curr, [name]: value }));
  };

  const handleStars = value => {
    setForm(curr => ({ ...curr, stars: value }));
  };

  const handleSubmit = async event => {
    event.preventDefault();
    if (!form.name.trim() || !form.text.trim()) {
      if (showToast) showToast('Vui lòng điền họ tên và nội dung đánh giá.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(getApiUrl('/api/reviews'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, role: form.role, text: form.text, stars: form.stars }),
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.message || 'Lỗi gửi đánh giá');

      setForm({ name: '', role: '', text: '', stars: 5 });
      if (showToast) showToast(result.message, 'success');
      loadReviews();
    } catch (error) {
      console.error(error);
      if (showToast) showToast('Gửi đánh giá thất bại. Vui lòng thử lại.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="section section--alt">
      <div className="container">
        <div className="section-label">Đánh giá</div>
        <h2 className="section-title">Khách hàng nói gì về chúng tôi</h2>
        <p className="section-sub" style={{ marginBottom: 40 }}>
          Hơn 10.000 lượt đánh giá 5 sao trên Google và Zalo.
        </p>

        <div className="testi-layout">
          <form className="review-form card" onSubmit={handleSubmit}>
            <h3>Gửi đánh giá của bạn</h3>
            <label>
              Họ tên
              <input name="name" value={form.name} onChange={handleChange} placeholder="Nhập họ tên" required />
            </label>
            <label>
              Công việc / Nghề nghiệp
              <input name="role" value={form.role} onChange={handleChange} placeholder="Ví dụ: Khách hàng cá nhân" />
            </label>
            <label className="rating-group">
              Đánh giá sao
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map(value => (
                  <button
                    key={value}
                    type="button"
                    className={`rating-star ${form.stars >= value ? 'active' : ''}`}
                    onClick={() => handleStars(value)}
                    aria-label={`${value} sao`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </label>
            <label>
              Nội dung đánh giá
              <textarea name="text" value={form.text} onChange={handleChange} placeholder="Viết cảm nhận của bạn..." required rows={5} />
            </label>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
            </button>
          </form>

          <div className="reviews-panel">
            <div className="reviews-header">
              <h3>Đánh giá mới nhất</h3>
              <span>{reviews.length} đánh giá hiển thị</span>
            </div>

            {loading ? (
              <p>Đang tải đánh giá…</p>
            ) : reviews.length === 0 ? (
              <p>Chưa có đánh giá nào. Hãy là người đầu tiên gửi phản hồi!</p>
            ) : (
              <div className="grid-3 reviews-grid">
                {reviews.map(review => (
                  <div key={review.id} className="review-card card">
                    <div className="review-card__stars">{'★'.repeat(review.stars || 5)}</div>
                    <p className="review-card__text">"{review.text}"</p>
                    <div className="review-card__author">
                      <div className="review-card__avatar">{review.name.charAt(0)}</div>
                      <div>
                        <div className="review-card__name">{review.name}</div>
                        <div className="review-card__role">{review.role}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
