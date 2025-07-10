import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import DiagramDetail from './pages/DiagramDetail';
import MainLayout from './layouts/MainLayout';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="diagram/:id" element={<DiagramDetail />} />
        </Route>
      </Routes>
    </Router>
  </React.StrictMode>
);
