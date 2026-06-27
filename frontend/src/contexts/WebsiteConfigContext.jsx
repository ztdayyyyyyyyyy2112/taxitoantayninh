import React, { createContext, useContext, useEffect, useState } from 'react';

const WebsiteConfigContext = createContext({
  phone: '0329537532',
  formattedPhone: '0329 537 532',
  email: 'huynhlong2410@gmail.com',
  refreshConfig: () => {},
});

const formatPhone = number => {
  if (!number) return '';
  const digits = number.replace(/\D/g, '');
  if (digits.length === 10) {
    return digits.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
  }
  return number;
};

export function WebsiteConfigProvider({ children }) {
  const [config, setConfig] = useState({
    phone: '0329537532',
    formattedPhone: '0329 537 532',
    email: 'huynhlong2410@gmail.com',
  });

  const refreshConfig = async () => {
    try {
      const res = await fetch('/api/configuration');
      const data = await res.json();
      if (data.success && data.data) {
        setConfig({
          phone: data.data.phone || '0329537532',
          formattedPhone: formatPhone(data.data.phone || '0329537532'),
          email: data.data.email || 'huynhlong2410@gmail.com',
        });
      }
    } catch (error) {
      console.error('[CONFIG] refreshConfig error', error);
    }
  };

  useEffect(() => {
    refreshConfig();
  }, []);

  return (
    <WebsiteConfigContext.Provider value={{ ...config, refreshConfig }}>
      {children}
    </WebsiteConfigContext.Provider>
  );
}

export function useWebsiteConfig() {
  return useContext(WebsiteConfigContext);
}
