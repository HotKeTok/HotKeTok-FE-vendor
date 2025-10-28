// src/pages/FindRepair.jsx
import React, { useCallback, useEffect, useState } from 'react';
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
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // ✅ 목록 불러오기 함수
  const loadList = useCallback(async () => {
    setLoadingList(true);
    setError('');
    try {
      const { success, result, message } = await apiFetchVendorRequests();
      if (!success) throw new Error(message || '요청 목록을 불러오지 못했습니다.');

      const list = Array.isArray(result?.request) ? result.request : [];
      const mapped = list.map(item => ({
        id: String(item.requestId),
        title: formatCategoryName(item.category ?? '수리 요청'),
        address: item.address ?? '',
        requestedAt: displayDateTime(item.estimateTime),
        preferredDate: displayDateTime(item.estimateTime),
        costPayer: '-',
        phone: formatPhone(item.phone ?? ''),
        images: [],
        description: '',
      }));

      setRequests(mapped);

      // selectedId가 사라졌다면 첫 번째로 포커스 이동
      if (!mapped.some(v => v.id === selectedId)) {
        setSelectedId(mapped[0]?.id ?? null);
        setSelectedDetail(null);
      }
    } catch (err) {
      setRequests([]);
      setSelectedId(null);
      setError(err?.message || '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoadingList(false);
    }
  }, [selectedId]);

  // ✅ 상세 불러오기 함수
  const loadDetail = useCallback(async id => {
    if (!id) {
      setSelectedDetail(null);
      return;
    }
    setLoadingDetail(true);
    try {
      const { success, result, message } = await apiFetchVendorRequestDetail(id);
      if (!success) throw new Error(message || '요청 상세를 불러오지 못했습니다.');

      const detail = {
        id: String(id),
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
      setSelectedDetail(detail);
    } catch (err) {
      setSelectedDetail(null);
      console.error(err);
    } finally {
      setLoadingDetail(false);
    }
  }, []);

  // 1) 마운트 시 목록 로드
  useEffect(() => {
    let active = true;
    (async () => {
      if (active) await loadList();
    })();
    return () => {
      active = false;
    };
  }, [loadList]);

  // 2) 선택 변경 시 상세 로드
  useEffect(() => {
    let alive = true;
    (async () => {
      if (alive) await loadDetail(selectedId);
    })();
    return () => {
      alive = false;
    };
  }, [selectedId, loadDetail]);

  // 3) 견적 제출 시 목록/상세 갱신
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

      // 상세 즉시 비우기 → UI에서 바로 사라짐
      setSelectedDetail(null);
      setSelectedId(null);

      // 그 다음 최신 목록 로드
      await loadList();

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
