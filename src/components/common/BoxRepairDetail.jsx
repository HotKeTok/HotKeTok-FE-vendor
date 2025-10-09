// src/components/common/BoxRepairDetail.jsx
import React from 'react';
import styled from 'styled-components';
import { typo, color } from '../../styles/tokens';
import { Row } from '../../styles/flex';
import TimeChip from '../dashboard/TimeChip';
import { formatTime } from '../../utils/date';
import ArrowRightIcn from '../../assets/common/icon-arrow-right.svg?react';
import RepairStatusChip from './RepairStatusChip';

/**
 * @param {Object} repair - 수리 데이터 객체
 * @param {boolean} isToday - 오늘 수리 건인지 여부 (TimeChip 명시용)
 * @param {function} onDetailClick - 상세보기 클릭 핸들러
 * @param {object} style - 추가 스타일링용
 * @param {string} borderColor - 컨테이너 테두리 색상
 * @param {boolean} hideStatusChip - true면 상태칩 표시 안 함
 */
export default function BoxRepairDetail({
  repair,
  isToday = false,
  onDetailClick,
  style,
  borderColor,
  hideStatusChip = false,
}) {
  if (!repair) return null;

  const { id, status, title, location, repairDate, amount, costBearer, contact, description } =
    repair;

  return (
    <Container style={style} $borderColor={borderColor} onClick={() => onDetailClick?.(id)}>
      {isToday && !hideStatusChip && (
        <Header>
          <TimeChip time={formatTime(repairDate)} />
          <RepairStatusChip status={status} />
        </Header>
      )}

      <Row $justify="space-between" $align="center">
        <Title>
          <div>{title}</div>
          <StyledArrowRightIcn />
        </Title>
        {!isToday && !hideStatusChip && <RepairStatusChip status={status} />}
      </Row>

      <Location>{location}</Location>

      <InfoTable>
        {!isToday && (
          <InfoRow
            label="수리 일시"
            value={`${new Date(repairDate).toLocaleDateString()} / ${formatTime(repairDate)}`}
          />
        )}
        <InfoRow label="금액" value={`${amount.toLocaleString()}원`} />
        <InfoRow label="비용 부담" value={costBearer} />
        <InfoRow label="전화번호" value={contact} />
        <InfoRow label="내용" />
      </InfoTable>

      <DescriptionBox>{description}</DescriptionBox>
    </Container>
  );
}

/* =========================
 * 하위 컴포넌트 및 스타일
 * ========================= */
const InfoRow = ({ label, value }) => (
  <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
    <Label>{label}</Label>
    <Value>{value}</Value>
  </Row>
);

const Container = styled.div`
  background-color: ${color('grayscale.100')};
  border-radius: 20px;
  padding: 24px 30px;
  border: 1px solid ${({ $borderColor }) => $borderColor || color('grayscale.200')};
  cursor: pointer;
  transition: all 0.15s ease;
  cursor: pointer;
  transition: box-shadow 0.15s ease, transform 0.05s ease;
  &:hover {
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  }
  &:active {
    transform: translateY(1px);
  }
`;

const Header = styled(Row)`
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const Title = styled.h4`
  ${typo('h3')};
  color: black;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 13px;
  margin-bottom: 8px;
  cursor: pointer;
`;

const StyledArrowRightIcn = styled(ArrowRightIcn)`
  path {
    stroke: black;
  }
`;

const Location = styled.p`
  ${typo('body2')};
  color: black;
  margin-bottom: 24px;
`;

const InfoTable = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
`;

const Label = styled.span`
  ${typo('button2')};
  color: black;
`;

const Value = styled.span`
  ${typo('body2')};
  color: ${color('grayscale.600')};
`;

const DescriptionBox = styled.div`
  background-color: ${color('grayscale.100')};
  border-radius: 6px;
  border: 1px solid ${color('grayscale.200')};
  padding: 13px 15px;
  ${typo('body2')};
  color: black;
`;
