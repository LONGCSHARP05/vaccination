import React, { useState, useEffect } from 'react';
import { Save, Printer, XCircle, X } from 'lucide-react';

const InjectionModal = ({ isOpen, onClose, patientData, onSave }) => {
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [vaccineStatus, setVaccineStatus] = useState('da_tiem');
  const [vaccineLot, setVaccineLot] = useState('');
  const [injector, setInjector] = useState('admin');

  // Khởi tạo ngày giờ hiện tại khi mở modal
  useEffect(() => {
    if (isOpen) {
      // Nếu bệnh nhân đã được lưu tiêm từ trước, tải lại các dữ liệu đã nhập
      if (patientData && patientData.trangThai === 'Đã tiêm') {
        setVaccineStatus(patientData.vaccineStatus || 'da_tiem');
        setVaccineLot(patientData.vaccineLot || '');
        setInjector(patientData.injector || 'admin');
        
        if (patientData.ngayGioTiem) {
          const d = new Date(patientData.ngayGioTiem);
          if (!isNaN(d.getTime())) {
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            setCurrentDate(`${year}-${month}-${day}`);
            
            const hours = String(d.getHours()).padStart(2, '0');
            const minutes = String(d.getMinutes()).padStart(2, '0');
            setCurrentTime(`${hours}:${minutes}`);
            return;
          }
        }
      }

      // Khởi tạo mặc định nếu là bệnh nhân mới
      setVaccineStatus('da_tiem');
      setVaccineLot('');
      setInjector('admin');

      const now = new Date();
      
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      setCurrentDate(`${year}-${month}-${day}`);
      
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    }
  }, [isOpen, patientData]);

  if (!isOpen) return null;

  // Hàm tính toán số tuổi chi tiết của bệnh nhân
  const getDetailedAge = (dobString) => {
    if (!dobString) return 'Chưa rõ tuổi';
    
    // Xử lý chuỗi ngày sinh (Mặc định dữ liệu đang là định dạng DD/MM/YYYY)
    const parts = dobString.split('/');
    if (parts.length !== 3) return 'Chưa rõ tuổi';

    const dob = new Date(parts[2], parts[1] - 1, parts[0]);
    if (isNaN(dob.getTime())) return 'Chưa rõ tuổi';

    const now = new Date();
    let years = now.getFullYear() - dob.getFullYear();
    let months = now.getMonth() - dob.getMonth();
    let days = now.getDate() - dob.getDate();

    // Xử lý trường hợp số ngày âm (Mượn ngày từ tháng trước)
    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
    }
    
    // Xử lý trường hợp số tháng âm (Mượn tháng từ năm trước)
    if (months < 0) {
      years -= 1;
      months += 12;
    }
    
    return `${years} TUỔI ${months} THÁNG ${days} NGÀY TUỔI`;
  };

  const detailedAge = getDetailedAge(patientData?.ngaySinh);

  // Hàm gọi ngược lên trang Chờ Tiêm khi bấm Lưu
  const handleSave = () => {
    if (onSave && patientData) {
      onSave(patientData, { date: currentDate, time: currentTime, vaccineStatus, vaccineLot, injector });
    }
  };

  return (
    <div className="pvt-reaction-modal-overlay" onClick={onClose}>
      {/* Modal Container */}
      <div className="pvt-reaction-modal-content" style={{ maxWidth: '960px', width: '95%' }} onClick={(e) => e.stopPropagation()}>
        
        {/* 1. Header của Modal */}
        <div className="pvt-reaction-modal-header" style={{ backgroundColor: '#3b82f6', color: 'white', borderBottom: 'none' }}>
          <div className="pvt-reaction-header-info">
            <h2 style={{ color: 'white', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
              {patientData?.hoTen || 'BỆNH NHÂN'}
            </h2>
            <p className="pvt-reaction-subinfo" style={{ color: '#e0f2fe', fontSize: '15px' }}>
              {patientData?.ngaySinh || '--/--/----'} • {detailedAge}
            </p>
          </div>
          <button className="pvt-reaction-modal-close" onClick={onClose} style={{ color: 'white' }}>
            <X size={24} strokeWidth={2.5} />
          </button>
        </div>

        <div className="pvt-reaction-modal-body">
          {/* 2. Bảng thông tin Vắc xin */}
          <div className="pvt-reaction-section-title" style={{ marginTop: 0 }}>
            <h3>Chi tiết vắc xin chỉ định</h3>
          </div>

          <div className="pvt-table-wrapper" style={{ marginTop: '12px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
            <table className="pvt-table" style={{ margin: 0 }}>
              <thead style={{ backgroundColor: '#f8fafc' }}>
                <tr>
                  <th>Tên Vắc Xin</th>
                  <th style={{ textAlign: 'center' }}>Số Lượng</th>
                  <th style={{ textAlign: 'center' }}>Mũi</th>
                  <th>Trạng Thái</th>
                  <th>Số lô vắc xin</th>
                  <th style={{ textAlign: 'center' }}>HSD</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="pvt-bold" style={{ color: '#1e293b' }}>
                    {patientData?.tenVacxin || 'SAR 1000IU'}
                  </td>
                  <td style={{ textAlign: 'center' }}>1</td>
                  <td style={{ textAlign: 'center' }}>1</td>
                  <td>
                    <select value={vaccineStatus} onChange={(e) => setVaccineStatus(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' }}>
                      <option value="chua_tiem">Chưa tiêm</option>
                      <option value="da_tiem">Đã tiêm</option>
                    </select>
                  </td>
                  <td>
                    <select value={vaccineLot} onChange={(e) => setVaccineLot(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' }}>
                      <option value="">-- Chọn số lô --</option>
                      <option value="ZXFVZG">ZXFVZG</option>
                      <option value="AB1234">AB1234</option>
                    </select>
                  </td>
                  <td style={{ textAlign: 'center', color: '#64748b' }}>
                    30/04/2026
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 3. Thông tin thời gian & Người tiêm */}
          <div className="pvt-reaction-section-title" style={{ marginTop: '24px' }}>
            <h3>Thông tin thực hiện</h3>
          </div>

          <div style={{ display: 'flex', gap: '24px', marginTop: '12px', flexWrap: 'wrap', backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <label style={{ fontWeight: '600', color: '#475569', fontSize: '14px' }}>Thời gian tiêm:</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input type="date" value={currentDate} onChange={(e) => setCurrentDate(e.target.value)} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' }} />
                <input type="time" value={currentTime} onChange={(e) => setCurrentTime(e.target.value)} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' }} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <label style={{ fontWeight: '600', color: '#475569', fontSize: '14px' }}>Cán bộ tiêm:</label>
              <select value={injector} onChange={(e) => setInjector(e.target.value)} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', minWidth: '180px', outline: 'none', fontSize: '14px' }}>
                <option value="admin">Admin</option>
                <option value="bs_a">Bác sĩ A</option>
                <option value="dd_b">Điều dưỡng B</option>
              </select>
            </div>
          </div>
        </div>

        {/* 4. Footer (Các nút thao tác) */}
        <div className="pvt-reaction-modal-footer" style={{ borderTop: '1px solid #e2e8f0', padding: '16px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', width: '100%' }}>
            <button onClick={handleSave} className="pvt-reaction-modal-btn pvt-reaction-modal-btn-save" style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#0ea5e9' }}>
              <Save size={18} /> LƯU / TIÊM
            </button>
            <button onClick={handleSave} className="pvt-reaction-modal-btn pvt-reaction-modal-btn-save" style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#0ea5e9' }}>
              <Printer size={18} /> LƯU / TIÊM & IN PHIẾU
            </button>
            <button className="pvt-reaction-modal-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#fca5a5', color: '#fff', border: 'none' }}>
              <XCircle size={18} /> HỦY TIÊM
            </button>
            <button className="pvt-reaction-modal-btn" onClick={onClose} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#ef4444', color: '#fff', border: 'none' }}>
              <X size={18} /> ĐÓNG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InjectionModal;