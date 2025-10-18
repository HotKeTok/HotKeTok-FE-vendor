// src/pages/SignIn.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SignInTemplate from '../templates/SignInTemplate';
import Toast from '../components/common/Toast';
import { apiLogin } from '../api/auth-service';
import { setTokens, setRole } from '../utils/auth';

export default function SignIn() {
  const nav = useNavigate();

  // 로딩/토스트 상태
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });
  const openToast = msg => setToast({ show: true, message: msg });
  const closeToast = () => setToast({ show: false, message: '' });

  // 템플릿에서 호출하는 로그인 핸들러
  const onSubmit = async ({ logInId, password }) => {
    if (!logInId?.trim() || !password) {
      openToast('아이디와 비밀번호를 입력해주세요.');
      return { success: false };
    }
    try {
      setSubmitting(true);
      // 역할은 수리업체 기준으로 설정 (컨벤션에 맞춰 'VENDOR' 사용)
      const res = await apiLogin({ logInId: logInId.trim(), password, role: 'VENDOR' });
      if (res?.success) {
        const at = res?.data?.accessToken;
        const rt = res?.data?.refreshToken;
        if (at) setTokens({ accessToken: at, refreshToken: rt });
        setRole('VENDOR');
        openToast('로그인했어요!');
        setTimeout(() => nav('/init-process'), 400); // 필요 시 '/dashboard' 등으로 변경
      } else {
        openToast(res?.message || '아이디 또는 비밀번호가 올바르지 않아요.');
        return { success: false };
      }
      return res;
    } catch (e) {
      openToast(e?.message || '로그인 중 오류가 발생했어요.');
      return { success: false };
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SignInTemplate
        submitting={submitting}
        onSubmit={onSubmit}
        onSignUp={() => nav('/sign-up')}
        onNotify={openToast}
      />
      <Toast show={toast.show} message={toast.message} duration={1500} onClose={closeToast} />
    </>
  );
}
