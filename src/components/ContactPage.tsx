// src/pages/ContactPage.tsx
import React, { useState } from 'react';
import apiClient from '../api/apiClient';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await apiClient.post('/contact', formData);
      setIsSubmitted(true);
    } catch (error) {
      alert('Gửi liên hệ thất bại. Vui lòng thử lại sau.');
    }
  };

  const pageContainerStyle: React.CSSProperties = {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
    fontFamily: "'Inter', sans-serif", // Assuming Inter font
  };

  const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: '30px',
    color: 'var(--gray-800, #1f2937)',
  };

  const formStyle: React.CSSProperties = {
    background: 'white',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  };

  const inputGroupStyle: React.CSSProperties = {
    marginBottom: '20px',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '8px',
    color: 'var(--gray-700, #374151)',
    fontWeight: '500',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px',
    border: '1px solid var(--gray-300, #d1d5db)',
    borderRadius: '8px',
    fontSize: '1rem',
    boxSizing: 'border-box',
  };

  const textareaStyle: React.CSSProperties = {
    ...inputStyle,
    minHeight: '120px',
    resize: 'vertical',
  };

  const buttonStyle: React.CSSProperties = {
    background: 'var(--primary-green, #10b981)',
    color: 'white',
    padding: '12px 20px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    width: '100%',
  };

   const submittedMessageStyle: React.CSSProperties = {
    background: 'var(--primary-green-light, #e6f7f0)',
    color: 'var(--primary-green, #059669)',
    padding: '15px',
    borderRadius: '8px',
    textAlign: 'center',
    marginTop: '20px',
  };


  return (
    <div style={pageContainerStyle} className="animate-fadeIn">
      <header style={headerStyle}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '8px' }}>Giới thiệu và Thông tin Liên hệ</h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--gray-600, #4b5563)' }}>
          Chúng tôi rất vui khi được kết nối với bạn!
        </p>
      </header>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--gray-700, #374151)', marginBottom: '15px' }}>Về Chúng Tôi</h2>
        <p style={{ lineHeight: '1.7', color: 'var(--gray-600, #4b5563)' }}>
          Chào mừng bạn đến với StudyApp! Chúng tôi là một nền tảng học tập trực tuyến được thiết kế để giúp bạn quản lý lịch trình, theo dõi tiến độ và đạt được mục tiêu học tập của mình một cách hiệu quả. Sứ mệnh của chúng tôi là cung cấp một công cụ trực quan, dễ sử dụng và truyền cảm hứng cho mọi người học.
        </p>
        <p style={{ lineHeight: '1.7', color: 'var(--gray-600, #4b5563)', marginTop: '10px' }}>
          Dù bạn là sinh viên, người đi làm muốn nâng cao kỹ năng, hay chỉ đơn giản là người yêu thích học hỏi, StudyApp luôn sẵn sàng đồng hành cùng bạn.
        </p>
      </section>

      <section>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--gray-700, #374151)', marginBottom: '15px' }}>Gửi Ý Kiến Liên Hệ</h2>
        {isSubmitted ? (
          <div style={submittedMessageStyle}>
            <p style={{fontWeight: '500'}}>Cảm ơn bạn đã gửi ý kiến! Chúng tôi sẽ phản hồi sớm nhất có thể.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={formStyle}>
            <div style={inputGroupStyle}>
              <label htmlFor="name" style={labelStyle}>Tên của bạn:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={inputStyle}
                placeholder="Ví dụ: Nguyễn Văn A"
              />
            </div>
            <div style={inputGroupStyle}>
              <label htmlFor="email" style={labelStyle}>Địa chỉ Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={inputStyle}
                placeholder="Ví dụ: email@example.com"
              />
            </div>
            <div style={inputGroupStyle}>
              <label htmlFor="message" style={labelStyle}>Nội dung ý kiến:</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                style={textareaStyle}
                placeholder="Hãy cho chúng tôi biết suy nghĩ của bạn..."
              />
            </div>
            <button type="submit" style={buttonStyle}
              onMouseOver={(e) => e.currentTarget.style.background = 'var(--primary-green-dark, #059669)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'var(--primary-green, #10b981)'}
            >
              Gửi Liên Hệ
            </button>
          </form>
        )}
      </section>
    </div>
  );
};

export default ContactPage;
