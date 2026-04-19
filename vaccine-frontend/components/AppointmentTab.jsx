/**
 * AppointmentTab.jsx
 * Tab Hẹn tiêm — tạo/xóa VaccineAppointment, hiển thị lịch hẹn gần đây
 */

import React from 'react';
import { useAppointment, useVaccines } from '../hooks/useDoctorWorkspace';
import '../assets/tabstyle.css';

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
  </svg>
);

const STATUS_MAP = {
  PENDING: { label: 'Chờ xác nhận', cls: 'apt-status--pending' },
  CONFIRMED: { label: 'Đã xác nhận', cls: 'apt-status--confirmed' },
  COMPLETED: { label: 'Đã tiêm', cls: 'apt-status--completed' },
  CANCELLED: { label: 'Đã hủy', cls: 'apt-status--cancelled' },
};

const AppointmentTab = ({ sessionId, customerId }) => {
  const { vaccines } = useVaccines();
  const {
    appointmentRows, addAppointmentRow, removeAppointmentRow, updateAppointmentRow,
    recentAppointments, loading,
    saving, success, error,
    saveAppointments, cancelAppointments, deleteRecentAppointment,
  } = useAppointment(sessionId, customerId);

  const formatDate = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('vi-VN');
  };

  return (
    <div className="tab-inner">
      {/* New Appointment Rows */}
      <div className="apt-form-section">
        {/* Column headers */}
        <div className="apt-col-headers">
          <span>Vắc xin <span className="required">(*)</span></span>
          <span>Ngày hẹn <span className="required">(*)</span></span>
          <span>Mũi <span className="required">(*)</span></span>
          <span>Ghi chú</span>
          <span></span>
        </div>

        {appointmentRows.map((row) => (
          <div key={row.id} className="apt-row-grid">
            <select
              className="doc-select"
              value={row.vaccineId}
              onChange={(e) => updateAppointmentRow(row.id, 'vaccineId', e.target.value)}
            >
              <option value="">Chọn vắc xin...</option>
              {vaccines.map((v) => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
              {vaccines.length === 0 && (
                <>
                  <option value="hexaxim-01">Hexaxim</option>
                  <option value="vaxi-01">Vaxigrip Tetra (Cúm)</option>
                  <option value="infanrix-01">Infanrix Hexa (6 trong 1)</option>
                </>
              )}
            </select>

            <div className="apt-date-wrap">
              <input
                type="date"
                className="doc-input"
                value={row.appointmentDate}
                onChange={(e) => updateAppointmentRow(row.id, 'appointmentDate', e.target.value)}
              />
            </div>

            <input
              type="number"
              min={1}
              className="doc-input"
              value={row.doseNumber}
              onChange={(e) => updateAppointmentRow(row.id, 'doseNumber', parseInt(e.target.value) || 1)}
            />

            <input
              type="text"
              className="doc-input"
              placeholder="Ghi chú..."
              value={row.note}
              onChange={(e) => updateAppointmentRow(row.id, 'note', e.target.value)}
            />

            <button
              className="btn-remove-row"
              onClick={() => removeAppointmentRow(row.id)}
              disabled={appointmentRows.length === 1}
              title="Xóa hàng"
            >
              <TrashIcon />
            </button>
          </div>
        ))}

        <button className="btn-add-row" onClick={addAppointmentRow}>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          + Thêm
        </button>
      </div>

      {/* Info text */}
      <p className="apt-info-text">
        Vui lòng bỏ qua bước này nếu đã chỉ định và không cần hẹn tiêm.
        Bấm đóng hoặc hoàn thành để kết thúc.
      </p>

      {/* Alerts */}
      {success && <div className="tab-alert tab-alert--success">✓ Đã lưu lịch hẹn thành công!</div>}
      {error && <div className="tab-alert tab-alert--error">⚠ {error}</div>}

      {/* Footer actions */}
      <div className="tab-footer">
        <button className="btn-ghost" onClick={cancelAppointments} disabled={saving}>Hủy</button>
        <button className="btn-outline" onClick={saveAppointments} disabled={saving}>
          {saving ? 'Đang lưu...' : '💾 Lưu'}
        </button>
        <button className="btn-outline" disabled={saving}>
          🖨 Lưu và In
        </button>
        <button className="btn-solid btn-complete" disabled={saving}>
          ✓ Hoàn thành
        </button>
      </div>

      {/* Recent Appointments Table */}
      <div className="apt-history-section">
        <h4 className="apt-history-title">LỊCH HẸN GẦN ĐÂY</h4>
        {loading ? (
          <div className="apt-loading">Đang tải...</div>
        ) : (
          <div className="apt-table-wrap">
            <table className="apt-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Ngày hẹn ↑</th>
                  <th>Trạng thái</th>
                  <th>Vắc xin</th>
                  <th>Mũi</th>
                  <th>Ghi chú</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {recentAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="apt-empty">Không có dữ liệu</td>
                  </tr>
                ) : (
                  recentAppointments.map((apt, idx) => {
                    const status = STATUS_MAP[apt.status] || { label: apt.status, cls: '' };
                    return (
                      <tr key={apt.id}>
                        <td>{idx + 1}</td>
                        <td>{formatDate(apt.appointmentDate)}</td>
                        <td>
                          <span className={`apt-status-badge ${status.cls}`}>{status.label}</span>
                        </td>
                        <td>{apt?.vaccine?.name || '—'}</td>
                        <td>Mũi {apt.doseNumber || '—'}</td>
                        <td>{apt.note || '—'}</td>
                        <td>
                          {apt.status === 'PENDING' && (
                            <button
                              className="apt-del-btn"
                              onClick={() => deleteRecentAppointment(apt.id)}
                              title="Hủy lịch hẹn"
                            >
                              <TrashIcon />
                            </button>
                          )}
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

export default AppointmentTab;