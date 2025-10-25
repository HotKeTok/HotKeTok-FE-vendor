// src/pages/FindRepair.jsx
import React, { useEffect, useState } from 'react';
import FindRepairTemplate from '../templates/FindRepairTemplate';
import { apiFetchVendorRequests } from '../api/vendor-service';

// ✅ 유틸 가져오기
import { formatYMDWithKoreanTime } from '../utils/date';
import { formatCategoryName, formatPhone } from '../utils/format';

/**
 * 서버에서 내려주는 다양한 날짜 포맷을 화면용으로 통일
 * 1) 이미 "YYYY.MM.DD / 오전·오후 h:mm" → 그대로 사용
 * 2) 하이픈 포맷 "YYYY-MM-DD-HH-mm" → ISO로 변환 후 formatYMDWithKoreanTime
 * 3) ISO 8601 형식 "2025-10-25T12:00:00Z" → formatYMDWithKoreanTime
 * 4) 그 외 → 그대로 반환
 */
function displayDateTime(value) {
  if (!value || typeof value !== 'string') return '';

  if (value.includes(' / ') && (value.includes('오전') || value.includes('오후'))) {
    return value;
  }

  if (/^\d{4}-\d{2}-\d{2}-\d{2}-\d{2}$/.test(value)) {
    const [y, m, d, hh, mm] = value.split('-');
    const iso = `${y}-${m}-${d}T${hh}:${mm}:00`;
    return formatYMDWithKoreanTime(iso);
  }

  if (value.includes('T')) {
    return formatYMDWithKoreanTime(value);
  }

  return value;
}

export default function FindRepair() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        setLoading(true);
        setError('');

        const { success, result, message } = await apiFetchVendorRequests();
        if (!success) throw new Error(message || '요청 목록을 불러오지 못했습니다.');

        const list = Array.isArray(result?.request) ? result.request : [];

        // ✅ 서버 응답 → UI 모델 매핑
        const mapped = list.map(item => ({
          id: String(item.requestId),
          title: formatCategoryName(item.category ?? '수리 요청'), // "문_창문" → "문/창문"
          address: item.address ?? '',
          requestedAt: displayDateTime(item.estimateTime),
          preferredDate: displayDateTime(item.estimateTime),
          costPayer: '-', // 서버 명세 없음
          phone: formatPhone(item.phone ?? ''), // 안전하게 포맷
          images: [],
          description: '',
        }));

        if (active) setRequests(mapped);
      } catch (err) {
        if (active) {
          setError(err?.message || '알 수 없는 오류가 발생했습니다.');
          setRequests([]);
        }
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  if (loading) return <div style={{ padding: 24 }}>불러오는 중…</div>;
  if (error) return <div style={{ padding: 24, color: '#d00' }}>{error}</div>;

  return <FindRepairTemplate requests={requests} />;
}
