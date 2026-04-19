/**
 * DoctorWorkspace.jsx  (refactored)
 * Màn hình bác sĩ — 3 subtab: Khám sàng lọc | Chỉ định | Hẹn tiêm
 * Sidebar phải: Thông tin bệnh nhân + Lịch sử tiêm chủng
 *
 * Route: /bac-si/workspace/:sessionId
 */

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDoctorWorkspace } from '../hooks/useDoctorWorkspace';
import CustomerInfoSidebar from '../components/CustomerInfoSidebar';
import ScreeningTab from '../components/ScreeningTab';
import PrescriptionTab from '../components/PrescriptionTab';
import AppointmentTab from '../components/AppointmentTab';
import '../assets/doctorworkspace.css';

const TABS = [
  { key: 'screening', label: 'Khám sàng lọc' },
  { key: 'prescription', label: 'Chỉ định' },
  { key: 'appointment', label: 'Hẹn tiêm' },
];

const DoctorWorkspace = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('screening');

  const { session, customer, vaccinationHistory, loading, error } = useDoctorWorkspace(sessionId);

  const customerId = session?.customerId || customer?.id;

  if (error) {
    return (
      <div className="dw-error-page">
        <p>Không thể tải dữ liệu: {error}</p>
        <button onClick={() => navigate(-1)}>← Quay lại</button>
      </div>
    );
  }

  return (
    <div className="dw-layout">
      {/* CỘT TRÁI: Khu vực thao tác */}
      <div className="dw-main-card">
        {/* Patient name breadcrumb */}
        <div className="dw-breadcrumb">
          <button className="dw-back-btn" onClick={() => navigate(-1)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <span className="dw-breadcrumb-text">
            Bác sĩ
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{margin: '0 0.375rem'}}>
              <polyline points="9 18 15 12 9 6"/>
            </svg>
            {loading ? '...' : (customer?.fullName || 'Khách hàng')}
          </span>
        </div>

        {/* TABS */}
        <div className="dw-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`dw-tab-item ${activeTab === tab.key ? 'dw-tab-active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB CONTENT */}
        <div className="dw-tab-body">
          {loading ? (
            <div className="dw-loading">
              <div className="dw-spinner" />
              <span>Đang tải thông tin...</span>
            </div>
          ) : (
            <>
              {activeTab === 'screening' && (
                <ScreeningTab sessionId={sessionId} />
              )}
              {activeTab === 'prescription' && (
                <PrescriptionTab
                  sessionId={sessionId}
                  onSaveSuccess={() => setActiveTab('appointment')}
                />
              )}
              {activeTab === 'appointment' && (
                <AppointmentTab sessionId={sessionId} customerId={customerId} />
              )}
            </>
          )}
        </div>
      </div>

      {/* CỘT PHẢI: Sidebar */}
      <CustomerInfoSidebar
        customer={customer}
        vaccinationHistory={vaccinationHistory}
        loading={loading}
      />
    </div>
  );
};

export default DoctorWorkspace;