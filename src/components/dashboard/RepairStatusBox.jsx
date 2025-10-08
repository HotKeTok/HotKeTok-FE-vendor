import styled from 'styled-components';
import { PROGRESS_STATUS_MAP } from '../../constants/Repair';
import { REPAIR_COLOR_MAP } from '../../constants/Dashboard';
import { typo } from '../../styles/tokens';

export default function RepairStatusBox({ status, count }) {
  const backgroundColor = REPAIR_COLOR_MAP[status] || 'gray';

  const { description } = PROGRESS_STATUS_MAP[status] || {};

  return (
    <Box style={{ background: backgroundColor }}>
      <Body2>{description}</Body2>
      <H2>{count}건</H2>
    </Box>
  );
}

const Box = styled.div`
  min-width: 100px;

  padding: 16px 24px;
  border-radius: 20px;
  color: #000;

  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Body2 = styled.div`
  ${typo('body2')};
`;

const H2 = styled.div`
  ${typo('h2')};
`;
