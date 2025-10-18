// src/api/client.js
import axios from 'axios';
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearAuth,
  isAccessTokenExpiringSoon,
} from '../utils/auth';
import { apiRefreshToken } from './auth-service';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
});

/** 동시 401 처리용 큐 */
let isRefreshing = false;
let pendingQueue = []; // [{ resolve, reject, config }]

// ✅ 토큰 주입/리프레시를 건너뛸 엔드포인트(로그인/회원가입/토큰갱신 등)
const AUTH_WHITELIST = ['/auth-service/login', '/auth-service/signup', '/auth-service/refresh'];

function processQueue(error, newAccessToken) {
  pendingQueue.forEach(p => {
    if (error) p.reject(error);
    else {
      p.config.headers = p.config.headers || {};
      p.config.headers.Authorization = `Bearer ${newAccessToken}`;
      api.request(p.config).then(p.resolve).catch(p.reject);
    }
  });
  pendingQueue = [];
}

api.interceptors.request.use(async config => {
  // pathname 안전추출
  const base = api.defaults.baseURL || '';
  let pathname = '';
  try {
    pathname = new URL(config.url, base).pathname;
  } catch {
    pathname = (config.url || '').split('?')[0] || '';
  }

  const isAuthFree = AUTH_WHITELIST.some(p => pathname.startsWith(p));
  if (isAuthFree) {
    if (config.headers?.Authorization) delete config.headers.Authorization;
    return config;
  }

  const at = getAccessToken();
  if (at) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${at}`;
  }

  // 선제 리프레시 (옵션)
  if (at && isAccessTokenExpiringSoon(at) && getRefreshToken() && !isRefreshing) {
    try {
      isRefreshing = true;
      const res = await apiRefreshToken();
      if (res?.success) {
        const newAT = res?.data?.accessToken;
        const newRT = res?.data?.refreshToken;
        setTokens({ accessToken: newAT, refreshToken: newRT });
        config.headers.Authorization = `Bearer ${newAT}`;
      } else {
        throw new Error('Refresh failed');
      }
    } catch (e) {
      clearAuth();
      if (window.location.pathname !== '/sign-in') window.location.replace('/sign-in');
      return Promise.reject(e);
    } finally {
      isRefreshing = false;
    }
  }

  return config;
});

api.interceptors.response.use(
  res => res,
  async error => {
    const original = error.config;
    const status = error?.response?.status;

    const urlPath = (original?.url || '').replace(api.defaults.baseURL, '');
    const isAuthFree = AUTH_WHITELIST.some(p => urlPath.startsWith(p));

    if (status === 401 && !isAuthFree && !original?._retry && getRefreshToken()) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject, config: original });
        });
      }
      original._retry = true;
      isRefreshing = true;

      try {
        const res = await apiRefreshToken();
        if (!res?.success) throw new Error('Refresh failed');

        const newAT = res?.data?.accessToken;
        const newRT = res?.data?.refreshToken;
        if (!newAT) throw new Error('No access token from refresh');

        setTokens({ accessToken: newAT, refreshToken: newRT });
        processQueue(null, newAT);
        isRefreshing = false;

        original.headers = original.headers || {};
        original.headers.Authorization = `Bearer ${newAT}`;
        return api.request(original);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        isRefreshing = false;
        clearAuth();
        if (window.location.pathname !== '/sign-in') window.location.replace('/sign-in');
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
