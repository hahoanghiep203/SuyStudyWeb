// src/components/UserDashboard.tsx
import React from 'react';

const UserDashboard: React.FC = () => {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Chào mừng, Người dùng!</h2>
      <p>Đây là trang thông tin của bạn.</p>
      {/* Add user-specific functionalities here */}
    </div>
  );
};

export default UserDashboard;