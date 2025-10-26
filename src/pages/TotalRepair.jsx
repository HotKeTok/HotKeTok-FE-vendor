import React, { useEffect, useMemo, useState } from 'react';
import TotalRepairTemplate from '../templates/TotalRepairTemplate';
import {
  apiFetchVendorSentEstimates,
  apiFetchVendorProcessingRepairs,
  apiFetchVendorDoneRepairs,
  apiFetchVendorEstimateDetail,
} from '../api/vendor-service';
import { formatYMDWithKoreanTime } from '../utils/date';
import { formatCategoryName } from '../utils/format';

// 안전 Date
const safeDate = input => {
  const d = new Date(input);
  return isNaN(d.getTime()) ? null : d;
};

// ✅ 서버 형식 "YYYY.MM.DD / 오전 HH:MM" → Date (BoxRepairDetail이 Date를 요구)
function parseServerKDatetimeToDate(v) {
  try {
    if (typeof v !== 'string' || !v.includes('/')) return null; // ISO 등은 제외
    const [datePartRaw, timePartRaw] = v.split('/').map(s => s.trim()); // ["2025.10.26", "오전 03:15"]

    const [yStr, mStr, dStr] = datePartRaw.split('.').map(s => s.trim());
    const y = Number(yStr);
    const m = Number(mStr);
    const d = Number(dStr);
    if (!y || !m || !d) return null;

    const [korAmPm, hm] = timePartRaw.split(' ').map(s => s.trim()); // "오전", "03:15"
    const [hStr, minStr] = (hm || '').split(':');
    let h = Number(hStr);
    const mm = Number(minStr);
    if (Number.isNaN(h) || Number.isNaN(mm)) return null;

    const isPM = korAmPm.includes('오후');
    const isAM = korAmPm.includes('오전');
    if (isPM && h < 12) h += 12;
    if (isAM && h === 12) h = 0;

    const dt = new Date(y, m - 1, d, h, mm, 0, 0);
    return isNaN(dt.getTime()) ? null : dt;
  } catch {
    return null;
  }
}

// 비용부담자 문자열
const payTypeToBearer = (payType, payerName) => {
  if (payerName) return payerName;
  if (payType === 'RESIDENT') return '입주민';
  if (payType === 'PROPRIETORSHIP') return '집주인';
  return '';
};

// 이미지 배열 정규화
const normalizeImages = v => {
  if (!v) return [];
  if (Array.isArray(v)) return v.filter(Boolean);
  if (typeof v === 'string') {
    return v
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
  }
  return [];
};

// 서버가 이미 "YYYY.MM.DD / 오전 hh:mm" 형식이면 그대로, 아니면 포맷팅
const asServerKDatetime = v =>
  typeof v === 'string' && v.includes(' / ') ? v : formatYMDWithKoreanTime(v);

// ✅ 서버 상태값 → UI 상태값 매핑
// SEARCHING(서버) → CHOOSING(UI)
// 나머지는 그대로 통과 (MATCHING/REJECTED/COMPLETED 등)
const mapStatusToUI = s => {
  if (s === 'SEARCHING') return 'CHOOSING';
  return s || undefined;
};

export default function TotalRepair() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState({ count: 0, items: [] });
  const [ongoing, setOngoing] = useState({ count: 0, items: [] });
  const [done, setDone] = useState({ count: 0, items: [] });
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError('');

        const [r1, r2, r3] = await Promise.all([
          apiFetchVendorSentEstimates(),
          apiFetchVendorProcessingRepairs(),
          apiFetchVendorDoneRepairs(),
        ]);

        // 1) 보낸 견적서 (좌측) — COMPLETED 제외
        const sentSrc = r1?.result ?? { count: 0, estimates: [] };
        const sentItems = (sentSrc.estimates || [])
          .filter(e => e?.status !== 'COMPLETED')
          .map(e => ({
            id: String(e.estimateId),
            status: e.status === 'REJECTED' ? 'REJECTED' : 'CHOOSING',
            title: formatCategoryName(e.category),
            location: e.address,
            // 서버 문자열 그대로 전달
            datetimeStr: asServerKDatetime(e.estimateTime),
            // 모달에서 날짜는 문자열로만 쓰므로 Date 불필요
            repairDate: null,
            amount: undefined,
            costBearer: '',
            contact: '',
            description: '',
            estimateDetails: '',
            symptomPhotos: [],
          }));
        setSent({ count: sentSrc.count ?? sentItems.length, items: sentItems });

        // 2) 진행중 (중앙) — BoxRepairDetail이 Date를 사용하므로 변환 필요
        const onSrc = r2?.result ?? { count: 0, requestForm: [] };
        const onItems = (onSrc.requestForm || []).map(e => {
          // 서버 문자열(또는 ISO) 모두 처리 가능한 파서
          const scheduledAt =
            parseServerKDatetimeToDate(e.estimateTime) || safeDate(e.estimateTime) || null;

          return {
            id: String(e.estimateId),
            status: mapStatusToUI(e.status) || 'MATCHING',
            title: formatCategoryName(e.category),
            location: e.address,
            repairDate: scheduledAt, // ✅ BoxRepairDetail 내부에서 new Date(...) 사용
            amount:
              typeof e.estimatePrice === 'number' ? e.estimatePrice : Number(e.estimatePrice || 0),
            costBearer: payTypeToBearer(e.payType, e.payerName),
            contact: e.phoneNumber || '',
            // 🔑 '내용' 칸에 estimateComment를 우선 보여주도록 매핑
            description: e.requestDescription || e.estimateComment || '',
            // 모달에서 따로 쓰는 필드는 그대로 유지
            estimateDetails: e.estimateComment || '',
            symptomPhotos: normalizeImages(e.requestImage),
          };
        });
        setOngoing({ count: onSrc.count ?? onItems.length, items: onItems });

        // 3) 처리 완료 (우측) — 서버 포맷 그대로 사용
        const doneSrc = r3?.result ?? { count: 0, estimates: [] };
        const doneItems = (doneSrc.estimates || []).map(e => ({
          id: String(e.estimateId),
          status: 'COMPLETED',
          title: formatCategoryName(e.category),
          location: e.address,
          datetimeStr: asServerKDatetime(e.estimateTime),
        }));
        setDone({ count: doneSrc.count ?? doneItems.length, items: doneItems });
      } catch (err) {
        setError(err?.message || '수리 목록 조회 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /** 상세 조회: 카드 클릭 시 호출 */
  const loadDetail = async estimateId => {
    const { success, result, message } = await apiFetchVendorEstimateDetail(estimateId);
    if (!success || !result) throw new Error(message || '상세 정보를 불러오지 못했습니다.');

    const d = result;

    return {
      id: String(d.estimateId),
      status: mapStatusToUI(d.status) || 'MATCHING',
      title: formatCategoryName(d.category),
      location: d.address,
      datetimeStr: asServerKDatetime(d.estimateTime), // 모달 “수리 일시”는 문자열 그대로
      repairDate: null, // 모달은 문자열만 쓰도록 유지
      amount: typeof d.estimatePrice === 'number' ? d.estimatePrice : Number(d.estimatePrice || 0),
      costBearer: payTypeToBearer(d.payType, d.payerName),
      contact: d.phoneNumber || '',
      description: d.requestDescription || '',
      estimateDetails: d.estimateComment || '',
      symptomPhotos: normalizeImages(d.requestImage),
    };
  };

  const sentProps = useMemo(() => ({ count: sent.count, items: sent.items }), [sent]);
  const ongoingProps = useMemo(() => ({ count: ongoing.count, items: ongoing.items }), [ongoing]);
  const doneProps = useMemo(() => ({ count: done.count, items: done.items }), [done]);

  return (
    <TotalRepairTemplate
      loading={loading}
      error={error}
      sentQuotes={sentProps}
      ongoingRepairs={ongoingProps}
      doneRepairs={doneProps}
      loadDetail={loadDetail}
    />
  );
}
