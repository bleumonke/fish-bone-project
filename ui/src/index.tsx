import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import DiagramDetail from './pages/DiagramDetail';
import MainLayout from './layouts/MainLayout';
import AuthPage from './pages/AuthPage';

import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/signup" element={<AuthPage mode="signup" />} />

        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="diagram/:id" element={<DiagramDetail />} />
        </Route>
      </Routes>
    </Router>
  </React.StrictMode>
);
