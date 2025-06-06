import React, { useEffect, useState } from 'react';
import apiClient from '../api/apiClient';

const ProfilePage = () => {
  const [preferences, setPreferences] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<string>('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    apiClient.get('/user/preferences')
      .then(res => setPreferences(res.data))
      .catch(() => setPreferences(null))
      .finally(() => setLoading(false));
    // Get username from localStorage
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) setUsername(storedUsername);
  }, []);

  const handlePrefChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPreferences({ ...preferences, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaveStatus('');
    try {
      await apiClient.put('/user/preferences', preferences);
      setSaveStatus('Lưu thành công!');
    } catch {
      setSaveStatus('Lưu thất bại.');
    }
  };

  return (
    <div className="animate-fadeIn">
      <header style={{
        background: 'white',
        padding: '20px',
        borderBottom: '1px solid var(--gray-200)'
      }}>
        <div className="container">
          <h1 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: 'var(--gray-800)',
            marginBottom: '8px'
          }}>
            Hồ sơ
          </h1>
          <p style={{
            fontSize: '14px',
            color: 'var(--gray-500)'
          }}>
            Quản lý thông tin cá nhân và cài đặt
          </p>
        </div>
      </header>

      <div className="container" style={{ padding: '40px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: '20px', fontWeight: 600, marginBottom: 16, color: '#059669' }}>Tên đăng nhập: {username}</div>

        <div style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--primary-green), var(--secondary-blue))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '48px',
          margin: '0 auto 24px'
        }}>
          🚧
        </div>

        <h2 style={{
          fontSize: '24px',
          fontWeight: '600',
          color: 'var(--gray-800)',
          marginBottom: '12px'
        }}>
          Coming Soon
        </h2>

        <p style={{
          fontSize: '16px',
          color: 'var(--gray-500)',
          marginBottom: '32px',
          maxWidth: '400px',
          margin: '0 auto 32px'
        }}>
          Trang hồ sơ đang được phát triển. Sớm bạn sẽ có thể quản lý thông tin cá nhân, cài đặt tài khoản và xem thống kê học tập của mình.
        </p>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          maxWidth: '300px',
          margin: '0 auto'
        }}>
          <div className="card" style={{
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            opacity: 0.6
          }}>
            <span style={{ fontSize: '20px' }}>👤</span>
            <span style={{ fontSize: '14px', color: 'var(--gray-600)' }}>
              Thông tin cá nhân
            </span>
          </div>

          <div className="card" style={{
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            opacity: 0.6
          }}>
            <span style={{ fontSize: '20px' }}>📊</span>
            <span style={{ fontSize: '14px', color: 'var(--gray-600)' }}>
              Thống kê học tập
            </span>
          </div>

          <div className="card" style={{
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            opacity: 0.6
          }}>
            <span style={{ fontSize: '20px' }}>⚙️</span>
            <span style={{ fontSize: '14px', color: 'var(--gray-600)' }}>
              Cài đặt ứng dụng
            </span>
          </div>

          <div className="card" style={{
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            opacity: 0.6
          }}>
            <span style={{ fontSize: '20px' }}>🔔</span>
            <span style={{ fontSize: '14px', color: 'var(--gray-600)' }}>
              Thông báo
            </span>
          </div>
        </div>

        <div style={{ margin: '32px auto', maxWidth: 400, background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Cài đặt cá nhân</h3>
          {loading ? (
            <div>Đang tải cài đặt...</div>
          ) : preferences ? (
            <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 6, color: '#374151' }}>Tên hiển thị:</label>
                <input name="displayName" value={preferences.displayName || ''} onChange={handlePrefChange} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 6, color: '#374151' }}>Email thông báo:</label>
                <input name="notificationEmail" value={preferences.notificationEmail || ''} onChange={handlePrefChange} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
              </div>
              <button type="submit" style={{ background: 'var(--primary-green, #10b981)', color: 'white', padding: '10px 20px', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>Lưu thay đổi</button>
              {saveStatus && <div style={{ marginTop: 12, color: saveStatus.includes('thành công') ? '#059669' : '#ef4444' }}>{saveStatus}</div>}
            </form>
          ) : (
            <div>Không thể tải cài đặt người dùng.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
