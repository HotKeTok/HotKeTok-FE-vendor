import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Outlet, useLocation, Navigate } from 'react-router-dom';
import { Layout } from './styles/layout';
import { IS_BG_WHITE_PATHS } from './styles/layout';
import { getAccessToken, clearAuth } from './utils/auth'; // ✅ useAuthStore 제거

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
 * ✅ 로그인 상태 체크
 * --------------------------- */
const ProtectedRoute = () => {
  const token = getAccessToken();
  if (!token) return <Navigate to="/sign-in" replace />;
  return <Outlet />;
};

/* ---------------------------
 * ✅ /sign-in 진입 시 자동 로그아웃
 * --------------------------- */
const SignInWithAutoLogout = () => {
  useEffect(() => {
    clearAuth(); // ✅ 로컬스토리지 토큰 제거
  }, []);
  return <SignIn />; // 기존 SignIn UI 그대로
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
        {/* 🆓 비로그인 접근 허용 */}
        <Route path="/sign-in" element={<SignInWithAutoLogout />} />
        <Route path="/sign-up" element={<SignUp />} />

        {/* 🔒 로그인 필요한 페이지 */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/find-repair" element={<FindRepair />} />
            <Route path="/total-repair" element={<TotalRepair />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/my-page" element={<MyPage />} />
          </Route>

          <Route path="/welcome" element={<Welcome />} />
          <Route path="/init-process" element={<InitProcess />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>

        {/* 잘못된 경로 → sign-in으로 */}
        <Route path="*" element={<Navigate to="/sign-in" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
