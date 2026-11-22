
import axios from 'axios';

const API_URL =
  window.location.hostname === 'localhost'
    ? 'http://localhost:5000'
    : 'https://website-fpuc.onrender.com';

export const userApi = axios.create({
  baseURL: `${API_URL}/user/Auth`,
  withCredentials: true,
});

export const adminApi = axios.create({
  baseURL: `${API_URL}/admin/Auth`,
  withCredentials: true,
});

export const api = adminApi;

let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

export const clearAccessToken = () => {
  accessToken = null;
};

userApi.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

let refreshPromise = null;

userApi.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/refreshToken') &&
      !originalRequest.url?.includes('/login/user')
    ) {
      originalRequest._retry = true;

      try {
        if (!refreshPromise) {
          refreshPromise = userApi
            .post('/refreshToken')
            .then((response) => {
              setAccessToken(response.data.accessToken);
              return response.data.accessToken;
            })
            .finally(() => {
              refreshPromise = null;
            });
        }

        const newAccessToken = await refreshPromise;

        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        return userApi(originalRequest);

      } catch (refreshError) {
        clearAccessToken();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
