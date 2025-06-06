// src/components/AdminDashboard.tsx
import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';

const AdminDashboard: React.FC = () => {
  // State để lưu trữ số lượng lượt xem của website
  const [totalViews, setTotalViews] = useState<number | null>(null);
  // State để lưu trữ danh sách các bình luận
  const [comments, setComments] = useState<any[]>([]);
  // State để quản lý dữ liệu các trang nội dung (ví dụ: một mảng các đối tượng trang)
  const [contentPages, setContentPages] = useState<any[]>([
    { id: 'home', title: 'Trang chủ', content: 'Nội dung trang chủ...' },
    { id: 'about', title: 'Giới thiệu', content: 'Nội dung trang giới thiệu...' },
    // Thêm các trang khác tại đây
  ]);
  const [selectedPage, setSelectedPage] = useState<string>('home'); // Trang nội dung đang được chọn để cập nhật
  const [pageContent, setPageContent] = useState<string>(''); // Nội dung của trang đang được chỉnh sửa

  // Giả lập lấy số lượng lượt xem và bình luận từ API
  useEffect(() => {
    apiClient.get('/sitestats')
      .then(res => setTotalViews(res.data.total_website_views))
      .catch(() => setTotalViews(null));
    apiClient.get('/comments')
      .then(res => setComments(res.data))
      .catch(() => setComments([]));

    // Cập nhật nội dung trang khi selectedPage thay đổi
    const currentSelectedPage = contentPages.find(page => page.id === selectedPage);
    if (currentSelectedPage) {
      setPageContent(currentSelectedPage.content);
    }
  }, [selectedPage, contentPages]);

  // Hàm xử lý xóa bình luận
  const handleDeleteComment = (commentId: number) => {
    apiClient.delete(`/comments/${commentId}`)
      .then(() => setComments(comments.filter(comment => comment.id !== commentId)))
      .catch(() => alert('Xóa bình luận thất bại.'));
  };

  // Hàm xử lý cập nhật nội dung trang
  const handleUpdatePageContent = () => {
    apiClient.put(`/pages/${selectedPage}`, { content: pageContent })
      .then(() => {
        const updatedContentPages = contentPages.map(page =>
          page.id === selectedPage ? { ...page, content: pageContent } : page
        );
        setContentPages(updatedContentPages);
        alert(`Đã cập nhật nội dung trang "${selectedPage}"`);
      })
      .catch(() => alert('Cập nhật nội dung trang thất bại.'));
  };

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>Trang Quản Trị (Admin Dashboard)</h2>

      {/* Hiển thị số lượng view của toàn bộ Website */}
      <div style={{
        background: '#e0f7fa',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        <h3 style={{ color: '#00796b', marginBottom: '10px' }}>Tổng số lượt xem Website</h3>
        <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#004d40' }}>
          {totalViews !== null ? totalViews.toLocaleString() : 'Đang tải...'}
        </p>
      </div>

      {/* Cập nhật thông tin ở các trang nội dung */}
      <div style={{
        background: '#e8f5e9',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        <h3 style={{ color: '#2e7d32', marginBottom: '20px' }}>Cập nhật nội dung trang</h3>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="page-select" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Chọn trang:
          </label>
          <select
            id="page-select"
            value={selectedPage}
            onChange={(e) => setSelectedPage(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            {contentPages.map(page => (
              <option key={page.id} value={page.id}>{page.title}</option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="page-content" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Nội dung:
          </label>
          <textarea
            id="page-content"
            value={pageContent}
            onChange={(e) => setPageContent(e.target.value)}
            rows={10}
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', resize: 'vertical' }}
          />
        </div>
        <button
          onClick={handleUpdatePageContent}
          style={{
            background: '#4caf50',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 'bold',
            transition: 'background-color 0.3s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#388e3c'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4caf50'}
        >
          Cập nhật trang
        </button>
      </div>

      {/* Hiển thị danh sách, xóa bình luận của người dùng */}
      <div style={{
        background: '#e3f2fd',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ color: '#1976d2', marginBottom: '20px' }}>Quản lý Bình luận</h3>
        {comments.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#555' }}>Không có bình luận nào.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {comments.map(comment => (
              <li
                key={comment.id}
                style={{
                  background: 'white',
                  padding: '15px',
                  marginBottom: '10px',
                  borderRadius: '6px',
                  border: '1px solid #e0e0e0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <p style={{ margin: '0', fontWeight: 'bold', color: '#424242' }}>{comment.author}</p>
                  <p style={{ margin: '5px 0 0 0', color: '#616161' }}>"{comment.text}"</p>
                  <p style={{ margin: '5px 0 0 0', fontSize: '0.85rem', color: '#9e9e9e' }}>
                    Ngày: {comment.date}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  style={{
                    background: '#f44336',
                    color: 'white',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    transition: 'background-color 0.3s ease'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#d32f2f'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f44336'}
                >
                  Xóa
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;