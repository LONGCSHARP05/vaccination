/**
 * WaitingList.jsx - Đã sửa lỗi Mapping Data
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWaitingList } from '../hooks/useDoctorWorkspace';
import '../assets/waitinglist.css';

const WaitingList = () => {
  const navigate = useNavigate();
  const { waitingList, loading } = useWaitingList();
  const refresh = () => {
    setSearchText('');
  }
  const [searchText, setSearchText] = useState('');


  // 1. Logic lọc danh sách (Bao gồm cả tìm theo FullName và FullName của PascalCase)
  const filtered = waitingList.filter((s) => {
    const patient = s?.patient || s?.customer || s;
    const name = patient?.FullName || patient?.fullName || s?.customerName || '';
    const code = s?.vaccinationCode || s?.sessionCode || '';
    
    return (
      name.toLowerCase().includes(searchText.toLowerCase()) ||
      code.toLowerCase().includes(searchText.toLowerCase())
    );
  });


  const handleOpenWorkspace = (sessionId) => {
    // Navigate tới workspace dựa trên ID đúng của Session
    navigate(`/bac-si/workspace/${sessionId}`);
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
    const birthDate = new Date(dob);
    const diff = new Date().getTime() - birthDate.getTime();
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
          <button className="wl-btn-refresh" onClick={refresh} title="Làm mới">
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
        {loading ? (
          <div className="wl-loading">
            <div className="wl-spinner" />
            <span>Đang tải danh sách...</span>
          </div>
        ) : (
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
                        <p>Không có khách hàng chờ khám</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((session, idx) => {
                    // --- LOGIC MAPPING DATA TẠI ĐÂY ---
                    const patient = session?.patient || session?.customer || {};
                    
                    const fullName = patient?.FullName || patient?.fullName || session?.customerName || '—';
                    const dob = patient?.DateOfBirth || patient?.dateOfBirth || patient?.dob;
                    const genderStr = patient?.Gender || patient?.gender;
                    const phone = patient?.Phone || patient?.phone || patient?.phoneNumber || '—';
                    const createdAt = session?.CreatedAt || session?.createdAt || session?.registeredAt;
                    const sessionId = session?.VaccinationSessionID || session?.id;

                    const gender = (genderStr === 'MALE' || genderStr === 'Nam') ? 'Nam' : 
                                   (genderStr === 'FEMALE' || genderStr === 'Nữ') ? 'Nữ' : '—';

                    return (
                      <tr key={sessionId || idx} className="wl-row">
                        <td className="wl-cell-num">{idx + 1}</td>
                        <td className="wl-cell-code">
                           {session.vaccinationCode || session.sessionCode || `#${String(sessionId).slice(-6)}`}
                        </td>
                        <td className="wl-cell-name">
                          <button
                            className="wl-name-link"
                            onClick={() => handleOpenWorkspace(sessionId)}
                          >
                            {fullName}
                          </button>
                        </td>
                        <td>
                          {dob ? `${new Date(dob).toLocaleDateString('vi-VN')} (${calcAge(dob)} tuổi)` : '—'}
                        </td>
                        <td>{gender}</td>
                        <td>{phone}</td>
                        <td>{formatDate(createdAt)}</td>
                        <td>
                          <span className="wl-status-badge wl-status-approved">
                            Chờ khám
                          </span>
                        </td>
                        <td>
                          <button
                            className="wl-btn-examine"
                            onClick={() => handleOpenWorkspace(sessionId)}
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