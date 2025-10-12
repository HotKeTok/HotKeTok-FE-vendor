import React, { useContext } from 'react';
import styled from 'styled-components';
import { color, typo } from '../../styles/tokens';
import { OverlayContext } from '../../styles/OverlayContext';

import CloseIcn from '../../assets/common/icon-close.svg?react';
import AlarmIcn from '../../assets/common/icon-alarm-filled.svg?react';

import { MOCK_ALARM_DATA } from '../../mocks/alarm';
import { formatTimeAgo } from '../../utils/date';
import { Row } from '../../styles/flex';

const AlarmItem = ({ alarm }) => {
  return (
    <AlarmItemContainer>
      <Row $justify="space-between" style={{ width: '100%' }}>
        <Row $gap={8} $align="center">
          <IconWrapper>
            <AlarmIcn />
          </IconWrapper>
          <Title>{alarm.title}</Title>
        </Row>
        <Timestamp>{formatTimeAgo(alarm.createdAt)}</Timestamp>
      </Row>

      <Content>{alarm.content}</Content>
    </AlarmItemContainer>
  );
};

export default function NotificationPanel() {
  const { clearOverlay } = useContext(OverlayContext);

  return (
    <PanelContainer>
      <Row $gap={8} $align="center" style={{ paddingBottom: 10 }}>
        <CloseButton onClick={clearOverlay}>
          <CloseIcn width={10} height={10} />
        </CloseButton>
        <H3>알림</H3>
      </Row>
      <AlarmList>
        {MOCK_ALARM_DATA.length > 0 ? (
          MOCK_ALARM_DATA.map(alarm => <AlarmItem key={alarm.id} alarm={alarm} />)
        ) : (
          <EmptyMessage>새로운 알림이 없습니다.</EmptyMessage>
        )}
      </AlarmList>
    </PanelContainer>
  );
}

const PanelContainer = styled.div`
  width: 390px;
  height: 100%;
  background-color: #ffffff;
  padding: 30px 20px;

  border-radius: 30px 0px 0px 30px;
  box-shadow: -10px 0px 30px rgba(0, 0, 0, 0.1);

  display: flex;
  flex-direction: column;
`;

const H3 = styled.div`
  ${typo('h3')};
  color: ${color('grayscale.800')};
`;

const CloseButton = styled.button`
  padding: 13px;

  background: none;
  border: none;
  cursor: pointer;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const AlarmList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 10px 0;

  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const AlarmItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px 12px;

  gap: 6px;
  border: 1px solid ${color('grayscale.200')};
  border-radius: 10px;

  &:hover {
    background-color: ${color('grayscale.100')};
  }
`;

const IconWrapper = styled.div`
  flex-shrink: 0;
`;

const Title = styled.div`
  ${typo('button2')};
  color: black;
`;

const Content = styled.div`
  ${typo('caption1')};
  color: ${color('grayscale.800')};
`;

const Timestamp = styled.div`
  ${typo('caption1')};
  color: ${color('grayscale.500')};
`;

const EmptyMessage = styled.div`
  ${typo('body1')};
  color: ${color('grayscale.500')};
  text-align: center;
  margin-top: 40px;
`;
