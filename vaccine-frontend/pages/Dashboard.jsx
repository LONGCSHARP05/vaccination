

// vaccine-frontend/pages/DashboardOverview.jsx
import React from 'react';
import '../assets/dashboard-overview.css';
import { useDashboard } from '../hooks/useDashboard';

// Helper: Lấy màu Avatar tương ứng với trạng thái
const getAvatarClass = (status) => {
  switch (status) {
    case 'Đã tiếp nhận': return 'av-blue';
    case 'Đã khám sàng lọc': return 'av-orange';
    case 'Đang theo dõi': return 'av-purple';
    case 'Trì hoãn': return 'av-red';
    case 'Đã hoàn tất': return 'av-green';
    default: return 'av-blue';
  }
};

// Helper: Lấy màu Badge Trạng thái
const getStatusClass = (status) => {
  switch (status) {
    case 'Đã tiếp nhận': return 'st-exam';
    case 'Đã khám sàng lọc': return 'st-inject';
    case 'Đang theo dõi': return 'st-monitor';
    case 'Trì hoãn': return 'st-delay';
    case 'Đã hoàn tất': return 'st-done';
    default: return 'st-exam';
  }
};

const DashboardOverview = () => {

// Xoá dòng import useAuth (nếu có) và bỏ state error
const { metrics, patients, pagination, loading, search, setSearch, page, setPage, handleRefresh, handleKeyDown } = useDashboard();

const todayString = new Intl.DateTimeFormat('vi-VN', { 
  day: '2-digit', month: 'short' 
}).format(new Date());

// Nếu đang loading thì hiện text/spinner, load xong thì đi tiếp
if (loading) {
  return <div className="p-8 text-center text-slate-500 font-medium">Đang đồng bộ dữ liệu...</div>;
}

// KHÔNG CẦN đoạn if(error) nữa vì lỗi đã được bọc thành data=0 bên hook

// Đảm bảo không bị crash
const safeMetrics = metrics || { waiting_exam: 0, waiting_inject: 0, monitoring: 0, completed: 0 };

// ... phần return ( <div className="dashboard-wrapper"> ... ) giữ nguyên như cũ


  // Đảm bảo không bị crash nếu metrics chưa load kịp
//   const safeMetrics = metrics || { waiting_exam: 0, waiting_inject: 0, monitoring: 0, completed: 0 };

  return (
    <div className="dashboard-wrapper">
      {/* Header Section */}
      <header className="db-header">
        <div>
          <h1 className="db-title font-headline">Bảng điều khiển</h1>
          <p className="db-subtitle">Tổng quan tiến độ tiêm chủng trong ngày</p>
        </div>
        <div className="db-date-badge">
          <span className="material-symbols-outlined text-primary" style={{ fontSize: '18px', color: '#0057cd' }}>
            calendar_today
          </span>
          Hôm nay, {todayString}
        </div>
      </header>

      {/* Bento Grid Metrics (Data Thật) */}
      <section className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-icon icon-exam">
              <span className="material-symbols-outlined">stethoscope</span>
            </div>
          </div>
          <h3 className="metric-label">Đã tiếp nhận</h3>
          <p className="metric-value font-headline">{safeMetrics.waiting_exam}</p>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-icon icon-inject">
              <span className="material-symbols-outlined">vaccines</span>
            </div>
          </div>
          <h3 className="metric-label">Đã khám sàng lọc</h3>
          <p className="metric-value font-headline">{safeMetrics.waiting_inject}</p>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-icon icon-monitor">
              <span className="material-symbols-outlined">vital_signs</span>
            </div>
          </div>
          <h3 className="metric-label">Đang theo dõi</h3>
          <p className="metric-value font-headline">{safeMetrics.monitoring}</p>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-icon icon-done">
              <span className="material-symbols-outlined">check_circle</span>
            </div>
          </div>
          <h3 className="metric-label">Đã hoàn tất</h3>
          <p className="metric-value font-headline">{safeMetrics.completed}</p>
        </div>
      </section>

      {/* Table Section */}
      <section className="table-card">
        <div className="table-toolbar">
          <h2 className="table-title font-headline">Danh sách bệnh nhân</h2>
          <div className="search-filter-group">
            <div className="search-box">
              <span className="material-symbols-outlined search-icon">search</span>
              <input 
                type="text" 
                className="search-input" 
                placeholder="Tìm kiếm tên, CCCD, SĐT..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <button className="btn-filter" onClick={handleRefresh}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>refresh</span>
              Làm mới
            </button>
          </div>
        </div>

        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '60px', textAlign: 'center' }}>Số TT</th>
                <th>Tên bệnh nhân</th>
                <th>Thời gian</th>
                <th>Trạng thái</th>
                <th style={{ textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {patients && patients.length > 0 ? (
                patients.map((patient, index) => (
                  <tr key={patient.id}>
                    <td style={{ textAlign: 'center', color: 'var(--on-surface-variant)', fontWeight: 500 }}>
                      {String(index + 1).padStart(2, '0')}
                    </td>
                    <td>
                      <div className="patient-cell">
                        <div className={`avatar-initial ${getAvatarClass(patient.status)}`}>
                          {patient.initials}
                        </div>
                        <div>
                          <p className="patient-name">{patient.patient_name}</p>
                          <p className="patient-code">{patient.patient_code}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ color: 'var(--on-surface-variant)' }}>{patient.time}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(patient.status)}`}>
                        {patient.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="btn-action">
                        Xử lý <span className="material-symbols-outlined" style={{fontSize: '16px'}}>chevron_right</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--on-surface-variant)' }}>
                    Không có bệnh nhân nào trong danh sách.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <p className="pagination-info">
            Hiển thị <span className="font-medium">{(page - 1) * 10 + 1}</span> đến <span className="font-medium">{(page - 1) * 10 + patients.length}</span> của <span className="font-medium">{pagination.total}</span> kết quả
          </p>
          
          <div className="pagination-controls">
            <button 
                className="page-btn text-btn" 
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
            >
                Trang trước
            </button>
            
            {/* Render số trang đơn giản */}
            {[...Array(pagination.total_pages)].map((_, i) => (
                <button 
                    key={i + 1}
                    className={`page-btn ${page === i + 1 ? 'active' : ''}`}
                    onClick={() => setPage(i + 1)}
                >
                    {i + 1}
                </button>
            ))}

            <button 
                className="page-btn text-btn" 
                disabled={page >= pagination.total_pages}
                onClick={() => setPage(page + 1)}
            >
                Trang sau
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardOverview;