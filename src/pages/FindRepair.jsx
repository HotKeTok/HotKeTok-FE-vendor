// src/pages/FindRepair.jsx
import React, { useEffect, useState } from 'react';
import FindRepairTemplate from '../templates/FindRepairTemplate';
import { apiFetchVendorRequests, apiFetchVendorRequestDetail } from '../api/vendor-service';

import { formatYMDWithKoreanTime } from '../utils/date';
import { formatCategoryName, formatPhone } from '../utils/format';

function displayDateTime(value) {
  if (!value || typeof value !== 'string') return '';
  if (value.includes(' / ') && (value.includes('오전') || value.includes('오후'))) return value;
  if (/^\d{4}-\d{2}-\d{2}-\d{2}-\d{2}$/.test(value)) {
    const [y, m, d, hh, mm] = value.split('-');
    const iso = `${y}-${m}-${d}T${hh}:${mm}:00`;
    return formatYMDWithKoreanTime(iso);
  }
  if (value.includes('T')) return formatYMDWithKoreanTime(value);
  return value;
}

// 상세 응답의 payerType → UI 표기
function mapPayerTypeToKorean(t) {
  if (t === 'PROPRIETORSHIP') return '집주인';
  if (t === 'RESIDENT') return '입주민';
  return '-';
}

export default function FindRepair() {
  const [requests, setRequests] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const [selectedDetail, setSelectedDetail] = useState(null);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [error, setError] = useState('');

  // 1) 목록 로드
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoadingList(true);
        setError('');
        const { success, result, message } = await apiFetchVendorRequests();
        if (!success) throw new Error(message || '요청 목록을 불러오지 못했습니다.');

        const list = Array.isArray(result?.request) ? result.request : [];
        const mapped = list.map(item => ({
          id: String(item.requestId),
          title: formatCategoryName(item.category ?? '수리 요청'),
          address: item.address ?? '',
          requestedAt: displayDateTime(item.estimateTime),
          preferredDate: displayDateTime(item.estimateTime),
          costPayer: '-', // 목록에는 없음
          phone: formatPhone(item.phone ?? ''), // 안전 처리
          images: [],
          description: '',
        }));

        if (!active) return;
        setRequests(mapped);
        setSelectedId(mapped[0]?.id ?? null); // 첫 항목 선택
      } catch (err) {
        if (!active) return;
        setError(err?.message || '알 수 없는 오류가 발생했습니다.');
        setRequests([]);
        setSelectedId(null);
      } finally {
        if (active) setLoadingList(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // 2) 선택 변경 시 상세 로드
  useEffect(() => {
    let alive = true;
    (async () => {
      if (!selectedId) {
        setSelectedDetail(null);
        return;
      }
      try {
        setLoadingDetail(true);
        const { success, result, message } = await apiFetchVendorRequestDetail(selectedId);
        if (!success) throw new Error(message || '요청 상세를 불러오지 못했습니다.');

        // 상세 → 템플릿 모델로 매핑
        const detail = {
          id: String(selectedId),
          title: formatCategoryName(result?.category ?? '수리 요청'),
          address: result?.address ?? '',
          requestedAt: displayDateTime(result?.estimateTime),
          preferredDate: displayDateTime(result?.estimateTime),
          costPayer: mapPayerTypeToKorean(result?.payerType),
          phone: formatPhone(result?.phoneNumber ?? ''),
          images: Array.isArray(result?.requestImage) ? result.requestImage : [],
          description: result?.comment ?? '',
          payerName: result?.payerName ?? '',
        };

        if (!alive) return;
        setSelectedDetail(detail);
      } catch (err) {
        if (!alive) return;
        setSelectedDetail(null);
        // 상세 실패해도 목록은 유지 → 좌측은 빈 상태로 보이게
        console.error(err);
      } finally {
        if (alive) setLoadingDetail(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [selectedId]);

  // 간단한 로딩/에러 표시 (원하면 템플릿 쪽에 로딩 스켈레톤 prop 추가 가능)
  if (loadingList) return <div style={{ padding: 24 }}>불러오는 중…</div>;
  if (error) return <div style={{ padding: 24, color: '#d00' }}>{error}</div>;

  return (
    <FindRepairTemplate
      requests={requests}
      selectedId={selectedId}
      onSelect={setSelectedId}
      selectedDetail={selectedDetail}
      loadingDetail={loadingDetail}
    />
  );
}
