import styled from 'styled-components';
import { typo, color } from '../../styles/tokens';
import ClockIcn from '../../assets/common/icon-clock.svg?react';

export default function TimeChip({ time }) {
  return (
    <Chip>
      <ClockIcn />
      <Time>{time}</Time>
    </Chip>
  );
}

const Chip = styled.div`
  background-color: #e6f1fd;
  border-radius: 14px;
  padding: 5px 10px 6px;

  display: flex;
  flex-direction: row;
  gap: 6px;
  align-items: center;
`;

const Time = styled.div`
  ${typo('button3')};

  color: #5b82ad;
`;
