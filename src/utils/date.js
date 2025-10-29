import { parseISO, isToday, format } from 'date-fns';
import { ko } from 'date-fns/locale';

/**
 * @description 주어진 ISO string의 시간만 "오전 10:00" 형식으로 반환하는 함수
 */
export function formatTime(isoString) {
  const date = new Date(isoString);
  const options = { hour: '2-digit', minute: '2-digit', hour12: true };
  return date.toLocaleTimeString('ko-KR', options);
}

/**
 * 날짜 문자열을 조건에 따라 포맷팅하는 함수
 * - 오늘 날짜: '오후 06:18' 형식
 * - 이전 날짜: '2025.10.11' 형식
 * @param {string} isoDate - ISO 8601 형식의 날짜 문자열
 * @returns {string} 변환된 날짜/시간 문자열
 */
export const formatTimeAgo = isoDate => {
  if (!isoDate) return ''; // 입력값이 없을 경우 빈 문자열 반환

  const date = parseISO(isoDate);

  // 1. 오늘 날짜인지 확인합니다.
  if (isToday(date)) {
    // 2. 오늘이면 '오후 hh:mm' 형식으로 포맷팅합니다.
    return format(date, 'a hh:mm', { locale: ko });
  } else {
    // 3. 오늘이 아니면 'yyyy.MM.dd' 형식으로 포맷팅합니다.
    return format(date, 'yyyy.MM.dd');
  }
};

// YYYY.MM.DD 형식으로 변경
export function formatDateToYMD(isoString) {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString; // 잘못된 날짜면 그대로 반환

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}.${month}.${day}`;
  } catch (e) {
    return isoString;
  }
}

/**
 * @description ISO 8601 형식의 날짜 문자열을 "YYYY-MM-DD" 형식으로 변환합니다.
 */
export function formatDateToYYYYMMDD(isoString) {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString; // 잘못된 날짜면 그대로 반환

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  } catch (e) {
    return isoString;
  }
}

/** ISO 문자열 → "오전/오후 h:mm" */
export function formatKoreanAmPmTime(isoString) {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;

    const h24 = date.getHours();
    const mm = String(date.getMinutes()).padStart(2, '0');
    const isAM = h24 < 12;
    let h12 = h24 % 12;
    if (h12 === 0) h12 = 12; // 0시는 12로 표기

    return `${isAM ? '오전' : '오후'} ${h12}:${mm}`;
  } catch (e) {
    return isoString;
  }
}

/** ISO 문자열 → "YYYY.MM.DD / 오전 h:mm" */
export function formatYMDWithKoreanTime(isoString) {
  const d = formatDateToYMD(isoString);
  const t = formatKoreanAmPmTime(isoString);
  if (!d && !t) return '';
  if (!d) return t;
  if (!t) return d;
  return `${d} / ${t}`;
}

// 8시간 전 시간으로 오는 시간을 8시간을 단순히 더해주는 함수
export function toKoreanTime(isoString) {
  const date = new Date(isoString);
  date.setHours(date.getHours() + 9);
  return date.toISOString();
}
