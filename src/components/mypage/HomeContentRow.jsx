import styled from 'styled-components';
import { typo, color } from '../../styles/tokens';
import ArrowRightIcn from '../../assets/common/icon-arrow-right.svg?react';

export default function HomeContentRow({ isEmpty, icon: Icon, label, values, onOpen }) {
  return (
    <Row>
      <IconWrapper>
        <Icon />
      </IconWrapper>
      {isEmpty ? (
        <Row $justify="flex-start" style={{ cursor: 'pointer' }} onClick={onOpen}>
          <Value style={{ color: '#9a9a9a' }}>{label}을 입력해주세요</Value>
          <StyledArrowRightIcn />
        </Row>
      ) : (
        values.map(v => (
          <Value key={v.id} style={{ color: v.color }}>
            {v.value}
          </Value>
        ))
      )}
    </Row>
  );
}

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const IconWrapper = styled.div`
  width: 24px;
  height: 24px;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const Value = styled.div`
  ${typo('body2')}
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StyledArrowRightIcn = styled(ArrowRightIcn)`
  width: 8px;
  height: 8px;

  path {
    stroke: ${color('grayscale.500')};
  }
`;
