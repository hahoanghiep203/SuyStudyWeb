
import React from 'react';

const CreateCourseButton = () => {
  return (
    <button
      className="card"
      style={{
        width: '100%',
        padding: '20px',
        marginBottom: '32px',
        border: '2px dashed var(--gray-300)',
        background: 'transparent',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        minHeight: '120px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--primary-green)';
        e.currentTarget.style.background = 'rgba(16, 185, 129, 0.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--gray-300)';
        e.currentTarget.style.background = 'transparent';
      }}
    >
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        background: 'var(--primary-green)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
        marginBottom: '8px'
      }}>
        ➕
      </div>
      <h3 style={{
        fontSize: '18px',
        fontWeight: '600',
        color: 'var(--gray-800)',
        marginBottom: '4px'
      }}>
        Learning something new...
      </h3>
      <p style={{
        fontSize: '14px',
        color: 'var(--gray-500)',
        textAlign: 'center'
      }}>
        Tạo khóa học mới để bắt đầu hành trình học tập
      </p>
    </button>
  );
};

export default CreateCourseButton;
