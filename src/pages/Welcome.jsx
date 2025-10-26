// src/pages/Welcome.jsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import WelcomeTemplate from '../templates/WelcomeTemplate';
import { apiFetchBeforeRegister } from '../api/vendor-service';
import Toast from '../components/common/Toast';
import { useLocation } from 'react-router-dom';

export default function Welcome() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [vendor, setVendor] = useState(null);

  // ✅ Toast 상태
  const [toast, setToast] = useState({ show: false, message: '' });
  const closeToast = () => setToast({ show: false, message: '' });

  // ✅ location으로부터 전달된 메시지 확인
  const location = useLocation();
  const consumedRef = useRef(false);

  useEffect(() => {
    const msg = location.state?.toastMessage;
    if (!consumedRef.current && msg) {
      consumedRef.current = true; // 딱 한 번만
      setToast({ show: true, message: msg });
      // 새로고침 시 재실행 방지
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError('');
        const { success, result, message } = await apiFetchBeforeRegister();
        if (!success || !result) throw new Error(message || '업체 정보를 불러오지 못했습니다.');

        const fullAddress = [result.address, result.detailAddress].filter(Boolean).join('\n');

        setVendor({
          vendorId: result.vendorId,
          name: result.name,
          category: result.category,
          address: result.address,
          detailAddress: result.detailAddress,
          fullAddress,
          introduction: result.introduction,
          introductionImage: Array.isArray(result.introductionImage)
            ? result.introductionImage
            : [],
          state: result.state, // ex) NONE
        });
      } catch (e) {
        setError(e?.message || '업체 정보를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const tplProps = useMemo(() => ({ loading, error, vendor }), [loading, error, vendor]);

  return (
    <div>
      <WelcomeTemplate {...tplProps} />
      {toast.show && toast.message && (
        <Toast show={true} message={toast.message} onClose={closeToast} duration={1500} />
      )}
    </div>
  );
}
