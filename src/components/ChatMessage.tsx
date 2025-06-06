
import React from 'react';

interface Message {
  id: number;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.sender === 'bot';
  
  return (
    <div style={{
      display: 'flex',
      justifyContent: isBot ? 'flex-start' : 'flex-end',
      marginBottom: '12px'
    }}>
      <div style={{
        maxWidth: '80%',
        display: 'flex',
        alignItems: 'flex-end',
        gap: '8px',
        flexDirection: isBot ? 'row' : 'row-reverse'
      }}>
        {isBot && (
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'var(--primary-green)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            flexShrink: 0
          }}>
            🤖
          </div>
        )}

        <div>
          <div style={{
            background: isBot ? 'var(--gray-100)' : 'var(--primary-green)',
            color: isBot ? 'var(--gray-800)' : 'white',
            padding: '12px 16px',
            borderRadius: '18px',
            borderBottomLeftRadius: isBot ? '4px' : '18px',
            borderBottomRightRadius: isBot ? '18px' : '4px',
            fontSize: '14px',
            lineHeight: '1.5',
            whiteSpace: 'pre-line'
          }}>
            {message.content}
          </div>
          
          <div style={{
            fontSize: '11px',
            color: 'var(--gray-500)',
            marginTop: '4px',
            textAlign: isBot ? 'left' : 'right'
          }}>
            {message.timestamp.toLocaleTimeString('vi-VN', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
