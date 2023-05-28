import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

const Channel = React.lazy(() => import('@pages/Channel'));
const LogIn = React.lazy(() => import('@pages/LogIn'));
const SignUp = React.lazy(() => import('@pages/SignUp'));

const App = () => {
  //어플리케이션이 진입부터 login이 필요함
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/workspace/channel" element={<Channel />} />

        {/* 기본 redirect */}
        <Route path="/" element={<Navigate to="/login" />} />
        {/* 없는 페이지 접근 */}
        <Route path="*" element={<p>404 Not Found</p>} />
      </Routes>
    </Suspense>
  );
};

export default App;
