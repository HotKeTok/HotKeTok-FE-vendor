// src/pages/FindRepair.jsx
import React, { useEffect, useState } from 'react';
import FindRepairTemplate from '../templates/FindRepairTemplate';
import { apiFetchVendorRequests, apiFetchVendorRequestDetail } from '../api/vendor-service';
import { apiCreateEstimate } from '../api/estimate-service'; // ✅ 추가

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
  const [submitting, setSubmitting] = useState(false); // ✅ 견적 제출 로딩
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
          phone: formatPhone(item.phone ?? ''),
          images: [],
          description: '',
        }));

        if (!active) return;
        setRequests(mapped);
        setSelectedId(mapped[0]?.id ?? null);
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
        console.error(err);
      } finally {
        if (alive) setLoadingDetail(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [selectedId]);

  // 3) 견적 제출 핸들러 (템플릿 → QuoteSheet가 호출)
  const handleSubmitEstimate = async ({ estimatePriceDigits, decisionLater, comment }) => {
    if (!selectedId) throw new Error('선택된 요청이 없습니다.');
    try {
      setSubmitting(true);
      const payload = {
        requestFormId: Number(selectedId),
        estimatePrice: decisionLater ? 0 : Number(estimatePriceDigits || 0),
        decisionLater: Boolean(decisionLater),
        comment: comment ?? '',
      };
      const { success, message } = await apiCreateEstimate(payload);
      if (!success) throw new Error(message || '견적서 전송 실패');
      // 성공 시: 특별한 후속 UI가 없다면 여기서 끝.
      return true;
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingList) return <div style={{ padding: 24 }}>불러오는 중…</div>;
  if (error) return <div style={{ padding: 24, color: '#d00' }}>{error}</div>;

  return (
    <FindRepairTemplate
      requests={requests}
      selectedId={selectedId}
      onSelect={setSelectedId}
      selectedDetail={selectedDetail}
      loadingDetail={loadingDetail}
      onSubmitEstimate={handleSubmitEstimate}
      submittingEstimate={submitting}
    />
  );
}
