import React from 'react';
import styled from 'styled-components';
import { color, typo } from '../styles/tokens';
import RepairStatusBox from '../components/dashboard/RepairStatusBox';
import Calendar from '../components/dashboard/Calendar';
import RepairDetailBox from '../components/dashboard/RepairDetailBox';
import { Column, Row } from '../styles/flex';

export default function DashboardTemplate({
  repairCounts, // (1) 수리 현황별 개수
  currentDate, // (2) 현재 캘린더의 연/월
  selectedDate, // (2)(3) 현재 클릭된 날짜
  selectedDateRepairs, // (3) 특정 날짜의 수리 데이터
  calendarData, // (2) 캘린더 월 단위 데이터
  setCurrentDate, // (2) 캘린더의 연/월 설정 함수
  setSelectedDate, // (2) 선택된 날짜 설정 함수
}) {
  return (
    <Container>
      <div>
        {/* 수리 현황 */}
        <Subtitle1>수리 현황</Subtitle1>
        <GridContainer>
          {Object.entries(repairCounts).map(([status, count]) => (
            <RepairStatusBox key={status} status={status} count={count} />
          ))}
        </GridContainer>
        <Calendar
          calendarData={calendarData}
          currentDate={currentDate}
          selectedDate={selectedDate}
          onDateChange={setCurrentDate}
          onDateSelect={setSelectedDate}
        />
      </div>

      <RightContainer>
        <Column $gap={2}>
          <H3>오늘의 일정</H3>
          <Caption1>총 2개의 일정이 있어요.</Caption1>
        </Column>
        <RightScrollContainer>
          {selectedDateRepairs.map((repair, index) => (
            <RepairDetailBox key={index} repair={repair} />
          ))}
        </RightScrollContainer>
      </RightContainer>
    </Container>
  );
}

const Container = styled.div`
  height: 100%;

  padding-bottom: 18px;
  box-sizing: border-box;

  display: grid;
  grid-template-columns: 32fr 23fr;
  column-gap: 16px;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 16px;

  margin-top: 10px;
  margin-bottom: 16px;
`;

const RightContainer = styled.div`
  background-color: #fff;
  border-radius: 20px;
  padding: 20px;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  gap: 10px;

  overflow: hidden;
`;

const RightScrollContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  min-height: 0;

  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Subtitle1 = styled.div`
  ${typo('subtitle1')};
  color: black;
`;

const H3 = styled.div`
  ${typo('h3')};
  color: black;

  flex-shrink: 0;
`;

const Caption1 = styled.div`
  ${typo('caption1')};
  color: ${color('grayscale.600')};
`;
