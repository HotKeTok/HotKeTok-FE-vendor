import React, { useEffect, useState } from 'react';
import DashboardTemplate from '../templates/DashboardTemplate';
import { DASHBOARD_DUMMY_DATA } from '../mocks/dashboard';
import { getAccessToken } from '../utils/auth';
import {
  getDashboardRepairCalendar,
  getDashboardRepairCount,
  getDashboardRepairScheduleByDate,
} from '../api/vendor-dashboard-service';

export default function Dashboard() {
  const accessToken = getAccessToken();

  // 수리 현황별 개수 조회
  const [repairCounts, setRepairCounts] = useState({
    new_request: 0,
    processing_request: 0,
    done_request: 0,
  });

  const [currentDate, setCurrentDate] = useState(new Date()); // 캘린더의 연/월
  const [selectedDate, setSelectedDate] = useState(new Date()); // 선택된 날짜

  // 캘린더 데이터
  const [calendarData, setCalendarData] = useState(DASHBOARD_DUMMY_DATA.calendarData);

  // 특정 날짜 수리 데이터 조회
  const [selectedDateRepairs, setSelectedDateRepairs] = useState(
    DASHBOARD_DUMMY_DATA.selectedDateRepairs
  );

  // TODO: 수리 현황 (new, in-progress, completed) 건수 api 연결
  const fetchRepairCounts = async () => {
    try {
      const response = await getDashboardRepairCount();
      if (response.success && response.data) {
        setRepairCounts(response.data);
      }
    } catch (error) {
      console.error('Error fetching repair counts:', error);
    }
  };

  // TODO: 날짜별 수리 현황 차트 api 연결
  const fetchCalendarData = async (year, month) => {
    try {
      const response = await getDashboardRepairCalendar(year, month);
      if (response.success && response.data) {
        setCalendarData(response.data.calendar_data);
      }
    } catch (error) {
      console.error('Error fetching calendar data:', error);
    }
  };

  // TODO: 특정 날짜의 수리 데이터 api 연결
  const fetchRepairsByDate = async date => {
    try {
      const response = await getDashboardRepairScheduleByDate(date);
      if (response.success && response.data) {
        setSelectedDateRepairs(response.data.requestForm);
      } else {
        setSelectedDateRepairs([]);
      }
    } catch (error) {
      console.error('Error fetching repairs by date:', error);
    }
  };

  useEffect(() => {
    fetchRepairCounts();
    fetchCalendarData(currentDate.getFullYear(), currentDate.getMonth() + 1);
  }, [accessToken]);

  useEffect(() => {
    if (selectedDate) fetchRepairsByDate(selectedDate);
  }, [selectedDate]);

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
