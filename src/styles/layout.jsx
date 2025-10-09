import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import NavBar from '../components/common/Navbar';
import Topbar from '../components/common/Topbar';
import { OverlayContext } from './OverlayContext';

export const IS_BG_WHITE_PATHS = ['/my-page'];

const AppContainer = styled.div`
  display: grid;
  grid-template-areas:
    'sidebar main'
    'sidebar main';
  grid-template-columns: 13.5vw 1fr;
  grid-template-rows: 12.7vh 1fr;
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
  padding: 0px 42px;
  overflow-y: auto;
`;

/* ========== Overlay 전체 화면 덮기 (사이드바 제외) ========== */
const OverlayRoot = styled.div`
  position: fixed;
  top: 0; /* 헤더 포함 */
  left: 13.5vw; /* 사이드바 오른쪽부터 */
  width: calc(100vw - 13.5vw);
  height: 100vh;
  z-index: 3000;

  /* 오른쪽 끝에 패널을 붙이기 위한 컨테이너 */
  display: flex;
  align-items: stretch;
  justify-content: flex-end;

  /* 🔹 배경은 투명! (좌측/헤더를 덮지 않음) */
  background: transparent;

  /* 오버레이 자체는 클릭 통과, 자식 패널만 클릭 가능 */
  pointer-events: none;
  & > * {
    pointer-events: auto;
  }
`;

export const Layout = ({ bgColor, children }) => {
  const [overlayContent, setOverlayContent] = useState(null);
  const location = useLocation();

  const ctxValue = useMemo(
    () => ({
      isOpen: !!overlayContent,
      setOverlayContent: node => setOverlayContent(node),
      clearOverlay: () => setOverlayContent(null),
    }),
    [overlayContent]
  );

  // ✅ 라우트(탭) 변경될 때마다 Overlay 닫기
  useEffect(() => {
    setOverlayContent(null);
  }, [location.pathname]);

  return (
    <OverlayContext.Provider value={ctxValue}>
      <AppContainer style={{ backgroundColor: bgColor }}>
        <Header style={{ backgroundColor: bgColor }}>
          <Topbar />
        </Header>
        <Sidebar>
          <NavBar />
        </Sidebar>
        <MainContent style={{ backgroundColor: bgColor }}>{children}</MainContent>

        {/* 🔹 오버레이 (헤더 포함 전체 덮기) */}
        {overlayContent ? <OverlayRoot>{overlayContent}</OverlayRoot> : null}
      </AppContainer>
    </OverlayContext.Provider>
  );
};

export default Layout;
