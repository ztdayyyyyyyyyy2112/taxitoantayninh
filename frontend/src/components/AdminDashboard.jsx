import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWebsiteConfig } from '../contexts/WebsiteConfigContext';
import './AdminDashboard.css';

const API = import.meta.env.VITE_API_URL || '';

const getToken = () => localStorage.getItem('adminToken');

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { refreshConfig } = useWebsiteConfig();
  const [config, setConfig] = useState({ phone: '', email: '', taxId: '', businessId: '' });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/admin/configuration`, {
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

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleChange = (key, value) => setConfig(prev => ({ ...prev, [key]: value }));

  const handleSubmit = async event => {
    event.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/admin/configuration`, {
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
          <p>Chỉnh thông tin liên hệ và mã số doanh nghiệp để cập nhật lên toàn site.</p>
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
          <label>
            Mã số thuế
            <input
              value={config.taxId}
              onChange={e => handleChange('taxId', e.target.value)}
              placeholder="0313889999"
            />
          </label>
          <label>
            Mã số kinh doanh
            <input
              value={config.businessId}
              onChange={e => handleChange('businessId', e.target.value)}
              placeholder="0102030405"
            />
          </label>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Đang cập nhật...' : 'Cập nhật'}
          </button>
        </form>
      </section>
    </div>
  );
}
