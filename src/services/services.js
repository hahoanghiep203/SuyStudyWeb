// src/services/course.service.js

import axios from 'axios'; // Đảm bảo bạn đã cài đặt axios: npm install axios

// Địa chỉ cơ bản của backend API của bạn
// Đảm bảo cổng này khớp với cổng mà backend đang chạy (ví dụ: 8080)
const API_BASE_URL = 'http://localhost:8080/api';

class CourseService {
  // Ví dụ: Lấy tất cả khóa học
  getAllCourses() {
    return axios.get(`${API_BASE_URL}/courses`);
  }

  // Ví dụ: Lấy một khóa học theo ID
  getCourseById(id) {
    return axios.get(`<span class="math-inline">\{API\_BASE\_URL\}/courses/</span>{id}`);
  }

  // Ví dụ: Tạo một khóa học mới (cần có token xác thực và quyền admin)
  createCourse(courseData, token) {
    return axios.post(`${API_BASE_URL}/courses`, courseData, {
      headers: {
        'x-access-token': token // Gửi JWT token trong header
      }
    });
  }

  // ... Thêm các phương thức khác cho các API endpoint liên quan đến khóa học
}

export default new CourseService(); // Export một instance của service