// src/api/auth.js
// Utility to get the admin token from localStorage (or other storage)
export function getToken() {
  return localStorage.getItem('accessToken');
}
