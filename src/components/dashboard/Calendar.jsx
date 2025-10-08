import React, { useMemo } from 'react';
import styled from 'styled-components';
import { typo, color } from '../../styles/tokens';
import ArrowRightIcn from '../../assets/common/icon-arrow-right.svg?react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
} from 'date-fns';

const WEEK_DAYS = ['일', '월', '화', '수', '목', '금', '토'];

export default function Calendar({
  currentDate,
  onDateChange,
  selectedDate,
  onDateSelect,
  calendarData,
}) {
  // key-value 형태의 Map으로 변환
  const dataMap = useMemo(() => {
    return new Map(calendarData.map(item => [item.date, item]));
  }, [calendarData]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  return (
    <Wrapper>
      {/* 헤더 영역 */}
      <Header>
        <ArrowButton onClick={() => onDateChange(subMonths(currentDate, 1))}>
          <StyledArrowLeftIcn />
        </ArrowButton>
        <span>{format(currentDate, 'yyyy년 M월')}</span>
        <ArrowButton onClick={() => onDateChange(addMonths(currentDate, 1))}>
          <StyledArrowRightIcn />
        </ArrowButton>
      </Header>

      {/* 달력 그리드 */}
      <Grid>
        {WEEK_DAYS.map(day => (
          <DayLabel key={day}>{day}</DayLabel>
        ))}
        {days.map(day => {
          const dayData = dataMap.get(format(day, 'yyyy-MM-dd'));

          const repairCount = dayData ? dayData.repairs.length : 0;
          const backgroundOpacity = repairCount * 0.1;

          return (
            <DateCell
              key={day.toString()}
              onClick={() => onDateSelect(day)}
              $isInCurrentMonth={isSameMonth(day, monthStart)}
              $isToday={isToday(day)}
              $isSelected={isSameDay(day, selectedDate)}
              $backgroundOpacity={backgroundOpacity}
            >
              <span>{format(day, 'd')}</span>
              {dayData && (
                <DataContainer>
                  {dayData.repairs.map(repair => (
                    <TypeText key={repair.id}>{repair.type}</TypeText>
                  ))}
                </DataContainer>
              )}
            </DateCell>
          );
        })}
      </Grid>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  padding: 20px;
  border-radius: 20px;
  background-color: #fff;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  ${typo('button2')};

  padding: 13px 17px;
`;

const ArrowButton = styled.button`
  height: 100%;

  background: none;
  border: none;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledArrowRightIcn = styled(ArrowRightIcn)`
  width: 8px;
  height: 13px;

  path {
    stroke: ${color('grayscale.800')};
  }
`;

const StyledArrowLeftIcn = styled(StyledArrowRightIcn)`
  transform: rotate(180deg);
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
`;

const DayLabel = styled.div`
  text-align: center;
  ${typo('button3')};
  color: ${color('grayscale.300')};
  padding-top: 15px;
  padding-bottom: 15px;

  border-bottom: 1px solid #d9d9d9;
  margin-bottom: 15px;
`;

const DateCell = styled.div`
  position: relative;
  height: 82px;
  padding: 2px 8px;
  border-radius: 4px;
  cursor: pointer;

  // 수리 건수에 따른 배경색 조절
  background-color: ${({ $backgroundOpacity }) =>
    $backgroundOpacity == 0 ? color('grayscale.100') : `rgba(1, 210, 129, ${$backgroundOpacity})`};

  // 선택된 날짜 테두리
  border-width: ${({ $isSelected }) => ($isSelected ? '1.5px' : '0.5px')};
  border-style: solid;
  border-color: ${({ $isSelected }) =>
    $isSelected ? 'rgba(1, 210, 129, 0.50)' : color('grayscale.200')};

  // 오늘 날짜 스타일
  & > span:first-child {
    ${({ $isToday }) => ($isToday ? typo('button2') : typo('body2'))};
    color: ${({ $isToday }) => ($isToday ? color('brand.primary') : 'black')};
  }

  overflow: scroll;
`;

const DataContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  align-items: flex-start;
`;

const TypeText = styled.div`
  background-color: rgba(250, 250, 251, 0.6);
  border-radius: 4px;
  padding-left: 4px;
  padding-right: 4px;

  color: ${color('grayscale.600')};
  font-size: 8px;
  font-weight: 400;
  line-height: 14px;
`;
