import axios from 'axios';

import { refreshAccessToken } from '../slices/auth.slice';
import { store } from '../store';

export const rest = axios.create({
  baseURL: process.env['API_URL'] + '/' + process.env['API_PREFIX'],
});

rest.interceptors.request.use(async (config) => {
  const state = store.getState();
  const token = state.auth.accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

rest.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const state = store.getState();
      const refreshToken = state.auth.refreshToken;
      if (refreshToken) {
        const response = await store.dispatch(refreshAccessToken(refreshToken));
        if (response.payload) {
          rest.defaults.headers.common['Authorization'] = `Bearer ${response.payload.accessToken}`;

          return rest(originalRequest);
        }
      }
    }

    return Promise.reject(error);
  },
);
