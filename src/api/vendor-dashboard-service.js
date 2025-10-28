import client from './client.js';

// GET 대시보드 수리 개수 조회
export async function getDashboardRepairCount() {
  const { data } = await client.get('/vendor-service/dashboard', {});
  return {
    success: data.success,
    data: data?.data ?? null,
  };
}

// GET 수리 일정 캘린더
export async function getDashboardRepairCalendar(year, month) {
  const { data } = await client.get(`/vendor-service/calendar?year=${year}&month=${month}`);
  return {
    success: data.success,
    data: data?.data ?? null,
  };
}

// GET 특정 날짜 수리 일정 조회
export async function getDashboardRepairScheduleByDate(date) {
  const { data } = await client.get('/vendor-service/day', {
    params: {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    },
  });
  return {
    success: data.success,
    data: data?.data ?? null,
  };
}
