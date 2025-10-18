// src/api/infra-service.js
import api from './client';

// 도로명 주소 검색 (인증 필수)
export async function apiSearchRoadAddress({
  keyword,
  currentPage = 0,
  countPerPage = 10,
  resultType = 'json',
}) {
  const q = String(keyword || '').trim();
  if (!q) return { success: false, data: [], message: '검색어를 입력해주세요.' };

  const qs = new URLSearchParams({
    currentPage: String(currentPage),
    countPerPage: String(countPerPage),
    resultType: String(resultType),
    keyword: q,
  }).toString();

  // 인터셉터가 Authorization 부여
  const { data } = await api.get(`/infra-service/getAddress?${qs}`);

  const success =
    data?.success === true || data?.status === 200 || String(data?.code || '') === '200';

  const list = Array.isArray(data?.data) ? data.data : [];

  return {
    success,
    data: list, // [{ roadAddr, jibunAddr }]
    message: data?.message ?? '',
  };
}
