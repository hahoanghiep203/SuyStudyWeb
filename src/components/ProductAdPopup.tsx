// src/components/ProductAdPopup.tsx
import React, { useState, useEffect } from 'react';

// Utility functions for cookie management
const setCookie = (name: string, value: string, days: number) => {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "")  + expires + "; path=/";
};

const getCookie = (name: string): string | null => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

const COOKIE_NAME = 'productAdPopupDismissed';

interface ProductAd {
  productName: string;
  imageUrl: string;
  productLink: string;
}

const ProductAdPopup: React.FC<{ delayInSeconds?: number }> = ({ delayInSeconds = 60 }) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  // Use a static ad object
  const ad: ProductAd = {
    productName: 'Gói Premium Học Tập',
    imageUrl: '/placeholder.svg',
    productLink: 'https://your-premium-link.com',
  };

  useEffect(() => {
    // Only show if user is logged in (accessToken exists)
    const isLoggedIn = !!localStorage.getItem('accessToken');
    const cookieDismissed = getCookie(COOKIE_NAME);
    if (!isLoggedIn || cookieDismissed === 'true') {
      setIsVisible(false);
      return;
    }
    const timer = setTimeout(() => {
      if (getCookie(COOKIE_NAME) !== 'true' && !!localStorage.getItem('accessToken')) {
        setIsVisible(true);
      }
    }, delayInSeconds * 1000);
    return () => clearTimeout(timer);
  }, [delayInSeconds]);

  const handleClosePopup = () => {
    setIsVisible(false);
    setCookie(COOKIE_NAME, 'true', 30);
  };

  if (!isVisible) return null;

  // Inline styles for simplicity, consider a separate CSS file for larger projects
  const popupStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    width: '300px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: 'white',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    padding: '15px',
    zIndex: 1000,
    fontFamily: 'Arial, sans-serif',
  };

  const closeButtonStyle: React.CSSProperties = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'transparent',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
    color: '#555',
  };

  const imageStyle: React.CSSProperties = {
    width: '100%',
    maxHeight: '150px',
    objectFit: 'cover',
    borderRadius: '4px',
    marginBottom: '10px',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '1.1em',
    fontWeight: 'bold',
    marginBottom: '8px',
    color: '#333',
  };

  const linkStyle: React.CSSProperties = {
    display: 'inline-block',
    marginTop: '10px',
    padding: '8px 15px',
    backgroundColor: '#007bff',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '4px',
    textAlign: 'center',
  };

  return (
    <div style={popupStyle}>
      <button onClick={handleClosePopup} style={closeButtonStyle} aria-label="Đóng quảng cáo">
        &times;
      </button>
      <img src={ad.imageUrl} alt={ad.productName} style={imageStyle} />
      <div style={titleStyle}>Ưu đãi đặc biệt: {ad.productName}!</div>
      <p>Khám phá ngay sản phẩm tuyệt vời này với giá ưu đãi.</p>
      <a href={ad.productLink} target="_blank" rel="noopener noreferrer" style={linkStyle}>
        Xem chi tiết
      </a>
    </div>
  );
};

export default ProductAdPopup;
