/**
 * @description 주어진 ISO string의 시간만 "오전 10:00" 형식으로 반환하는 함수
 */
export function formatTime(isoString) {
  const date = new Date(isoString);
  const options = { hour: '2-digit', minute: '2-digit', hour12: true };
  return date.toLocaleTimeString('ko-KR', options);
}
