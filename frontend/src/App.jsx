import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Fleet from './components/Fleet';
import Pricing from './components/Pricing';
import About from './components/About';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Recruitment from './components/Recruitment';
import Contact from './components/Contact';
import Footer from './components/Footer';
import './App.css';

export default function App() {
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div className="app">
      <Navbar />
      <main>
        <Hero showToast={showToast} />
        <Services />
        <Fleet />
        <Pricing />
        <About />
        <Testimonials />
        <FAQ />
        <Recruitment showToast={showToast} />
        <Contact showToast={showToast} />
      </main>
      <Footer />
      {toast && (
        <div className={`toast toast--${toast.type}`}>
          <span>{toast.type === 'success' ? '✅' : '❌'}</span>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
