import React, { useState } from 'react';
import DashboardTemplate from '../templates/DashboardTemplate';
import { DASHBOARD_DUMMY_DATA } from '../mocks/dashboard';

export default function Dashboard() {
  // 수리 현황별 개수 조회
  const [repairCounts, setRepairCounts] = useState(DASHBOARD_DUMMY_DATA.repairCounts);

  const [currentDate, setCurrentDate] = useState(new Date()); // 캘린더의 연/월
  const [selectedDate, setSelectedDate] = useState(new Date()); // 선택된 날짜

  // 캘린더 데이터
  const [calendarData, setCalendarData] = useState(DASHBOARD_DUMMY_DATA.calendarData);

  // 특정 날짜 수리 데이터 조회
  const [selectedDateRepairs, setSelectedDateRepairs] = useState(
    DASHBOARD_DUMMY_DATA.selectedDateRepairs
  );

  // TODO: 수리 현황 (new, in-progress, completed) 건수 api 연결
  // TODO: 날짜별 수리 현황 차트 api 연결
  // TODO: 특정 날짜의 수리 데이터 api 연결

  return (
    <DashboardTemplate
      repairCounts={repairCounts}
      currentDate={currentDate}
      selectedDate={selectedDate}
      setCurrentDate={setCurrentDate}
      setSelectedDate={setSelectedDate}
      calendarData={calendarData}
      selectedDateRepairs={selectedDateRepairs}
    />
  );
}
