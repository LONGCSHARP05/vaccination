// src/layouts/MainLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

function MainLayout() {
  return (
    <div className="main-layout">
      {/* Cột trái: Sidebar cố định */}
      <Sidebar />
      
      {/* Cột phải: Nội dung thay đổi theo route (Không làm load lại trang) */}
      <main className="main-content">
        <Outlet /> 
      </main>
    </div>
  );
}

export default MainLayout;