import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Fleet from './components/Fleet';
import Pricing from './components/Pricing';
import About from './components/About';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';
import { WebsiteConfigProvider, useWebsiteConfig } from './contexts/WebsiteConfigContext';
import './App.css';

function AdminProtectedRoute({ children }) {
  const token = localStorage.getItem('adminToken');
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function AppContent() {
  const [toast, setToast] = useState(null);
  const [promoOpen, setPromoOpen] = useState(false);
  const [phoneModalOpen, setPhoneModalOpen] = useState(false);
  const { phone, formattedPhone } = useWebsiteConfig();

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setPromoOpen(true);
    }, 500);

    return () => window.clearTimeout(timer);
  }, []);

  const closePromo = () => {
    setPromoOpen(false);
  };

  const openPhoneModal = event => {
    event.preventDefault();
    setPhoneModalOpen(true);
  };

  const closePhoneModal = () => {
    setPhoneModalOpen(false);
  };

  return (
    <div className="app">
      <Navbar />
      <main>
        <Routes>
          <Route
            path="/"
            element={(
              <>
                <Hero showToast={showToast} />
                <Services />
                <Fleet />
                <Pricing />
                <About />
                <Testimonials showToast={showToast} />
                <Contact showToast={showToast} />
              </>
            )}
          />
          <Route
            path="/admin-dashboard"
            element={(
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            )}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      {toast && (
        <div className={`toast toast--${toast.type}`}>
          <span>{toast.type === 'success' ? '✅' : '❌'}</span>
          {toast.msg}
        </div>
      )}
      {promoOpen && (
        <div className="promo-overlay" role="dialog" aria-modal="true" onClick={closePromo}>
          <div className="promo-modal card" onClick={event => event.stopPropagation()}>
            <button type="button" className="promo-close" onClick={closePromo} aria-label="Đóng popup">×</button>
            <div className="promo-content">
              <div className="promo-copy">
                <div className="promo-badge">Ưu đãi mới</div>
                <h3>Taxi Tây Ninh – mọi chuyến đi đều thuận tiện</h3>
                <p>
                  Taxi nội thành, sân bay, đưa đón bệnh viện, thuê xe theo giờ và dịch vụ doanh nghiệp — tất cả chỉ trong một chạm.
                </p>
                <div className="promo-actions">
                  <a href="#services" className="btn btn-primary" onClick={closePromo}>Xem dịch vụ</a>
                  <button type="button" className="btn btn-outline" onClick={openPhoneModal}>Gọi ngay</button>
                </div>
              </div>
              <div className="promo-visual">
                <img src="/promo-illustration.svg" alt="Taxi Tây Ninh promotion" />
                <div className="promo-favicon">
                  <img src="/favicon.png" alt="Favicon Taxi Tây Ninh" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {phoneModalOpen && (
        <div className="promo-overlay" role="dialog" aria-modal="true" onClick={closePhoneModal}>
          <div className="phone-modal card" onClick={event => event.stopPropagation()}>
            <button type="button" className="promo-close" onClick={closePhoneModal} aria-label="Đóng popup gọi">×</button>
            <h3>Gọi ngay cho Taxi Tây Ninh</h3>
            <p>Chọn một số điện thoại bên dưới để mở ứng dụng gọi điện trên thiết bị của bạn.</p>
            <a href={`tel:${phone}`} className="phone-option">
              <span>📞</span>
              <div>
                <strong>{formattedPhone}</strong>
              </div>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <WebsiteConfigProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </WebsiteConfigProvider>
  );
}
