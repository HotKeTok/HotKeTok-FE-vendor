import React from 'react';
import styled from 'styled-components';
import { typo, color } from '../../styles/tokens';
import { Row } from '../../styles/flex';
import { PROGRESS_STATUS_MAP } from '../../constants/Repair';
import TimeChip from './TimeChip';
import { formatTime } from '../../utils/date';
import ArrowRightIcn from '../../assets/common/icon-arrow-right.svg?react';
import RepairStatusChip from '../common/RepairStatusChip';

const getStatusColor = status => {
  return PROGRESS_STATUS_MAP[status]?.textColor || color.black;
};

/**
 * @param {Object} repair - 수리 데이터 객체
 * @param {boolean} isToday - 오늘 수리 건인지 여부 (TimeChip 명시용)
 */
export default function RepairDetailBox({ repair, isToday = true }) {
  if (!repair) {
    return null;
  }

  const { status, title, location, repairDate, amount, costBearer, contact, description } = repair;

  return (
    <Container>
      {isToday && (
        <Header>
          <TimeChip time={formatTime(repairDate)} />
          <RepairStatusChip status={status} />
        </Header>
      )}

      {
        <Row $justify="space-between" $align="center">
          <Title>
            <div>{title} </div>
            <StyledArrowRightIcn />
          </Title>
          {!isToday && <StatusText $status={status}>{status} </StatusText>}
        </Row>
      }
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
  border: 1px solid ${color('grayscale.200')};
`;

const Header = styled(Row)`
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

// TODO: 공통 컴포넌트로 대체
const StatusText = styled.span`
  ${typo('body2')};
  font-weight: 600;
  color: ${({ $status }) => getStatusColor($status)};
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
