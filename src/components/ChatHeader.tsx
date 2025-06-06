
import React from 'react';

const ChatHeader = () => {
  return (
    <header style={{
      background: 'white',
      padding: '20px',
      borderBottom: '1px solid var(--gray-200)',
      position: 'sticky',
      top: 0,
      zIndex: 10
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--primary-green), var(--secondary-blue))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px'
        }}>
          🤖
        </div>
        
        <div>
          <h1 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: 'var(--gray-800)',
            marginBottom: '2px'
          }}>
            Study Assistant
          </h1>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'var(--primary-green)'
            }} />
            <span style={{
              fontSize: '12px',
              color: 'var(--gray-500)'
            }}>
              Đang hoạt động
            </span>
          </div>
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          <button className="btn btn-ghost" style={{ padding: '8px' }}>
            📞
          </button>
          <button className="btn btn-ghost" style={{ padding: '8px' }}>
            ⚙️
          </button>
        </div>
      </div>
    </header>
  );
};

export default ChatHeader;
