import React from 'react';
import { BrowserRouter, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { Layout } from './styles/layout';
import { IS_BG_WHITE_PATHS } from './styles/layout';
import { color } from './styles/tokens';

import InitProcess from './pages/InitProcess';
import Dashboard from './pages/Dashboard';
import FindRepair from './pages/FindRepair';
import Chat from './pages/Chat';
import MyPage from './pages/MyPage';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import TotalRepair from './pages/TotalRepair';

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

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 기본 레이아웃으로 감싸는 페이지 */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/find-repair" element={<FindRepair />} />
          <Route path="/total-repair" element={<TotalRepair />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/my-page" element={<MyPage />} />
        </Route>

        {/* Layout이 필요 없는 페이지 */}
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/init-process" element={<InitProcess />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
