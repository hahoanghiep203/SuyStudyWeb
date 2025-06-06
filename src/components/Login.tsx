// src/components/Login.tsx
import React, { useState } from 'react';
import apiClient from '../api/apiClient';

interface LoginProps {
  onLoginSuccess: (role: 'admin' | 'user') => void; // Callback function now accepts a 'role'
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isRegisterView, setIsRegisterView] = useState(false);

  const handleLoginSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');

    if (username.trim() === '' || password.trim() === '') {
      setError('Tên đăng nhập và mật khẩu không được để trống.');
      return;
    }

    try {
      // Call backend API for login
      const response = await apiClient.post('/auth/signin', { username, password });
      const { accessToken, roles } = response.data;
      console.log('roles from backend:', roles); // DEBUG
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('username', username); // Save username for display
      // Determine role from backend response (support both 'admin' and 'ROLE_ADMIN')
      const role = roles && (roles.includes('admin') || roles.includes('ROLE_ADMIN')) ? 'admin' : 'user';
      console.log('Detected role:', role); // DEBUG
      onLoginSuccess(role);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Tên đăng nhập hoặc mật khẩu không đúng.');
    }
  };

  const handleRegisterSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');

    if (username.trim() === '' || password.trim() === '' || confirmPassword.trim() === '') {
      setError('Vui lòng điền đầy đủ thông tin.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Mật khẩu và xác nhận mật khẩu không khớp.');
      return;
    }

    try {
      // Call backend API for registration
      await apiClient.post('/auth/signup', { username, password });
      setSuccessMessage('Đăng ký thành công! Vui lòng đăng nhập.');
      setUsername('');
      setPassword('');
      setConfirmPassword('');
      setIsRegisterView(false);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Đăng ký thất bại.');
    }
  };

  const commonInputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid var(--gray-300, #d1d5db)',
    borderRadius: '6px',
    fontSize: '16px',
    boxSizing: 'border-box' // Ensure padding doesn't increase overall width
  };

  const commonLabelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '8px',
    color: 'var(--gray-600, #4b5563)',
    fontSize: '14px'
  };

  const commonButtonStyle: React.CSSProperties = {
    background: 'var(--primary-green, #10b981)',
    color: 'white',
    padding: '12px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    width: '100%'
  };

  const toggleView = () => {
    setIsRegisterView(!isRegisterView);
    setError('');
    setSuccessMessage('');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'var(--gray-100, #f3f4f6)',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '24px', color: 'var(--gray-700, #374151)' }}>
          {isRegisterView ? 'Đăng ký tài khoản' : 'Đăng nhập'}
        </h2>

        {error && (
          <p style={{ color: 'var(--red-500, #ef4444)', fontSize: '14px', textAlign: 'center', marginBottom: '16px' }}>
            {error}
          </p>
        )}
        {successMessage && (
          <p style={{ color: 'var(--primary-green, #10b981)', fontSize: '14px', textAlign: 'center', marginBottom: '16px' }}>
            {successMessage}
          </p>
        )}

        {!isRegisterView ? (
          // Login Form
          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label htmlFor="username" style={commonLabelStyle}>
                Tên đăng nhập
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={commonInputStyle}
                placeholder="Nhập tên đăng nhập"
              />
            </div>
            <div>
              <label htmlFor="password" style={commonLabelStyle}>
                Mật khẩu
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={commonInputStyle}
                placeholder="Nhập mật khẩu"
              />
            </div>
            <button
              type="submit"
              style={commonButtonStyle}
              onMouseOver={(e) => e.currentTarget.style.background = 'var(--primary-green-dark, #059669)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'var(--primary-green, #10b981)'}
            >
              Đăng nhập
            </button>
          </form>
        ) : (
          // Registration Form
          <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label htmlFor="reg-username" style={commonLabelStyle}>
                Tên đăng nhập
              </label>
              <input
                type="text"
                id="reg-username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={commonInputStyle}
                placeholder="Chọn tên đăng nhập"
              />
            </div>
            <div>
              <label htmlFor="reg-password" style={commonLabelStyle}>
                Mật khẩu
              </label>
              <input
                type="password"
                id="reg-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={commonInputStyle}
                placeholder="Tạo mật khẩu"
              />
            </div>
            <div>
              <label htmlFor="reg-confirm-password" style={commonLabelStyle}>
                Xác nhận mật khẩu
              </label>
              <input
                type="password"
                id="reg-confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={commonInputStyle}
                placeholder="Nhập lại mật khẩu"
              />
            </div>
            <button
              type="submit"
              style={commonButtonStyle}
              onMouseOver={(e) => e.currentTarget.style.background = 'var(--primary-green-dark, #059669)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'var(--primary-green, #10b981)'}
            >
              Đăng ký
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button
            onClick={toggleView}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--primary-green, #10b981)',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontSize: '14px'
            }}
          >
            {isRegisterView ? 'Đã có tài khoản? Đăng nhập' : 'Chưa có tài khoản? Đăng ký'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
