// src/pages/SignUp.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SignUpTemplate from '../templates/SignUpTemplate';
import Toast from '../components/common/Toast';
import { apiPhoneSend, apiPhoneVerify, apiIdVerify, apiSignUp } from '../api/auth-service';

export default function SignUp() {
  const nav = useNavigate();

  // 로딩 상태
  const [submitting, setSubmitting] = useState(false);
  const [requestingPhone, setRequestingPhone] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [verifyingUserId, setVerifyingUserId] = useState(false);

  // ✅ Toast: show 를 사용
  const [toast, setToast] = useState({ show: false, message: '' });
  const openToast = msg => setToast({ show: true, message: msg });
  const closeToast = () => setToast({ show: false, message: '' });

  // 템플릿 콜백들
  const onRequestPhone = async ({ phoneNumber }) => {
    try {
      setRequestingPhone(true);
      const res = await apiPhoneSend({ phoneNumber });
      // 토스트는 템플릿 onNotify에서 띄움 (중복 방지)
      return res;
    } catch (e) {
      return { success: false, message: e?.message || '인증코드 전송 중 오류가 발생했어요.' };
    } finally {
      setRequestingPhone(false);
    }
  };

  const onVerifyCode = async ({ phoneNumber, code }) => {
    try {
      setVerifyingCode(true);
      const res = await apiPhoneVerify({ phoneNumber, code });
      return res?.success
        ? { success: true, message: '인증번호가 일치해요.' }
        : { success: false, message: res?.message || '인증번호가 일치하지 않아요.' };
    } catch (e) {
      return { success: false, message: e?.message || '인증 확인 중 오류가 발생했어요.' };
    } finally {
      setVerifyingCode(false);
    }
  };

  const onCheckUserId = async ({ logInId }) => {
    try {
      setVerifyingUserId(true);
      const res = await apiIdVerify({ logInId });
      return res?.success
        ? { success: true }
        : { success: false, message: res?.message || '이미 존재하는 아이디예요.' };
    } catch (e) {
      return { success: false, message: e?.message || '중복확인 중 오류가 발생했어요.' };
    } finally {
      setVerifyingUserId(false);
    }
  };

  const onSubmit = async ({ name, logInId, password, phoneNumber }) => {
    try {
      setSubmitting(true);
      const res = await apiSignUp({
        name: name.trim(),
        logInId: logInId.trim(),
        password,
        phoneNumber,
      });
      if (res?.success) {
        openToast('회원가입이 완료되었어요. 로그인해주세요!');
        setTimeout(() => nav('/sign-in'), 600);
      } else {
        openToast(res?.message || '회원가입에 실패했어요. 다시 시도해주세요.');
      }
      return res;
    } catch (e) {
      openToast(e?.message || '회원가입 중 오류가 발생했어요.');
      return { success: false, message: e?.message };
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SignUpTemplate
        onRequestPhone={onRequestPhone}
        onVerifyCode={onVerifyCode}
        onCheckUserId={onCheckUserId}
        onSubmit={onSubmit}
        submitting={submitting}
        requestingPhone={requestingPhone}
        verifyingCode={verifyingCode}
        verifyingUserId={verifyingUserId}
        onNotify={openToast} // 템플릿 → 페이지로 메시지 전달 → 토스트 표시
        onBack={() => nav('/sign-in')}
      />
      {/* ✅ Toast는 show prop 사용 */}
      <Toast show={toast.show} message={toast.message} duration={1500} onClose={closeToast} />
    </>
  );
}
