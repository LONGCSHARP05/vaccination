/**
 * CustomerInfoSidebar.jsx
 * Sidebar phải: thông tin cơ bản bệnh nhân + lịch sử tiêm chủng
 */

import React, { useState } from 'react';
import CustomerDetailModal from './CustomerDetailModal';
import '../assets/customerinfosidebar.css';

const CustomerInfoSidebar = ({ customer, vaccinationHistory, loading }) => {
  const [showModal, setShowModal] = useState(false);

  const calcAge = (dob) => {
    if (!dob) return '';
    const diff = new Date() - new Date(dob).getTime();
    const years = Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
    const months = Math.floor((diff % (365.25 * 24 * 60 * 60 * 1000)) / (30.44 * 24 * 60 * 60 * 1000));
    return `${years} tuổi ${months} tháng`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('vi-VN');
  };

  if (loading) {
    return (
      <div className="cis-sidebar">
        <div className="cis-bento cis-skeleton">
          <div className="cis-skel-line cis-skel-title" />
          <div className="cis-skel-line" />
          <div className="cis-skel-line cis-skel-short" />
          <div className="cis-skel-line" />
        </div>
      </div>
    );
  }

  const dob = customer?.dateOfBirth || customer?.dob;
  const phone = customer?.phone || customer?.phoneNumber;
  const gender = customer?.gender === 'MALE' ? 'Nam' : customer?.gender === 'FEMALE' ? 'Nữ' : '—';

  return (
    <div className="cis-sidebar">
      {/* Thông tin bệnh nhân */}
      <div className="cis-bento">
        <div className="cis-bento-header">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="cis-icon">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          <h4 className="cis-bento-title">Thông tin khách hàng</h4>
          <button className="cis-close-btn" title="Đóng">✕ Đóng</button>
        </div>

        <div className="cis-info-grid">
          <div className="cis-info-row">
            <span className="cis-label">Họ và tên</span>
            <span className="cis-value cis-name">
              {customer?.fullName || '—'}
              <button className="cis-detail-link" onClick={() => setShowModal(true)}>
                (Bấm để xem chi tiết)
              </button>
            </span>
          </div>
          <div className="cis-info-row">
            <span className="cis-label">Ngày sinh</span>
            <span className="cis-value">
              {dob ? `${formatDate(dob)} — ${calcAge(dob)}` : '—'}
            </span>
          </div>
          <div className="cis-info-row">
            <span className="cis-label">Giới tính</span>
            <span className="cis-value">{gender}</span>
          </div>
          <div className="cis-info-row">
            <span className="cis-label">SĐT</span>
            <span className="cis-value">{phone || '—'}</span>
          </div>
          {customer?.vaccinationCode && (
            <div className="cis-info-row">
              <span className="cis-label">Mã tiêm chủng</span>
              <span className="cis-value cis-code">{customer.vaccinationCode}</span>
            </div>
          )}
          <div className="cis-info-row">
            <span className="cis-label">Ghi chú KH</span>
            <button className="cis-note-link">+ Thêm ghi chú</button>
          </div>
        </div>
      </div>

      {/* Lịch sử tiêm chủng */}
      <div className="cis-bento cis-history-bento">
        <div className="cis-bento-header">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="cis-icon">
            <path d="M12 8v4l3 3"/><circle cx="12" cy="12" r="10"/>
          </svg>
          <h4 className="cis-bento-title">Lịch sử tiêm chủng</h4>
          <div className="cis-history-actions">
            <button className="cis-hist-btn" title="Làm mới">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                <path d="M21 3v5h-5"/>
              </svg>
            </button>
            <button className="cis-hist-btn cis-hist-btn-add" title="Thêm">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Bảng lịch sử */}
        <div className="cis-hist-table-wrap">
          {vaccinationHistory.length === 0 ? (
            <div className="cis-hist-empty">
              <span className="cis-hist-empty-text">Không có dữ liệu</span>
            </div>
          ) : (
            <table className="cis-hist-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Ngày Tiêm ↑</th>
                  <th>Vắc xin</th>
                  <th>Mũi</th>
                </tr>
              </thead>
              <tbody>
                {vaccinationHistory.map((session, idx) =>
                  (session?.details || []).map((detail, dIdx) => (
                    <tr key={`${session.id}-${dIdx}`}>
                      <td>{idx + 1}</td>
                      <td>{formatDate(session.completedAt || session.createdAt)}</td>
                      <td>{detail?.vaccine?.name || '—'}</td>
                      <td>Mũi {detail?.doseNumber || '—'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination placeholder */}
        <div className="cis-hist-pagination">
          <button className="cis-page-btn" disabled>⟨⟨</button>
          <button className="cis-page-btn" disabled>⟨</button>
          <span className="cis-page-count">{vaccinationHistory.length > 0 ? vaccinationHistory.length : 0}</span>
          <button className="cis-page-btn" disabled>⟩</button>
          <button className="cis-page-btn" disabled>⟩⟩</button>
        </div>
      </div>

      {/* Customer Detail Modal */}
      {showModal && (
        <CustomerDetailModal customer={customer} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

export default CustomerInfoSidebar;