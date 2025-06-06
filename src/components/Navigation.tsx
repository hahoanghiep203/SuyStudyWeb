// src/components/Navigation.tsx
import React from 'react';

interface NavigationProps {
  currentPage: string; // Current path, e.g., "/app/home"
  onPageChange: (path: string) => void; // Callback to navigate to a new path
  // isLoggedIn prop is NOT defined here based on the user's provided file for this turn
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, onPageChange }) => {
  const navItems = [
    { id: '/app/home', label: 'Trang chủ', icon: '🏠' },
    { id: '/app/calendar', label: 'Lịch học', icon: '📅' },
    { id: '/app/chat', label: 'Chat AI', icon: '💬' },
    { id: '/app/contact', label: 'Liên hệ', icon: '📞' }, // Added Contact Page
    { id: '/app/profile', label: 'Hồ sơ', icon: '👤' }
  ];

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'white',
      borderTop: '1px solid var(--gray-200, #e5e7eb)',
      padding: '12px 0',
      boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.1)',
      zIndex: 50 // Ensure it's above page content but below modals if any
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        {navItems.map((item) => {
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)} // item.id is the full path
              aria-current={isActive ? 'page' : undefined}
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                padding: '8px 12px',
                background: 'transparent',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                color: isActive ? 'var(--primary-green, #10b981)' : 'var(--gray-500, #6b7280)',
                fontWeight: isActive ? '600' : '400',
                flex: 1, // Distribute space evenly
                minWidth: '60px', // Ensure buttons have some minimum width
              }}
            >
              <span style={{ fontSize: '20px' }}>{item.icon}</span>
              <span style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>{item.label}</span>
              {isActive && (
                <div style={{
                  position: 'absolute',
                  bottom: '-2px', // Adjusted for better visual
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '5px', // Slightly larger dot
                  height: '5px',
                  borderRadius: '50%',
                  background: 'var(--primary-green, #10b981)'
                }} />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
