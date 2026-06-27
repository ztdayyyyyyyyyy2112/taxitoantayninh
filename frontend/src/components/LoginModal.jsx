import React, { useState } from 'react';
import './LoginModal.css';

const API = import.meta.env.VITE_API_URL || '';

export default function LoginModal({ onClose, onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async event => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('adminToken', data.token);
        onLoginSuccess();
      } else {
        setError(data.message || 'Đăng nhập thất bại.');
      }
    } catch (e) {
      console.error(e);
      setError('Lỗi kết nối tới máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-modal" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="login-modal__card" onClick={e => e.stopPropagation()}>
        <button type="button" className="login-modal__close" onClick={onClose} aria-label="Đóng">×</button>
        <h3>Đăng nhập Quản trị</h3>
        <p>Vui lòng nhập tài khoản admin để truy cập trang quản lý.</p>
        <form onSubmit={submit}>
          <label>
            Tài khoản
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoComplete="username"
            />
          </label>
          <label>
            Mật khẩu
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </label>
          {error && <div className="login-modal__error">{error}</div>}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>
      </div>
    </div>
  );
}
