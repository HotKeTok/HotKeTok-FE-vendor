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
