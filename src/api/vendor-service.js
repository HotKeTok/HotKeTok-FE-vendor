import api from './client';
import { getAccessToken } from '../utils/auth';
/** 공통 성공 판정 */
const isOk = d =>
  d?.isSuccess === true || d?.success === true || d?.code === 'COMMON200' || d?.status === 200;

// POST : 수리업체 등록
export async function apiVendorRegister({ data, file, images }) {
  const mainFile = file instanceof File ? file : file?.file instanceof File ? file.file : null;
  if (!mainFile || mainFile.size === 0) {
    throw new Error('사업자등록증 파일을 첨부해주세요.');
  }

  const isImageLike = f => {
    if (!(f instanceof File) || f.size === 0) return false;
    const mime = (f.type || '').toLowerCase();
    if (mime.startsWith('image/')) return true; // image/png, image/jpeg, image/svg+xml 등
    const name = (f.name || '').toLowerCase();
    return /\.(png|jpe?g|webp|gif|bmp|heic|heif|svg)$/.test(name);
  };

  const safeImages = (images || [])
    .map(img => (img instanceof File ? img : img?.file))
    .filter(isImageLike);

  if (safeImages.length === 0) {
    throw new Error('소개 이미지를 최소 1장 첨부해주세요.');
  }

  const form = new FormData();
  safeImages.forEach(f => form.append('images', f, f.name || 'image'));
  form.append('file', mainFile, mainFile.name || 'file');

  const json = JSON.stringify(data ?? {});
  form.append('data', new Blob([json], { type: 'application/json' }));

  const { data: res } = await api.post('/vendor-service/register', form);
  return res;
}

// GET: 안증 전 수리업체 정보 조회
export async function apiFetchBeforeRegister() {
  const token = getAccessToken?.();
  const { data } = await api.get('/vendor-service/before-register', {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  return {
    success: isOk(data),
    raw: data ?? null,
    result: data?.data ?? null, // { vendorId, name, category, address, detailAddress, introduction, introductionImage, state }
    message: data?.message ?? '',
  };
}

// GET : 수리업체가 받은 수리 요청 목록 조회
export async function apiFetchVendorRequests() {
  const token = getAccessToken();

  const { data } = await api.get('/vendor-service/request', {
    headers: { Authorization: `Bearer ${token}` },
  });

  const success =
    data?.isSuccess === true ||
    data?.success === true || // ✅ 서버가 success로 내려주는 케이스
    data?.code === 'COMMON200' ||
    data?.status === 200;

  // ✅ result 또는 data 어느 쪽이든 지원
  const payload = data?.result ?? data?.data ?? null;

  return {
    success,
    raw: data ?? null,
    result: payload, // ← 템플릿에서 그대로 result.request 사용 가능
    message: data?.message ?? '',
  };
}

// GET : 수리 요청 상세 조회
export async function apiFetchVendorRequestDetail(requestId) {
  if (!requestId && requestId !== 0) {
    throw new Error('상세 조회를 위한 requestId가 필요합니다.');
  }
  const token = getAccessToken();

  const { data } = await api.get('/vendor-service/request-detail', {
    headers: { Authorization: `Bearer ${token}` },
    params: { requestId }, // ✅ 쿼리 파라미터
  });

  const success =
    data?.isSuccess === true ||
    data?.success === true ||
    data?.code === 'COMMON200' ||
    data?.status === 200;

  const payload = data?.result ?? data?.data ?? null;

  return {
    success,
    raw: data ?? null,
    result: payload, // { category, address, estimateTime, ... }
    message: data?.message ?? '',
  };
}

/** 1) 보낸 견적서 조회: GET /vendor-service/estimate */
export async function apiFetchVendorSentEstimates() {
  const token = getAccessToken?.();
  const { data } = await api.get('/vendor-service/estimate', {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return {
    success: isOk(data),
    raw: data ?? null,
    result: data?.data ?? null, // { count, estimates: [...] }
    message: data?.message ?? '',
  };
}

/** 2) 진행 중인 수리 조회: GET /vendor-service/processing */
export async function apiFetchVendorProcessingRepairs() {
  const token = getAccessToken?.();
  const { data } = await api.get('/vendor-service/processing', {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return {
    success: isOk(data),
    raw: data ?? null,
    result: data?.data ?? null, // { count, requestForm: [...] }
    message: data?.message ?? '',
  };
}

/** 3) 처리 완료 수리 조회: GET /vendor-service/done */
export async function apiFetchVendorDoneRepairs() {
  const token = getAccessToken?.();
  const { data } = await api.get('/vendor-service/done', {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return {
    success: isOk(data),
    raw: data ?? null,
    result: data?.data ?? null, // { count, estimates: [...] }
    message: data?.message ?? '',
  };
}

/** ✅ 견적서 상세 조회: GET /vendor-service/estimate-detail?estimateId= */
export async function apiFetchVendorEstimateDetail(estimateId) {
  if (estimateId === undefined || estimateId === null) {
    throw new Error('estimateId가 필요합니다.');
  }
  const token = getAccessToken?.();
  const { data } = await api.get('/vendor-service/detail', {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    params: { estimateId },
  });
  return {
    success: isOk(data),
    raw: data ?? null,
    result: data?.data ?? null, // { estimateId, category, address, ... }
    message: data?.message ?? '',
  };
}
