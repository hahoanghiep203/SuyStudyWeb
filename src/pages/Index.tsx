import React, { useState } from 'react';

// --- HamburgerButton (inlined) ---
interface HamburgerButtonProps {
  isOpen: boolean;
  onClick: () => void;
}
const HamburgerButton: React.FC<HamburgerButtonProps> = ({ isOpen, onClick }) => (
  <button
    onClick={onClick}
    style={{
      position: 'fixed',
      top: '20px',
      left: '20px',
      width: '44px',
      height: '44px',
      background: 'white',
      border: '1px solid var(--gray-200)',
      borderRadius: '8px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 60,
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.2s ease'
    }}
  >
    <div style={{
      width: '20px',
      height: '14px',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      <span style={{
        display: 'block',
        width: '100%',
        height: '2px',
        background: 'var(--gray-700)',
        borderRadius: '1px',
        transition: 'all 0.3s ease',
        transform: isOpen ? 'rotate(45deg) translate(5px, 5px)' : 'rotate(0)'
      }} />
      <span style={{
        display: 'block',
        width: '100%',
        height: '2px',
        background: 'var(--gray-700)',
        borderRadius: '1px',
        transition: 'all 0.3s ease',
        opacity: isOpen ? '0' : '1'
      }} />
      <span style={{
        display: 'block',
        width: '100%',
        height: '2px',
        background: 'var(--gray-700)',
        borderRadius: '1px',
        transition: 'all 0.3s ease',
        transform: isOpen ? 'rotate(-45deg) translate(7px, -6px)' : 'rotate(0)'
      }} />
    </div>
  </button>
);

// --- AppSidebar (inlined) ---
interface AppSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: string;
  onPageChange: (page: string) => void;
}
const AppSidebar: React.FC<AppSidebarProps> = ({ isOpen, onClose, currentPage, onPageChange }) => {
  const navItems = [
    { id: 'home', label: 'Trang chủ', icon: '🏠' },
    { id: 'calendar', label: 'Lịch học', icon: '📅' },
    { id: 'profile', label: 'Hồ sơ', icon: '👤' }
  ];
  const handlePageChange = (pageId: string) => {
    onPageChange(pageId);
    onClose();
  };
  return (
    <>
      {isOpen && (
        <div
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.5)', zIndex: 40 }}
          onClick={onClose}
        />
      )}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: isOpen ? '0' : '-280px',
          width: '280px',
          height: '100vh',
          background: 'white',
          borderRight: '1px solid var(--gray-200)',
          boxShadow: '4px 0 6px -1px rgba(0, 0, 0, 0.1)',
          zIndex: 50,
          transition: 'left 0.3s ease-in-out',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div style={{ padding: '20px', borderBottom: '1px solid var(--gray-200)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--gray-800)', margin: 0 }}>StudyApp</h2>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer', padding: '4px', borderRadius: '4px' }}
          >
            ✕
          </button>
        </div>
        <nav style={{ flex: 1, padding: '20px 0' }}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handlePageChange(item.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 20px',
                background: currentPage === item.id ? 'var(--primary-green-light)' : 'transparent',
                border: 'none',
                borderLeft: currentPage === item.id ? '4px solid var(--primary-green)' : '4px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                color: currentPage === item.id ? 'var(--primary-green)' : 'var(--gray-600)',
                fontWeight: currentPage === item.id ? '600' : '400',
                fontSize: '14px'
              }}
            >
              <span style={{ fontSize: '20px' }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div style={{ padding: '20px', borderTop: '1px solid var(--gray-200)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gray-500)', fontSize: '12px' }}>
            <span>🎯</span>
            <span>Quản lý học tập thông minh</span>
          </div>
        </div>
      </div>
    </>
  );
};

// --- Pages (import and inline) ---
import HomePage from '../components/HomePage';
import CalendarPage from '../components/CalendarPage';
import ProfilePage from '../components/ProfilePage';

const Index = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'calendar':
        return <CalendarPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <HomePage />;
    }
  };
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <HamburgerButton isOpen={sidebarOpen} onClick={toggleSidebar} />
      <AppSidebar
        isOpen={sidebarOpen}
        onClose={closeSidebar}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
      <main style={{ flex: 1, marginLeft: sidebarOpen ? '280px' : '0', transition: 'margin-left 0.3s ease-in-out', paddingTop: '20px' }}>
        {renderPage()}
      </main>
    </div>
  );
};

export default Index;
