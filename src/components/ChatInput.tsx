
import React, { useState } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{
      display: 'flex',
      gap: '12px',
      alignItems: 'flex-end'
    }}>
      <div style={{
        flex: 1,
        position: 'relative'
      }}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Nhập tin nhắn..."
          style={{
            width: '100%',
            minHeight: '44px',
            maxHeight: '120px',
            padding: '12px 50px 12px 16px',
            border: '1px solid var(--gray-300)',
            borderRadius: '22px',
            fontSize: '14px',
            resize: 'none',
            outline: 'none',
            fontFamily: 'inherit',
            lineHeight: '1.4'
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        
        <button
          type="button"
          className="btn btn-ghost"
          style={{
            position: 'absolute',
            right: '8px',
            top: '50%',
            transform: 'translateY(-50%)',
            padding: '6px',
            minWidth: 'auto',
            height: '32px',
            borderRadius: '16px'
          }}
        >
          📎
        </button>
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        disabled={!message.trim()}
        style={{
          padding: '12px',
          minWidth: '44px',
          height: '44px',
          borderRadius: '22px',
          fontSize: '16px'
        }}
      >
        ➤
      </button>
    </form>
  );
};

export default ChatInput;
