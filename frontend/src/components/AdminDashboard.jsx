import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWebsiteConfig } from '../contexts/WebsiteConfigContext';
import { getApiUrl } from '../config/api';
import './AdminDashboard.css';

const getToken = () => localStorage.getItem('adminToken');

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { refreshConfig } = useWebsiteConfig();
  const [config, setConfig] = useState({ phone: '', email: '' });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewMessage, setReviewMessage] = useState(null);
  const [reviewActionLoadingId, setReviewActionLoadingId] = useState(null);

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const res = await fetch(getApiUrl('/api/admin/configuration'), {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (data.success) {
        setConfig(data.data || {});
      } else {
        if (res.status === 401) {
          localStorage.removeItem('adminToken');
          return navigate('/', { replace: true });
        }
        setMessage({ type: 'error', text: data.message || 'Không thể tải cấu hình.' });
      }
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: 'Lỗi kết nối tới máy chủ.' });
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    setReviewsLoading(true);
    try {
      const res = await fetch(getApiUrl('/api/admin/reviews'), {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (data.success) {
        setReviews(data.data || []);
      } else {
        if (res.status === 401) {
          localStorage.removeItem('adminToken');
          return navigate('/', { replace: true });
        }
        setReviewMessage({ type: 'error', text: data.message || 'Không thể tải danh sách đánh giá.' });
      }
    } catch (error) {
      console.error(error);
      setReviewMessage({ type: 'error', text: 'Lỗi kết nối tới máy chủ.' });
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
    fetchReviews();
  }, []);

  const handleChange = (key, value) => setConfig(prev => ({ ...prev, [key]: value }));

  const handleSubmit = async event => {
    event.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(getApiUrl('/api/admin/configuration'), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(config),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: data.message || 'Cập nhật thành công.' });
        refreshConfig();
      } else {
        if (res.status === 401) {
          localStorage.removeItem('adminToken');
          return navigate('/', { replace: true });
        }
        setMessage({ type: 'error', text: data.message || 'Cập nhật thất bại.' });
      }
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: 'Lỗi kết nối tới máy chủ.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async reviewId => {
    setReviewActionLoadingId(reviewId);
    try {
      const res = await fetch(getApiUrl(`/api/admin/reviews/${reviewId}`), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (data.success) {
        setReviews(prev => prev.filter(review => review.id !== reviewId));
        setReviewMessage({ type: 'success', text: data.message || 'Đã xóa đánh giá.' });
      } else {
        if (res.status === 401) {
          localStorage.removeItem('adminToken');
          return navigate('/', { replace: true });
        }
        setReviewMessage({ type: 'error', text: data.message || 'Không thể xóa đánh giá.' });
      }
    } catch (error) {
      console.error(error);
      setReviewMessage({ type: 'error', text: 'Lỗi kết nối tới máy chủ.' });
    } finally {
      setReviewActionLoadingId(null);
    }
  };

  const handleToggleReviewVisibility = async reviewId => {
    setReviewActionLoadingId(reviewId);
    try {
      const res = await fetch(getApiUrl(`/api/admin/reviews/${reviewId}/visibility`), {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (data.success) {
        setReviews(prev => prev.map(review => (
          review.id === reviewId ? { ...review, is_visible: data.data.is_visible } : review
        )));
        setReviewMessage({ type: 'success', text: data.message || 'Đã cập nhật trạng thái.' });
      } else {
        if (res.status === 401) {
          localStorage.removeItem('adminToken');
          return navigate('/', { replace: true });
        }
        setReviewMessage({ type: 'error', text: data.message || 'Không thể đổi trạng thái.' });
      }
    } catch (error) {
      console.error(error);
      setReviewMessage({ type: 'error', text: 'Lỗi kết nối tới máy chủ.' });
    } finally {
      setReviewActionLoadingId(null);
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard__header">
        <div>
          <p className="admin-dashboard__eyebrow">Quản trị website</p>
          <h1>Admin Dashboard</h1>
        </div>
      </div>

      <section className="admin-card">
        <div className="admin-card__title">
          <h2>Cấu hình Website</h2>
          <p>Chỉnh thông tin liên hệ để cập nhật lên toàn site.</p>
        </div>
        {message && (
          <div className={`admin-alert admin-alert--${message.type}`}>
            {message.text}
          </div>
        )}
        <form className="admin-form" onSubmit={handleSubmit}>
          <label>
            Số điện thoại
            <input
              value={config.phone}
              onChange={e => handleChange('phone', e.target.value)}
              placeholder="0329537532"
            />
          </label>
          <label>
            Email
            <input
              type="email"
              value={config.email}
              onChange={e => handleChange('email', e.target.value)}
              placeholder="email@domain.com"
            />
          </label>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Đang cập nhật...' : 'Cập nhật'}
          </button>
        </form>
      </section>

      <section className="admin-card">
        <div className="admin-card__title">
          <h2>Quản lý đánh giá</h2>
          <p>Xem toàn bộ đánh giá trong database, ẩn/hiện hoặc xóa trực tiếp khỏi trang chủ.</p>
        </div>
        {reviewMessage && (
          <div className={`admin-alert admin-alert--${reviewMessage.type}`}>
            {reviewMessage.text}
          </div>
        )}
        {reviewsLoading ? (
          <p>Đang tải đánh giá...</p>
        ) : reviews.length === 0 ? (
          <p className="review-item__empty">Chưa có đánh giá nào trong database.</p>
        ) : (
          <div className="review-list">
            {reviews.map(review => (
              <article key={review.id} className="review-item">
                <div className="review-item__meta">
                  <div>
                    <div className="review-item__name">{review.name}</div>
                    <div className="review-item__role">{review.role || 'Khách hàng'}</div>
                  </div>
                  <div className={`review-badge ${review.is_visible ? 'review-badge--visible' : 'review-badge--hidden'}`}>
                    {review.is_visible ? 'Đang hiện' : 'Đang ẩn'}
                  </div>
                </div>
                <div className="review-item__text">{review.text}</div>
                <div className="review-item__actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => handleToggleReviewVisibility(review.id)}
                    disabled={reviewActionLoadingId === review.id}
                  >
                    {reviewActionLoadingId === review.id ? 'Đang xử lý...' : review.is_visible ? 'Ẩn' : 'Hiện'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => handleDeleteReview(review.id)}
                    disabled={reviewActionLoadingId === review.id}
                  >
                    {reviewActionLoadingId === review.id ? 'Đang xử lý...' : 'Xóa'}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
