import React from 'react';
import { BrowserRouter, Routes, Route, Outlet, useLocation, Navigate } from 'react-router-dom';
import { Layout } from './styles/layout';
import { IS_BG_WHITE_PATHS } from './styles/layout';
import { getAccessToken } from './utils/auth'; // ✅ 토큰 유틸 불러오기

import InitProcess from './pages/InitProcess';
import Dashboard from './pages/Dashboard';
import FindRepair from './pages/FindRepair';
import Chat from './pages/Chat';
import MyPage from './pages/MyPage';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import TotalRepair from './pages/TotalRepair';
import Welcome from './pages/Welcome';

/* ---------------------------
 * ✅ 로그인 상태 체크 컴포넌트
 * --------------------------- */
const ProtectedRoute = () => {
  const token = getAccessToken();
  if (!token) {
    // 로그인 안되어 있으면 sign-in으로 이동
    return <Navigate to="/sign-in" replace />;
  }
  return <Outlet />; // 통과
};

/* ---------------------------
 * ✅ 공통 레이아웃
 * --------------------------- */
const AppLayout = () => {
  const { pathname } = useLocation();
  const isBgWhite = IS_BG_WHITE_PATHS.map(path => pathname.startsWith(path)).includes(true);
  const bgColor = isBgWhite ? '#fff' : '#F5F6F6';

  return (
    <Layout bgColor={bgColor}>
      <Outlet />
    </Layout>
  );
};

/* ---------------------------
 * ✅ 라우터 구성
 * --------------------------- */
function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🔒 보호된 페이지 (로그인 필요) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/find-repair" element={<FindRepair />} />
            <Route path="/total-repair" element={<TotalRepair />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/my-page" element={<MyPage />} />
          </Route>

          {/* 레이아웃이 필요 없는 보호된 페이지 */}
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/init-process" element={<InitProcess />} />
        </Route>

        {/* 🆓 비로그인 접근 허용 페이지 */}
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />

        {/* 잘못된 경로는 로그인 페이지로 */}
        <Route path="*" element={<Navigate to="/sign-in" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
