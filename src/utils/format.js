export const formatPhone = phone => {
  if (!phone) {
    return '';
  }

  const cleaned = phone.replace(/\D/g, '');

  const truncated = cleaned.slice(0, 11);
  const { length } = truncated;

  if (length > 7) {
    return `${truncated.slice(0, 3)}-${truncated.slice(3, 7)}-${truncated.slice(7)}`;
  }
  if (length > 3) {
    return `${truncated.slice(0, 3)}-${truncated.slice(3)}`;
  }
  return truncated;
};

// 수리 분야 명 변경 함수
// ex) '문_창문' -> '문/창문'
export function formatCategoryName(value) {
  if (!value || typeof value !== 'string') return '';
  return value.replace(/_/g, '/');
}

// 숫자 문자열을 천단위 콤마로 포맷
// ex) "1000000" → "1,000,000"

export function formatWithCommas(value) {
  if (value == null || value === '') return '';
  const clean = String(value).replace(/[^\d]/g, '');
  if (clean === '') return '';
  return Number(clean).toLocaleString('ko-KR');
}
