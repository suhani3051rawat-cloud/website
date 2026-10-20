import axios from 'axios';

const API_URL =
  window.location.hostname === 'localhost'
    ? 'http://localhost:5000'
    : 'https://website-fpuc.onrender.com';

export const userApi = axios.create({
  baseURL: `${API_URL}/user/Auth`,
  withCredentials: true,
});

export const api = axios.create({
  baseURL: `${API_URL}/admin/Auth`,
  withCredentials: true,
});