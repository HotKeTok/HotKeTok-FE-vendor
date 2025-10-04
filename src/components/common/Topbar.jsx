import styled from 'styled-components';
import { color, typo } from '../../styles/tokens';
import { Row } from '../../styles/flex';
import { PATH_TITLE } from '../../constants/PathTitle';
import { useLocation, useNavigate } from 'react-router-dom';

import AlarmIcn from '../../assets/common/icon-alarm.svg?react';
import ProfileIcn from '../../assets/common/icon-profile-default.svg?react';
// TODO: 실제 프로필 이미지로 교체 필요

export default function Topbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const title = PATH_TITLE[pathname] || '';

  const handleAlarmClick = () => {
    // TODO: 바텀시트 오픈
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
