// src/pages/Welcome.jsx
import React, { useEffect, useState, useMemo } from 'react';
import WelcomeTemplate from '../templates/WelcomeTemplate';
import { apiFetchBeforeRegister } from '../api/vendor-service';

export default function Welcome() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [vendor, setVendor] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError('');
        const { success, result, message } = await apiFetchBeforeRegister();
        if (!success || !result) {
          throw new Error(message || '업체 정보를 불러오지 못했습니다.');
        }

        // 결과 정규화 (UI에 바로 쓰기 편하게)
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
          state: result.state, // NONE | ...
        });
      } catch (e) {
        setError(e?.message || '업체 정보를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 템플릿에 넘길 props (UI는 그대로)
  const tplProps = useMemo(
    () => ({
      loading,
      error,
      vendor, // { name, category, fullAddress, introduction, introductionImage, state, ... }
    }),
    [loading, error, vendor]
  );

  return (
    <div>
      <WelcomeTemplate {...tplProps} />
    </div>
  );
}
