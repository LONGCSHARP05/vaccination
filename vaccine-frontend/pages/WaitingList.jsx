/**
 * WaitingList.jsx
 * Danh sách chờ khám của bác sĩ
 * Chỉ hiển thị VaccinationSession có status = 'SCREENED' AND screeningResult = 'APPROVED'
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWaitingList } from '../hooks/useDoctorWorkspace';
import '../assets/waitinglist.css';


const WaitingList = () => {
  const navigate = useNavigate();
  const { sessions, loading, error, refetch } = useWaitingList();
  const [searchText, setSearchText] = useState('');

  const filtered = sessions.filter((s) => {
    const name = s?.customer?.fullName || s?.customerName || '';
    const code = s?.vaccinationCode || s?.sessionCode || '';
    return (
      name.toLowerCase().includes(searchText.toLowerCase()) ||
      code.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  const handleOpenWorkspace = (session) => {
    navigate(`/bac-si/workspace/${session.id}`);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const calcAge = (dob) => {
    if (!dob) return '';
    const diff = Date.getTime() - new Date(dob).getTime();
    return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
  };

  return (
    <div className="wl-page">
      {/* HEADER */}
      <div className="wl-header">
        <div className="wl-header-left">
          <h2 className="wl-title">Danh sách chờ khám</h2>
          <span className="wl-badge">{filtered.length} khách hàng</span>
        </div>
        <div className="wl-header-right">
          <div className="wl-search-wrap">
            <svg className="wl-search-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              className="wl-search-input"
              placeholder="Tìm theo tên, mã tiêm chủng..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <button className="wl-btn-refresh" onClick={refetch} title="Làm mới">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
              <path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
              <path d="M8 16H3v5"/>
            </svg>
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="wl-content">
        {loading && (
          <div className="wl-loading">
            <div className="wl-spinner" />
            <span>Đang tải danh sách...</span>
          </div>
        )}

        {error && (
          <div className="wl-error">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span>{error}</span>
            <button onClick={refetch}>Thử lại</button>
          </div>
        )}

        {!loading && !error && (
          <div className="wl-table-wrap">
            <table className="wl-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Mã phiếu</th>
                  <th>Họ và tên</th>
                  <th>Ngày sinh</th>
                  <th>Giới tính</th>
                  <th>SĐT</th>
                  <th>Giờ đăng ký</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="wl-empty">
                      <div className="wl-empty-inner">
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                        </svg>
                        <p>Không có khách hàng chờ khám</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((session, idx) => {
                    const customer = session?.customer || {};
                    const dob = customer?.dateOfBirth || customer?.dob;
                    return (
                      <tr key={session.id} className="wl-row">
                        <td className="wl-cell-num">{idx + 1}</td>
                        <td className="wl-cell-code">{session.vaccinationCode || session.sessionCode || `#${session.id?.slice(-6)}`}</td>
                        <td className="wl-cell-name">
                          {/* Bấm vào tên → vào màn bác sĩ */}
                          <button
                            className="wl-name-link"
                            onClick={() => handleOpenWorkspace(session)}
                          >
                            {customer?.fullName || session?.customerName || '—'}
                          </button>
                        </td>
                        <td>
                          {dob
                            ? `${new Date(dob).toLocaleDateString('vi-VN')} (${calcAge(dob)} tuổi)`
                            : '—'}
                        </td>
                        <td>{customer?.gender === 'MALE' ? 'Nam' : customer?.gender === 'FEMALE' ? 'Nữ' : '—'}</td>
                        <td>{customer?.phone || customer?.phoneNumber || '—'}</td>
                        <td>{formatDate(session.createdAt || session.registeredAt)}</td>
                        <td>
                          <span className="wl-status-badge wl-status-approved">
                            Chờ tiêm
                          </span>
                        </td>
                        <td>
                          <button
                            className="wl-btn-examine"
                            onClick={() => handleOpenWorkspace(session)}
                          >
                            Khám ngay
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default WaitingList;