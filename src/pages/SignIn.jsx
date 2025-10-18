import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SignInTemplate from '../templates/SignInTemplate';
import { apiLogin } from '../api/auth-service';
import { setTokens, setRole } from '../utils/auth';

export default function SignIn() {
  const nav = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  // 응답 파싱
  const extractFromLoginResponse = raw => {
    const maybeAxiosPayload = raw?.data;
    const looksLikePayload =
      maybeAxiosPayload &&
      (typeof maybeAxiosPayload.success !== 'undefined' ||
        typeof maybeAxiosPayload.status !== 'undefined' ||
        typeof maybeAxiosPayload.code !== 'undefined');

    const payload = looksLikePayload ? raw.data : raw;
    const envelope = payload?.data ?? {};

    const isSuccess =
      payload?.success === true || payload?.status === 200 || String(payload?.code ?? '') === '200';

    const jwt = envelope?.jwtToken;
    let accessToken = jwt?.accessToken;
    let refreshToken = jwt?.refreshToken;
    if (!accessToken && envelope?.accessToken) accessToken = envelope.accessToken;
    if (!refreshToken && envelope?.refreshToken) refreshToken = envelope.refreshToken;

    const role = envelope?.role;
    const onBoardingStageFlag =
      typeof envelope?.onBoardingStageFlag === 'boolean'
        ? envelope.onBoardingStageFlag
        : envelope?.onBoardingStage;

    return { isSuccess, accessToken, refreshToken, role, onBoardingStageFlag, payload, envelope };
  };

  // 에러 분류기: 서버 메시지/상태코드로 id/비번/기타 구분
  const classifyLoginError = ({ status, message = '' }) => {
    const msg = String(message || '').toLowerCase();
    if (status === 404 || /존재하지 않|not exist|not found|아이디|계정/.test(msg)) return 'id';
    if (
      status === 401 ||
      status === 403 ||
      /비밀번호|password|credential|mismatch|invalid/.test(msg)
    )
      return 'password';
    return 'other';
  };

  const onSubmit = async ({ logInId, password }) => {
    if (!logInId?.trim() || !password) {
      // 템플릿에서 자체 검증하므로 여기선 형식만 맞춰 반환
      return { success: false, reason: 'other', message: '아이디와 비밀번호를 입력해주세요.' };
    }

    try {
      setSubmitting(true);

      const rawRes = await apiLogin({ logInId: logInId.trim(), password, role: 'VENDOR' });
      const { isSuccess, accessToken, refreshToken, role, onBoardingStageFlag, payload } =
        extractFromLoginResponse(rawRes);

      if (!isSuccess) {
        const reason = classifyLoginError({ status: payload?.status, message: payload?.message });
        return { success: false, reason, message: payload?.message || '' };
      }
      if (!accessToken) {
        return {
          success: false,
          reason: 'other',
          message: '로그인 응답에서 토큰을 확인할 수 없어요.',
        };
      }

      setTokens({ accessToken, refreshToken: refreshToken ?? '' });
      setRole(role || 'VENDOR');

      // 네비게이션
      if (onBoardingStageFlag === false) nav('/init-process');
      else nav('/');

      return { success: true };
    } catch (e) {
      const status = e?.response?.status;
      const message =
        e?.response?.data?.message || e?.response?.data?.data?.message || e?.message || '';
      const reason = classifyLoginError({ status, message });
      return { success: false, reason, message };
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SignInTemplate submitting={submitting} onSubmit={onSubmit} onSignUp={() => nav('/sign-up')} />
  );
}
