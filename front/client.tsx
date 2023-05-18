import { createRoot } from 'react-dom/client';
import React from 'react';
import App from '@layouts/App';
import { BrowserRouter as Router } from 'react-router-dom';

const container = document.getElementById('app');
const root = createRoot(container!); // createRoot(container!) if you use TypeScript
root.render(
  <Router>
    <App />
  </Router>,
);

// pages - 서비스 페이지
// components - 공유되는 작은 컴포넌트
// layouts - 공통 레이아웃
