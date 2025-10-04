import React from 'react';
import styled, { css } from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { typo, color } from '../../styles/tokens';

import DashboardIcon from '../../assets/common/icon-dashboard.svg?react';
import FindIcon from '../../assets/common/icon-find.svg?react';
import RepairIcon from '../../assets/common/icon-repair.svg?react';
import ChatIcon from '../../assets/common/icon-chat.svg?react';
import MyPageIcon from '../../assets/common/icon-mypage.svg?react';

export default function Navbar() {
  const { pathname } = useLocation();

  // 현재 경로에 따라 활성화 상태를 결정하는 로직은 그대로 유지합니다.
  const isDashboardActive = pathname === '/';
  const isFindRepairActive = pathname === '/find-repair';
  const isRepairActive = pathname.startsWith('/total-repair');
  const isChatActive = pathname === '/chat';
  const isMyPageActive = pathname.startsWith('/my-page');

  return (
    <Container>
      <img src="/logo.svg" alt="Logo" />
      <Nav>
        <NavItem to="/" $active={isDashboardActive}>
          <DashboardIcon />
          대시보드
        </NavItem>
        <NavItem to="/find-repair" $active={isFindRepairActive}>
          <FindIcon />
          수리 찾기
        </NavItem>
        <NavItem to="/total-repair" $active={isRepairActive}>
          <RepairIcon />
          뚝딱
        </NavItem>
        <NavItem to="/chat" $active={isChatActive}>
          <ChatIcon />
          채팅
        </NavItem>
        <NavItem to="/my-page" $active={isMyPageActive}>
          <MyPageIcon />
          마이
        </NavItem>
      </Nav>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
`;

const Nav = styled.nav`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
`;

const NavItem = styled(Link)`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 13px;
  text-decoration: none;
  ${typo('subtitle1')}

  width: 100%;
  padding: 16px;
  border-radius: 10px;
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;

  background-color: ${({ $active }) => ($active ? 'rgba(1, 210, 129, 0.10)' : 'transparent')};
  color: ${({ $active }) => ($active ? color('brand.primary') : color('grayscale.600'))};

  svg {
    width: 20px;
    height: 20px;
    path {
      stroke: ${({ $active }) => ($active ? color('brand.primary') : color('grayscale.600'))};
    }
    circle {
      fill: ${({ $active }) => ($active ? color('brand.primary') : color('grayscale.600'))};
    }
  }

  &:hover {
    background-color: ${({ $active }) => !$active && color('grayscale.200')};
  }
`;
