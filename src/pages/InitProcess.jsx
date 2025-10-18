// src/pages/InitProcess.jsx
import React, { useState } from 'react';
import InitProcessTemplate from '../templates/InitProcessTemplate';
import { apiVendorRegister } from '../api/vendor-service';
import { apiSearchRoadAddress } from '../api/infra-service';

// 명세: raw = { roadAddr, jibunAddr }
function normalizeItem(raw, idx) {
  const roadFull = String(raw?.roadAddr || '').trim();
  const jibunFull = String(raw?.jibunAddr || '').trim();

  // UI: 도로명(전체) 1행, 지번은 보조표기로
  return {
    id: `${Date.now()}_${idx}`,
    road: roadFull, // "서울특별시 동작구 노량진로6가길 1 (노량진동)"
    building: '', // 명세에는 별도 건물명 필드 없음 → 공란
    jibun: jibunFull, // "서울특별시 동작구 노량진동 263-11"
    // 필요 시 나중에 sido/sigungu 파생 필드 추가.
  };
}

export default function InitProcess() {
  const [submitting, setSubmitting] = useState(false);

  const onRegister = async ({ data, file, images }) => {
    try {
      setSubmitting(true);
      const res = await apiVendorRegister({ data, file, images });
      return res;
    } catch (e) {
      return { success: false, message: e?.message || '등록 중 오류가 발생했어요.' };
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ 도로명 주소 검색
  const onSearchAddress = async ({ keyword, page = 0, size = 10 }) => {
    const q = String(keyword || '').trim();
    if (q.length < 2) {
      return { success: false, results: [], message: '검색어는 2자 이상 입력해 주세요.' };
    }
    try {
      const res = await apiSearchRoadAddress({
        keyword: q,
        currentPage: page,
        countPerPage: size,
        resultType: 'json',
      });

      const list = Array.isArray(res?.data) ? res.data : [];
      return {
        success: !!res?.success,
        results: list.map((it, i) => normalizeItem(it, i)),
        message: res?.message || (list.length ? '' : '검색 결과가 없습니다.'),
      };
    } catch (e) {
      return { success: false, results: [], message: e?.message || '주소 검색 중 오류' };
    }
  };

  return (
    <InitProcessTemplate
      onRegister={onRegister}
      onSearchAddress={onSearchAddress}
      submitting={submitting}
    />
  );
}
