// src/api/estimate-service.js
import api from './client';
import { getAccessToken } from '../utils/auth';

/**
 * POST: 견적서 작성
 * 정상 엔드포인트: /estimate-service
 * (호환 위해 /etimate-service 를 백업 경로로 1회 재시도)
 */
export async function apiCreateEstimate({ requestFormId, estimatePrice, decisionLater, comment }) {
  if (!requestFormId && requestFormId !== 0) {
    throw new Error('requestFormId가 없습니다.');
  }

  const token = getAccessToken();
  const payload = {
    requestFormId: Number(requestFormId),
    estimatePrice: Number(estimatePrice ?? 0),
    decisionLater: Boolean(decisionLater),
    comment: comment ?? '',
  };

  const headers = { Authorization: `Bearer ${token}` };

  // 우선 정상 철자 엔드포인트
  try {
    const { data } = await api.post('/estimate-service', payload, { headers });
    const success =
      data?.isSuccess === true ||
      data?.success === true ||
      data?.code === 'COMMON200' ||
      data?.status === 200;
    const result = data?.result ?? data?.data ?? null;

    return {
      success,
      raw: data ?? null,
      result,
      message: data?.message ?? '',
    };
  } catch (err) {
    // 404 등일 때만 오타 엔드포인트로 1회 재시도
    const status = err?.response?.status;
    if (status !== 404) {
      throw err;
    }
  }

  const { data } = await api.post('/etimate-service', payload, { headers });
  const success =
    data?.isSuccess === true ||
    data?.success === true ||
    data?.code === 'COMMON200' ||
    data?.status === 200;
  const result = data?.result ?? data?.data ?? null;

  return {
    success,
    raw: data ?? null,
    result,
    message: data?.message ?? '',
  };
}
