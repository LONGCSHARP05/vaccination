import React, { useState, useEffect } from 'react';
import { FiEye, FiTrash2, FiSearch, FiX, FiAlertCircle } from 'react-icons/fi';
import '../assets/post-vaccine-tracking.css';

function PostVaccineTracking() {
  const [searchInput, setSearchInput] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showReactionModal, setShowReactionModal] = useState(false);
  const [selectedReactionPatient, setSelectedReactionPatient] = useState(null);
  const [trackedPatients, setTrackedPatients] = useState([]);

  // State lưu trữ dữ liệu form phản ứng của từng bệnh nhân và dữ liệu cục bộ trong modal
  const [patientReactions, setPatientReactions] = useState({});
  const [reactionForm, setReactionForm] = useState({
    hasSymptoms: false,
    severity: '',
    symptoms: [],
    notes: '',
    isCompleted: false
  });

  // State cho Countdown
  const [countdowns, setCountdowns] = useState({});

  // Khôi phục dữ liệu từ sessionStorage
  useEffect(() => {
    // Dọn dẹp rác dữ liệu cũ trong localStorage (nếu có)
    localStorage.removeItem('mockInjectedPatients');
    const storedInjected = sessionStorage.getItem('sessionInjectedPatients');
    if (storedInjected) {
      try {
        const parsed = JSON.parse(storedInjected).map((p) => ({
          ...p,
          ngayGioTiem: new Date(p.ngayGioTiem) // Cần phải parse lại string sang Date object
        }));

        if (parsed.length > 0) {
          setTrackedPatients(prev => {
            // Gộp dữ liệu mới lưu với mock data có sẵn và đánh lại STT
            const combined = [...parsed, ...prev];
            // Lọc trùng theo ID (Phòng trường hợp re-render 2 lần)
            const unique = Array.from(new Map(combined.map(item => [item.id, item])).values());
            return unique.map((item, index) => ({ ...item, stt: index + 1 }));
          });
        }
      } catch (error) {
        console.error('Error parsing injected patients:', error);
      }
    }
  }, []);

  // Khởi tạo countdowns
  useEffect(() => {
    const initialCountdowns = {};
    trackedPatients.forEach(patient => {
      const elapsedMinutes = (Date.now() - patient.ngayGioTiem.getTime()) / 60000;
      const remainingMinutes = Math.max(0, patient.thoiGian - elapsedMinutes);
      initialCountdowns[patient.id] = remainingMinutes;
    });
    setCountdowns(initialCountdowns);
  }, [trackedPatients]);

  // Update Countdown mỗi giây
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdowns(prev => {
        const updated = { ...prev };
        let hasChanges = false;

        Object.keys(updated).forEach(key => {
          const remaining = updated[key] - 1 / 60; // Trừ 1 giây (1/60 phút)
          if (remaining < 0) {
            updated[key] = 0;
          } else {
            updated[key] = remaining;
          }
          hasChanges = true;
        });

        return hasChanges ? updated : prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Convert phút sang MM:SS
  const formatTime = (minutes) => {
    const totalSeconds = Math.max(0, Math.floor(minutes * 60));
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Kiểm tra nếu đã hoàn thành
  const isCompleted = (minutes) => Math.round(minutes * 60) <= 0;

  // Filter bảng
  const filteredPatients = trackedPatients.filter(patient => {
    const searchLower = searchInput.toLowerCase();
    return (
      patient.hoTen.toLowerCase().includes(searchLower) ||
      patient.diaChi.toLowerCase().includes(searchLower) ||
      patient.id.toString().includes(searchLower)
    );
  });

  const handleViewDetails = (patient) => {
    setSelectedPatient(patient);
    setShowModal(true);
  };

  const handleDelete = (patient) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa hồ sơ bệnh nhân ${patient.hoTen}?`)) {
      setTrackedPatients(trackedPatients.filter(p => p.id !== patient.id));
      alert(`Đã xóa hồ sơ bệnh nhân ${patient.hoTen}`);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPatient(null);
  };

  const handleReaction = (patient) => {
    setSelectedReactionPatient(patient);
    
    // Load lại dữ liệu nếu đã được lưu trước đó, ngược lại khởi tạo giá trị rỗng
    const existingData = patientReactions[patient.id] || {
      hasSymptoms: false,
      severity: '',
      symptoms: [],
      notes: '',
      isCompleted: false
    };
    setReactionForm(existingData);
    
    setShowReactionModal(true);
  };

  const closeReactionModal = () => {
    setShowReactionModal(false);
    setSelectedReactionPatient(null);
  };

  const handleSaveReaction = () => {
    if (selectedReactionPatient) {
      setPatientReactions({
        ...patientReactions,
        [selectedReactionPatient.id]: reactionForm
      });
      setShowReactionModal(false);
      setSelectedReactionPatient(null);
      alert('Đã lưu thông tin phản ứng sau tiêm thành công!');
    }
  };

  return (
    <div className="post-vaccine-tracking-wrapper">
      {/* Header Section */}
      <header className="pvt-header">
        <div>
          <h1 className="pvt-title font-headline">Theo dõi</h1>
          <p className="pvt-subtitle">Quản lý danh sách bệnh nhân cần theo dõi</p>
        </div>
      </header>

      {/* Main Card Container */}
      <div className="pvt-card-container">
        {/* Toolbar */}
        <div className="pvt-toolbar">
          <div className="pvt-search-section">
            <div className="pvt-search-box">
              <FiSearch className="pvt-search-icon" />
              <input
                type="text"
                placeholder="Nhập Số phiếu / Mã KH / Họ tên..."
                className="pvt-search-input"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <button className="pvt-btn pvt-btn-primary">Tìm kiếm</button>
            <button 
              className="pvt-btn" 
              style={{ backgroundColor: '#fff', border: '1px solid #ef4444', color: '#ef4444' }}
              onClick={() => {
                if(window.confirm('Bạn có muốn xóa toàn bộ danh sách theo dõi hiện tại?')) {
                  setTrackedPatients([]);
                  sessionStorage.removeItem('sessionInjectedPatients');
                }
              }}
            >
              Xóa dữ liệu cũ
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="pvt-table-wrapper">
          <table className="pvt-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Họ Tên</th>
                <th>Ngày sinh</th>
                <th>Địa chỉ</th>
                <th>Ghi chú</th>
                <th>Ngày giờ tiêm</th>
                <th>Tên vắc xin</th>
                <th>Thời gian</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient, index) => {
                  const completed = isCompleted(countdowns[patient.id] || 0);
                  const timeString = formatTime(countdowns[patient.id] || 0);

                  return (
                    <tr key={patient.id} className={completed ? 'row-completed' : 'row-monitoring'}>
                      <td>{patient.stt}</td>
                      <td className="pvt-bold">{patient.hoTen}</td>
                      <td>{new Date(patient.ngaySinh).toLocaleDateString('vi-VN')}</td>
                      <td className="pvt-address">{patient.diaChi}</td>
                      <td>{patient.ghiChu || '-'}</td>
                      <td>{patient.ngayGioTiem.toLocaleString('vi-VN')}</td>
                      <td>{patient.tenVacxin}</td>
                      <td>
                        <span className={`pvt-countdown-badge ${completed ? 'completed' : 'monitoring'}`}>
                          {completed ? 'Hoàn thành' : timeString}
                        </span>
                      </td>
                      <td>
                        <div className="pvt-actions">
                          <button
                            className="pvt-action-btn pvt-action-view"
                            title="Xem chi tiết"
                            onClick={() => handleViewDetails(patient)}
                          >
                            <FiEye size={18} />
                          </button>
                          <button
                            className="pvt-action-btn pvt-action-reaction"
                            title="Phản ứng"
                            onClick={() => handleReaction(patient)}
                          >
                            <FiAlertCircle size={18} />
                          </button>
                          <button
                            className="pvt-action-btn pvt-action-delete"
                            title="Xóa"
                            onClick={() => handleDelete(patient)}
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="9" className="pvt-no-data">
                    Không tìm thấy bệnh nhân nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Info Section */}
        <div className="pvt-info-footer">
          <span className="pvt-info-text">
            🔴 <strong>Đỏ:</strong> Đang theo dõi | 🟢 <strong>Xanh:</strong> Hoàn thành theo dõi
          </span>
        </div>
      </div>

      {/* Modal Popup */}
      {showModal && selectedPatient && (
        <div className="pvt-modal-overlay" onClick={closeModal}>
          <div className="pvt-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="pvt-modal-header">
              <h2>Chi tiết bệnh nhân</h2>
              <button className="pvt-modal-close" onClick={closeModal}>
                <FiX size={24} />
              </button>
            </div>
            <div className="pvt-modal-body">
              <div className="pvt-modal-row">
                <span className="pvt-modal-label">Họ tên:</span>
                <span className="pvt-modal-value">{selectedPatient.hoTen}</span>
              </div>
              <div className="pvt-modal-row">
                <span className="pvt-modal-label">Ngày sinh:</span>
                <span className="pvt-modal-value">{new Date(selectedPatient.ngaySinh).toLocaleDateString('vi-VN')}</span>
              </div>
              <div className="pvt-modal-row">
                <span className="pvt-modal-label">Địa chỉ:</span>
                <span className="pvt-modal-value">{selectedPatient.diaChi}</span>
              </div>
              <div className="pvt-modal-row">
                <span className="pvt-modal-label">Ghi chú:</span>
                <span className="pvt-modal-value">{selectedPatient.ghiChu || '-'}</span>
              </div>
              <div className="pvt-modal-row">
                <span className="pvt-modal-label">Ngày giờ tiêm:</span>
                <span className="pvt-modal-value">{selectedPatient.ngayGioTiem.toLocaleString('vi-VN')}</span>
              </div>
              <div className="pvt-modal-row">
                <span className="pvt-modal-label">Tên vắc xin:</span>
                <span className="pvt-modal-value">{selectedPatient.tenVacxin}</span>
              </div>
              <div className="pvt-modal-row">
                <span className="pvt-modal-label">Thời gian theo dõi:</span>
                <span className="pvt-modal-value">30 phút</span>
              </div>
            </div>
            <div className="pvt-modal-footer">
              <button className="pvt-modal-btn pvt-modal-btn-close" onClick={closeModal}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reaction Modal Popup */}
      {showReactionModal && selectedReactionPatient && (
        <div className="pvt-reaction-modal-overlay" onClick={closeReactionModal}>
          <div className="pvt-reaction-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="pvt-reaction-modal-header">
              <div className="pvt-reaction-header-info">
                <h2>{selectedReactionPatient.hoTen}</h2>
                <p className="pvt-reaction-subinfo">BN-2023-{selectedReactionPatient.id} • Nam • 32 tuổi</p>
              </div>
              <button className="pvt-reaction-modal-close" onClick={closeReactionModal}>
                <FiX size={24} />
              </button>
            </div>

            <div className="pvt-reaction-modal-body">
              <div className="pvt-reaction-section">
                <div className="pvt-reaction-top">
                  <div className="pvt-time-left">
                    <p className="pvt-time-label">Thời gian theo dõi còn lại</p>
                  <p className="pvt-time-count">{formatTime(countdowns[selectedReactionPatient.id] ?? 30)}</p>
                    <div className="pvt-time-progress">
                      <div className="pvt-time-bar"></div>
                    </div>
                  </div>

                  <div className="pvt-vital-signs">
                    <h3>Chi số sinh tồn trước tiêm</h3>
                    <div className="pvt-vital-items">
                      <div className="pvt-vital-item">
                        <span className="pvt-vital-icon">❤️</span>
                        <p>Nhịp tim: <strong>78 bpm</strong></p>
                      </div>
                      <div className="pvt-vital-item">
                        <span className="pvt-vital-icon">🌡️</span>
                        <p>Nhiệt độ: <strong>36.5 °C</strong></p>
                      </div>
                      <div className="pvt-vital-item">
                        <span className="pvt-vital-icon">💉</span>
                        <p>Huyết áp: <strong>120/80 mmHg</strong></p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pvt-reaction-section-title">
                  <h3>Phản ứng sau tiêm</h3>
                  <p className="pvt-reaction-desc">Ghi nhận các triệu chứng bất thường nếu có</p>
                </div>

                <div className="pvt-reaction-items">
                  <div 
                    onClick={() => setReactionForm(prev => ({...prev, hasSymptoms: !prev.hasSymptoms}))}
                    style={{
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '8px 0',
                      userSelect: 'none'
                    }}
                  >
                    {/* Toggle Switch */}
                    <div style={{
                      width: '48px', height: '26px',
                      backgroundColor: reactionForm.hasSymptoms ? '#ef4444' : '#cbd5e1',
                      borderRadius: '13px', position: 'relative',
                      transition: 'background-color 0.3s ease'
                    }}>
                      <div style={{
                        width: '22px', height: '22px', backgroundColor: '#fff', borderRadius: '50%',
                        position: 'absolute', top: '2px', left: reactionForm.hasSymptoms ? '24px' : '2px',
                        transition: 'left 0.3s ease', boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                      }} />
                    </div>
                    {/* Label */}
                    <span style={{
                      fontWeight: '600', fontSize: '15px',
                      color: reactionForm.hasSymptoms ? '#dc2626' : '#475569'
                    }}>
                  {reactionForm.hasSymptoms ? 'Có biểu hiện bất thường' : 'Không có biểu hiện'}
                    </span>
                  </div>
                </div>

                <div className="pvt-reaction-section-title">
                  <h3>Mức độ nghiêm trọng</h3>
                </div>

                <div className="pvt-severity-levels" style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                  <div
                    onClick={() => setReactionForm(prev => ({...prev, severity: prev.severity === 'mild' ? '' : 'mild'}))}
                    style={{
                      cursor: 'pointer',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      backgroundColor: reactionForm.severity === 'mild' ? '#fef3c7' : '#f8fafc',
                      color: reactionForm.severity === 'mild' ? '#d97706' : '#64748b',
                      border: `2px solid ${reactionForm.severity === 'mild' ? '#f59e0b' : '#e2e8f0'}`,
                      fontWeight: '600',
                      userSelect: 'none'
                    }}
                  >
                    Nhẹ (Mild)
                  </div>
                  <div
                    onClick={() => setReactionForm(prev => ({...prev, severity: prev.severity === 'high' ? '' : 'high'}))}
                    style={{
                      cursor: 'pointer',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      backgroundColor: reactionForm.severity === 'high' ? '#fee2e2' : '#f8fafc',
                      color: reactionForm.severity === 'high' ? '#dc2626' : '#64748b',
                      border: `2px solid ${reactionForm.severity === 'high' ? '#ef4444' : '#e2e8f0'}`,
                      fontWeight: '600',
                      userSelect: 'none'
                    }}
                  >
                    Nặng (High)
                  </div>
                </div>

                <div className="pvt-reaction-section-title">
                  <h3>Triệu chứng phổ biến</h3>
                </div>

                <div className="pvt-symptoms" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '12px' }}>
                  {[
                    { id: 'dau_tiem', label: 'Đau tại chỗ tiêm' },
                    { id: 'sot_nhe', label: 'Sốt nhẹ' },
                    { id: 'chong_mat', label: 'Chóng mặt' }
                  ].map(sym => (
                    <div
                      key={sym.id}
                      onClick={() => {
                        setReactionForm(prev => {
                          const newSymptoms = prev.symptoms.includes(sym.id)
                            ? prev.symptoms.filter(s => s !== sym.id)
                            : [...prev.symptoms, sym.id];
                          return { ...prev, symptoms: newSymptoms };
                        })
                      }}
                      style={{
                        cursor: 'pointer',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        backgroundColor: reactionForm.symptoms.includes(sym.id) ? '#eff6ff' : '#f8fafc',
                        color: reactionForm.symptoms.includes(sym.id) ? '#2563eb' : '#64748b',
                        border: `1px solid ${reactionForm.symptoms.includes(sym.id) ? '#3b82f6' : '#e2e8f0'}`,
                        fontWeight: '500',
                        userSelect: 'none'
                      }}
                    >
                      {sym.label}
                    </div>
                  ))}
                </div>

                <div className="pvt-reaction-section-title">
                  <h3>Mô tả chi tiết triệu chứng</h3>
                </div>

                <textarea 
                  className="pvt-reaction-textarea"
                  placeholder="Ví dụ: Bệnh nhân kêu mệt, khó thở, chuẩn bị chuyển cấp cứu sau 30 phút."
                  rows="4"
                  value={reactionForm.notes}
                  onChange={(e) => setReactionForm(prev => ({...prev, notes: e.target.value}))}
                ></textarea>
              </div>
            </div>

            <div className="pvt-reaction-modal-footer">
              <div
                onClick={() => setReactionForm(prev => ({...prev, isCompleted: !prev.isCompleted}))}
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: reactionForm.isCompleted ? '#10b981' : '#64748b',
                  fontWeight: 'bold',
                  userSelect: 'none'
                }}
              >
                <div style={{
                  width: '20px', height: '20px', borderRadius: '4px',
                  backgroundColor: reactionForm.isCompleted ? '#10b981' : '#fff',
                  border: `2px solid ${reactionForm.isCompleted ? '#10b981' : '#cbd5e1'}`,
                  display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff',
                  fontSize: '14px'
                }}>
                  {reactionForm.isCompleted && '✓'}
                </div>
                <span>Hoàn tất theo dõi & Cấp chứng nhận</span>
              </div>
              <div>
                <button 
                  className="pvt-reaction-modal-btn pvt-reaction-modal-btn-save"
                  onClick={handleSaveReaction}
                >
                  Lưu thông tin
                </button>
                <button className="pvt-reaction-modal-btn pvt-reaction-modal-btn-close" onClick={closeReactionModal}>
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PostVaccineTracking;
