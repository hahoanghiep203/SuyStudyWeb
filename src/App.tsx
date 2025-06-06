// src/App.tsx
import React, { useState, useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import apiClient from './api/apiClient';

import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

import Login from './components/Login';
import NotFound from './pages/NotFound';
import HomePage from './components/HomePage';
import CalendarPage from './components/CalendarPage';
import ProfilePage from './components/ProfilePage';
import ContactPage from './components/ContactPage';
import AdminDashboard from './components/AdminDashboard';
import CourseDetailPage from './components/CourseDetailPage';
// Corrected import path assuming ProductAdPopup.tsx is in src/components/
import ProductAdPopup from './components/ProductAdPopup';

const queryClient = new QueryClient();

// Add axios interceptor to send JWT token if present
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers['x-access-token'] = token;
  return config;
});

interface HamburgerButtonProps {
  isOpen: boolean;
  onClick: () => void;
  style?: React.CSSProperties;
}

const HamburgerButton: React.FC<HamburgerButtonProps> = ({ isOpen, onClick, style }) => {
  const barStyle: React.CSSProperties = {
    display: 'block',
    width: '100%',
    height: '3px',
    background: 'var(--gray-700, #374151)',
    borderRadius: '3px',
    transition: 'all 0.3s ease-in-out',
  };

  return (
    <button
      onClick={onClick}
      aria-label={isOpen ? "Đóng menu" : "Mở menu"}
      aria-expanded={isOpen}
      style={{
        position: 'fixed',
        top: '15px',
        left: '15px',
        width: '40px',
        height: '40px',
        background: 'rgba(255, 255, 255, 0.9)',
        border: '1px solid var(--gray-200, #e5e7eb)',
        borderRadius: '8px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '8px',
        zIndex: 1050,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        ...style,
      }}
    >
      <span style={{ ...barStyle, transform: isOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
      <span style={{ ...barStyle, opacity: isOpen ? 0 : 1 }} />
      <span style={{ ...barStyle, transform: isOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
    </button>
  );
};

interface AppSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: string;
  onPageChange: (path: string) => void;
  onLogout: () => void;
  userRole: 'admin' | 'user' | null;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ isOpen, onClose, currentPage, onPageChange, onLogout, userRole }) => {
  const userNavItems = [
    { id: '/app/home', label: 'Trang chủ', icon: '🏠' },
    { id: '/app/calendar', label: 'Lịch học', icon: '📅' },
    { id: '/app/contact', label: 'Liên hệ', icon: '📞' },
    { id: '/app/profile', label: 'Hồ sơ', icon: '👤' }
  ];

  const adminNavItems = [
    { id: '/app/admin', label: 'Quản trị', icon: '⚙️' },
    { id: '/app/home', label: 'Trang chủ', icon: '🏠' },
    { id: '/app/profile', label: 'Hồ sơ', icon: '👤' }
  ];

  const navItems = userRole === 'admin' ? adminNavItems : userNavItems;


  const sidebarWidth = '260px';

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.4)',
            zIndex: 1000,
          }}
        />
      )}
      <aside
        aria-hidden={!isOpen}
        style={{
          position: 'fixed',
          top: 0,
          left: isOpen ? '0' : `-${sidebarWidth}`,
          width: sidebarWidth,
          height: '100vh',
          background: 'white',
          borderRight: '1px solid var(--gray-200, #e5e7eb)',
          boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
          zIndex: 1010,
          transition: 'left 0.3s ease-in-out',
          display: 'flex',
          flexDirection: 'column',
          paddingTop: '60px',
        }}
      >
        <nav style={{ flexGrow: 1 }}>
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onPageChange(item.id);
                  onClose();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  padding: '15px 20px',
                  gap: '12px',
                  background: isActive ? 'var(--primary-green-light, #e6f7f0)' : 'transparent',
                  border: 'none',
                  borderLeft: isActive ? `4px solid var(--primary-green, #10b981)` : '4px solid transparent',
                  textAlign: 'left',
                  cursor: 'pointer',
                  color: isActive ? 'var(--primary-green, #10b981)' : 'var(--gray-700, #374151)',
                  fontWeight: isActive ? '600' : '500',
                  fontSize: '1rem',
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </nav>
        <div style={{ padding: '20px', borderTop: '1px solid var(--gray-200, #e5e7eb)' }}>
            <button
                onClick={() => {
                    onLogout();
                    onClose();
                }}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    padding: '15px 20px',
                    gap: '12px',
                    background: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    color: 'var(--gray-700, #374151)',
                    fontWeight: '500',
                    fontSize: '1rem',
                }}
            >
                <span style={{ fontSize: '1.2rem' }}>🚪</span>
                Đăng xuất
            </button>
        </div>
      </aside>
    </>
  );
};


const AppContent = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  const [userRole, setUserRole] = useState<'admin' | 'user' | null>(() => {
    return (localStorage.getItem('userRole') as 'admin' | 'user' | null) || null;
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const [currentPageNav, setCurrentPageNav] = useState<string>(isLoggedIn ? (userRole === 'admin' ? '/app/admin' : '/app/home') : '/login');

  useEffect(() => {
    localStorage.setItem('isLoggedIn', String(isLoggedIn));
    localStorage.setItem('userRole', userRole || '');
    if (!isLoggedIn) {
        setIsSidebarOpen(false);
    }
  }, [isLoggedIn, userRole]);

  useEffect(() => {
    const currentPath = location.pathname;
    if (currentPath === '/login') {
      setCurrentPageNav('/login');
    } else if (currentPath.startsWith('/app/')) {
      setCurrentPageNav(currentPath);
    } else if (currentPath === '/') {
      setCurrentPageNav(isLoggedIn ? (userRole === 'admin' ? '/app/admin' : '/app/home') : '/login');
    } else {
      setCurrentPageNav(isLoggedIn ? (userRole === 'admin' ? '/app/admin' : '/app/home') : '/login');
    }
  }, [location.pathname, isLoggedIn, userRole]);

  // Increment website view count on every site load/reload
  useEffect(() => {
    apiClient.post('/sitestats/increment')
      .catch(() => {/* ignore error, not critical for user */});
  }, []);

  const handleLoginSuccess = (role: 'admin' | 'user') => {
    setIsLoggedIn(true);
    setUserRole(role);
    localStorage.setItem('userRole', role); // Ensure localStorage is always in sync
    if (role === 'admin') {
      navigate('/app/admin');
    } else {
      navigate('/app/home'); // Navigate to user home page
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    navigate('/login');
  };

  const handlePageChangeByNav = (path: string) => {
    navigate(path);
    setIsSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const sidebarWidth = '260px';

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {isLoggedIn && (
        <>
          <HamburgerButton isOpen={isSidebarOpen} onClick={toggleSidebar} />
          <AppSidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            currentPage={currentPageNav}
            onPageChange={handlePageChangeByNav}
            onLogout={handleLogout}
            userRole={userRole}
          />
        </>
      )}
      <main
        style={{
          flexGrow: 1,
          paddingLeft: isLoggedIn ? (isSidebarOpen ? sidebarWidth : '60px') : '0',
          paddingTop: isLoggedIn ? '20px' : '0',
          paddingRight: isLoggedIn ? '20px' : '0',
          paddingBottom: isLoggedIn ? '20px' : '0',
          transition: 'padding-left 0.3s ease-in-out',
          width: '100%',
          overflowX: 'hidden',
        }}
      >
        <Routes>
          <Route
            path="/login"
            element={
              isLoggedIn ? (userRole === 'admin' ? <Navigate to="/app/admin" replace /> : <Navigate to="/app/home" replace />) : <Login onLoginSuccess={handleLoginSuccess} />
            }
          />
          <Route
            path="/app"
            element={
              isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />
            }
          >
            {/* Define both admin and home routes independently */}
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="home" element={<HomePage userRole={userRole} />} />

            <Route path="calendar" element={<CalendarPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="profile" element={<ProfilePage />} />
            {/* Pass userRole to CourseDetailPage */}
            <Route path="course/:courseId" element={<CourseDetailPage userRole={userRole} />} />
            {/* Redirect /app to the appropriate dashboard based on role */}
            <Route index element={isLoggedIn ? (userRole === 'admin' ? <Navigate to="admin" replace /> : <Navigate to="home" replace />) : <Navigate to="/login" replace />} />
          </Route>
          <Route
            path="/"
            element={
              isLoggedIn ? (userRole === 'admin' ? <Navigate to="/app/admin" replace /> : <Navigate to="/app/home" replace />) : <Navigate to="/login" replace />
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {/* Render the ProductAdPopup here only if logged in */}
      {isLoggedIn && <ProductAdPopup delayInSeconds={20} />}
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
