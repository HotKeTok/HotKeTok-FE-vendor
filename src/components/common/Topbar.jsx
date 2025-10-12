import styled from 'styled-components';
import { typo } from '../../styles/tokens';
import { Row } from '../../styles/flex';
import { PATH_TITLE } from '../../constants/PathTitle';
import { useLocation, useNavigate } from 'react-router-dom';

import AlarmIcn from '../../assets/common/icon-alarm.svg?react';
import ProfileIcn from '../../assets/common/icon-profile-default.svg?react';

import { OverlayContext } from '../../styles/OverlayContext';
import NotificationPanel from './NotificationPanel';
import { useContext } from 'react';

// TODO: 실제 프로필 이미지로 교체 필요

export default function Topbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { setOverlayContent } = useContext(OverlayContext);

  const title = PATH_TITLE[pathname] || '';

  const handleAlarmClick = () => {
    setOverlayContent(<NotificationPanel />);
  };

  const handleProfileClick = () => {
    navigate('/my-page');
  };

  return (
    <Row $justify="space-between" $align="center" style={{ width: '100%' }}>
      <Title>{title}</Title>
      <Row $gap={12} $justify="flex-end" $align="center">
        <AlarmIcn style={{ cursor: 'pointer' }} onClick={handleAlarmClick} />
        <ProfileIcn style={{ cursor: 'pointer' }} onClick={handleProfileClick} />
      </Row>
    </Row>
  );
}

const Title = styled.div`
  ${typo('h3')};
  color: black;
`;
