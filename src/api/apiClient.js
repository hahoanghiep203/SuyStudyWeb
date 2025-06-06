// src/utils/http-common.js (hoặc src/api/apiClient.js)

import axios from 'axios';

// Tạo một instance Axios với base URL mặc định
export default axios.create({
  baseURL: 'http://localhost:8080/api', // Địa chỉ của backend
  headers: {
    "Content-type": "application/json"
  }
});