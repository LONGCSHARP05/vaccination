// src/components/Sidebar.jsx
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { removeToken } from '../utils/storage';
import { 
  LayoutDashboard, 
  Syringe, 
  BookOpenText, 
  CalendarDays, 
  Building2, 
  BrainCircuit, 
  UserCircle, 
  LogOut,
  Menu
} from 'lucide-react';
import '../assets/sidebar.css';

const MENU_ITEMS = [
  { path: '/dashboard', label: 'Tổng quan', icon: LayoutDashboard },
  { path: '/vaccines', label: 'Quản lý danh mục vaccine', icon: Syringe },
  { path: '/staff/patients', label: 'Quản lý sổ tiêm chủng', icon: BookOpenText },
  { path: '/appointments', label: 'Lịch tiêm chủng', icon: CalendarDays },
  { path: '/facilities', label: 'Đơn vị và nhân sự', icon: Building2 },
  { path: '/ai-insights', label: 'Thống kê và dự báo AI', icon: BrainCircuit },
];

function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : 'expanded'}`}>
      <div className="sidebar-header">
        <div className="logo-text">Anora</div>
        <button 
          className="toggle-btn" 
          onClick={() => setIsCollapsed(!isCollapsed)}
          title="Thu/Phóng Sidebar"
        >
          <Menu size={24} />
        </button>
      </div>

      <div className="sidebar-nav">
        {MENU_ITEMS.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path} 
            className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
          >
            <item.icon size={22} className="nav-icon" />
            <span className="nav-text">{item.label}</span>
          </NavLink>
        ))}
      </div>

      <div className="sidebar-footer">
        <NavLink to="/profile" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <UserCircle size={22} className="nav-icon" />
          <span className="nav-text">Thông tin tài khoản</span>
        </NavLink>
        <button onClick={handleLogout} className="nav-item logout-btn">
          <LogOut size={22} className="nav-icon" />
          <span className="nav-text">Đăng xuất</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;