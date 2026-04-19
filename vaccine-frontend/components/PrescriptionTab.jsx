/**
 * PrescriptionTab.jsx
 * Tab Chỉ định — chọn vaccine, số mũi, liều lượng → insert VaccinationDetail
 */

import React from 'react';
import { usePrescription, useVaccines } from '../hooks/useDoctorWorkspace';
import '../assets/tabstyle.css';

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
  </svg>
);

const PrescriptionTab = ({ sessionId, onSaveSuccess }) => {
  const { vaccines } = useVaccines();
  const {
    rows, addRow, removeRow, updateRow,
    prescriptionNote, setPrescriptionNote,
    saving, success, error,
    savePrescription, cancelPrescription,
  } = usePrescription(sessionId);

  const handleSave = async () => {
    await savePrescription();
    if (onSaveSuccess) onSaveSuccess();
  };

  return (
    <div className="tab-inner">
      {/* Section: Dịch vụ tiêm chủng */}
      <div className="prescription-section">
        <div className="prescription-section-header">
          <span className="prescription-section-title">DỊCH VỤ TIÊM CHỦNG</span>
        </div>

        {/* Column headers */}
        <div className="prescription-col-headers">
          <span>Vắc xin <span className="required">(*)</span></span>
          <span>Mũi <span className="required">(*)</span></span>
          <span>Liều lượng</span>
          <span></span>
        </div>

        {/* Rows */}
        {rows.map((row) => (
          <div key={row.id} className="prescription-row-grid">
            <select
              className="doc-select"
              value={row.vaccineId}
              onChange={(e) => updateRow(row.id, 'vaccineId', e.target.value)}
            >
              <option value="">Chọn vắc xin...</option>
              {vaccines.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                  {v.isAvailable === false ? ' (Hết hàng)' : ''}
                </option>
              ))}
              {/* Fallback mock nếu chưa có API */}
              {vaccines.length === 0 && (
                <>
                  <option value="vaxi-01">Vaxigrip Tetra (Cúm)</option>
                  <option value="infanrix-01">Infanrix Hexa (6 trong 1)</option>
                  <option value="hexaxim-01">Hexaxim</option>
                  <option value="sar-01">SAR 1000IU – 20</option>
                </>
              )}
            </select>

            <input
              type="number"
              min={1}
              className="doc-input"
              value={row.doseNumber}
              onChange={(e) => updateRow(row.id, 'doseNumber', parseInt(e.target.value) || 1)}
            />

            <input
              type="text"
              className="doc-input"
              placeholder="VD: 0.5ml"
              value={row.dosePerVial}
              onChange={(e) => updateRow(row.id, 'dosePerVial', e.target.value)}
            />

            <button
              className="btn-remove-row"
              onClick={() => removeRow(row.id)}
              title="Xóa hàng"
              disabled={rows.length === 1}
            >
              <TrashIcon />
            </button>
          </div>
        ))}

        <button className="btn-add-row" onClick={addRow}>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          + Thêm vắc xin
        </button>
      </div>

      {/* Section: Ghi chú */}
      <div className="prescription-section" style={{ marginTop: '1.5rem' }}>
        <label className="field-label" style={{ display: 'block', marginBottom: '0.5rem' }}>
          Ghi chú chỉ định <span style={{ color: '#94a3b8', fontWeight: 400 }}>(Sẽ được lưu vào bệnh án)</span>
        </label>
        <textarea
          className="doc-textarea"
          rows={4}
          placeholder="Dặn dò bệnh nhân (VD: Uống nhiều nước, theo dõi sốt 24h, tái khám nếu có phản ứng bất thường...)"
          value={prescriptionNote}
          onChange={(e) => setPrescriptionNote(e.target.value)}
        />
      </div>

      {/* Alerts */}
      {success && <div className="tab-alert tab-alert--success">✓ Đã lưu chỉ định thành công!</div>}
      {error && <div className="tab-alert tab-alert--error">⚠ {error}</div>}

      {/* Footer */}
      <div className="tab-footer">
        <button className="btn-ghost" onClick={cancelPrescription} disabled={saving}>
          Hủy phiếu
        </button>
        <button className="btn-solid" onClick={handleSave} disabled={saving}>
          {saving ? 'Đang lưu...' : '💾 Lưu phiếu & Chuyển tiêm'}
        </button>
      </div>
    </div>
  );
};

export default PrescriptionTab;