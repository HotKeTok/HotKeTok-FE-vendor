import React from 'react';
import styled from 'styled-components';
import { color } from './tokens';
import NavBar from '../components/common/Navbar';
import Topbar from '../components/common/Topbar';

// 기본 배경: grayscale.300, 그렇지 않은 경우 #fff
export const IS_BG_WHITE_PATHS = ['/my-page'];

const AppContainer = styled.div`
  display: grid;
  grid-template-areas:
    'sidebar main'
    'sidebar main';
  grid-template-columns: 13.5vw 1fr; // 사이드바 너비 고정
  grid-template-rows: 12.7vh 1fr; // 헤더 높이 고정
  width: 100vw;
  height: 100vh;
  overflow: hidden;
`;

// 헤더 영역 (절대 위치, 컨텐츠 위에 고정)
const Header = styled.header`
  position: fixed;
  top: 0;
  margin-left: 13.5vw; // 사이드바 너비만큼 밀어내기

  width: 86.5vw; // 사이드바 너비만큼 줄이기
  display: flex;
  align-items: center;
  padding: 28px 40px;

  z-index: 100;
`;

// 사이드바 영역
const Sidebar = styled.aside`
  grid-area: sidebar;

  background-color: #fff;
  border-radius: 0px 30px 30px 0px;
  box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.05);
  padding: 40px 20px 0px 20px;

  display: flex;
  flex-direction: column;
  align-items: center;
`;

// 메인 콘텐츠 영역
const MainContent = styled.main`
  margin-top: 12.7vh; // 헤더 높이만큼 고정 마진 추가

  grid-area: main;
  padding: 0px 42px; // 좌우 패딩만 적용
  overflow-y: auto;
`;

// 전체 화면 콘텐츠 영역 (헤더/사이드바 없이 전체 화면을 차지)
const FullContent = styled.main`
  grid-area: main;
  padding: 0px;
  overflow-y: auto;
`;

export const Layout = ({ bgColor, children }) => {
  return (
    <AppContainer style={{ backgroundColor: bgColor }}>
      <Header style={{ backgroundColor: bgColor }}>
        <Topbar />
      </Header>
      <Sidebar>
        <NavBar />
      </Sidebar>
      <MainContent style={{ backgroundColor: bgColor }}>{children}</MainContent>
    </AppContainer>
  );
};
