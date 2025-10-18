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
  headers: { Accept: 'application/json' },
});

/** 동시 401 처리용 큐 */
let isRefreshing = false;
let pendingQueue = []; // [{ resolve, reject, config }]

// ✅ 인증을 건너뛸 엔드포인트(로그인/회원가입/토큰갱신만)
const AUTH_WHITELIST = ['/auth-service/login', '/auth-service/signup', '/auth-service/refresh'];

function safePathname(url, base) {
  try {
    const absBase = /^https?:\/\//.test(base)
      ? base
      : window.location.origin.replace(/\/$/, '') + String(base || '');
    return new URL(url, absBase).pathname;
  } catch {
    return String(url || '').split('?')[0] || '';
  }
}
function isWhitelisted(pathname) {
  return AUTH_WHITELIST.some(p => pathname.startsWith(p));
}

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
  const base = api.defaults.baseURL || '';
  const pathname = safePathname(config.url, base);

  const isAuthFree = isWhitelisted(pathname);

  // 화이트리스트는 Authorization 제거
  if (isAuthFree) {
    if (config.headers?.Authorization) delete config.headers.Authorization;
    return config;
  }

  // 액세스 토큰 주입
  const at = getAccessToken();
  if (at) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${at}`;
  }

  // 선제 리프레시 (선택)
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

  // ✅ FormData일 땐 Content-Type을 제거해서 boundary 자동 세팅 유도
  if (config.data instanceof FormData) {
    if (config.headers) {
      delete config.headers['Content-Type'];
      delete config.headers['content-type'];
    }
  } else {
    // JSON 보낼 때만 기본 Content-Type 보장
    config.headers = config.headers || {};
    if (!config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json';
    }
  }

  return config;
});

api.interceptors.response.use(
  res => res,
  async error => {
    const original = error.config;
    const status = error?.response?.status;
    const base = api.defaults.baseURL || '';
    const pathname = safePathname(original?.url, base);

    // 화이트리스트는 리프레시 재시도 금지
    if (status === 401 && !isWhitelisted(pathname) && !original?._retry && getRefreshToken()) {
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
