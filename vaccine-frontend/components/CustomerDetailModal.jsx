/**
 * CustomerDetailModal.jsx
 * Pop-up xem thông tin chi tiết khách hàng
 */

import React from 'react';
import '../assets/customerdetailmodal.css';

const CustomerDetailModal = ({ customer, onClose }) => {
  if (!customer) return null;

  const dob = customer?.dateOfBirth || customer?.dob;
  const calcAge = (d) => {
    if (!d) return '';
    const diff = Date() - new Date(d).getTime();
    return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
  };
  const formatDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN') : '—';
  const gender = customer?.gender === 'MALE' ? 'Nam' : customer?.gender === 'FEMALE' ? 'Nữ' : '—';

  const fields = [
    { label: 'Họ và tên', value: customer?.fullName },
    { label: 'Ngày sinh', value: dob ? `${formatDate(dob)} (${calcAge(dob)} tuổi)` : '—' },
    { label: 'Giới tính', value: gender },
    { label: 'Số điện thoại', value: customer?.phone || customer?.phoneNumber },
    { label: 'Email', value: customer?.email },
    { label: 'CCCD/CMND', value: customer?.identityNumber },
    { label: 'Địa chỉ', value: customer?.address },
    { label: 'Mã tiêm chủng', value: customer?.vaccinationCode },
    { label: 'Nhóm máu', value: customer?.bloodType },
    { label: 'Dị ứng', value: customer?.allergies },
    { label: 'Ghi chú', value: customer?.note },
  ];

  return (
    <div className="cdm-overlay" onClick={onClose}>
      <div className="cdm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cdm-header">
          <div className="cdm-avatar">
            {(customer?.fullName || 'K').charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="cdm-name">{customer?.fullName || '—'}</h3>
            <p className="cdm-sub">{customer?.vaccinationCode || ''}</p>
          </div>
          <button className="cdm-close" onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="cdm-body">
          {fields.map((f) => f.value ? (
            <div className="cdm-field" key={f.label}>
              <span className="cdm-field-label">{f.label}</span>
              <span className="cdm-field-value">{f.value}</span>
            </div>
          ) : null)}
        </div>

        <div className="cdm-footer">
          <button className="cdm-btn-close" onClick={onClose}>Đóng</button>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailModal;