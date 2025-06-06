// src/utils/http-common.js (hoặc src/api/apiClient.js)

import axios from 'axios';
import { getToken } from './auth';

// Tạo một instance Axios với base URL mặc định
const api = axios.create({
  baseURL: 'http://localhost:8080/api', // Địa chỉ của backend
  headers: {
    "Content-type": "application/json"
  }
});

// Thêm request interceptor để bao gồm x-access-token từ localStorage cho tất cả các yêu cầu API
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers['x-access-token'] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;