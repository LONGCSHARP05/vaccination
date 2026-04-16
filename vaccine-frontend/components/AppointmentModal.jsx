// File: components/AppointmentModal.jsx
import { useState, useEffect } from "react";

function AppointmentModal({ isOpen, onClose, appointment, onSave, onDelete }) {
  const [formData, setFormData] = useState({
    id: "", patientName: "", phone: "", vaccine: "", date: "", time: "", status: "pending"
  });
  const [isEditing, setIsEditing] = useState(false); // Trạng thái xem/sửa

  // Cập nhật form mỗi khi mở modal hoặc đổi lịch chọn
  useEffect(() => {
    if (appointment) {
      setFormData(appointment);
      setIsEditing(false); // Mặc định mở lên là xem, chưa sửa
    } else {
      // Nếu không có appointment => là Đặt lịch mới
      setFormData({ id: "", patientName: "", phone: "", vaccine: "", date: "", time: "", status: "pending" });
      setIsEditing(true); // Đặt lịch mới thì hiện form sửa luôn
    }
  }, [appointment, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          {appointment ? "Chi tiết lịch tiêm chủng" : "Đặt lịch tiêm chủng mới"}
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>
        
        <div className="modal-body">
          {isEditing ? (
            // Form Nhập liệu (dành cho Thêm mới hoặc Đang sửa)
            <>
              <label>Tên bệnh nhân:</label>
              <input name="patientName" value={formData.patientName} onChange={handleChange} placeholder="Ví dụ: Nguyễn Văn A" />
              
              <label>Số điện thoại:</label>
              <input name="phone" value={formData.phone} onChange={handleChange} placeholder="0xxxxxxxxx" />
              
              <label>Loại vắc xin:</label>
              <input name="vaccine" value={formData.vaccine} onChange={handleChange} placeholder="Tên vắc xin" />
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                  <label>Ngày tiêm:</label>
                  <input type="date" name="date" value={formData.date} onChange={handleChange} />
                </div>
                <div style={{ flex: 1 }}>
                  <label>Giờ:</label>
                  <input type="time" name="time" value={formData.time} onChange={handleChange} />
                </div>
              </div>

              <label>Trạng thái:</label>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="pending">Chờ tiêm</option>
                <option value="completed">Đã tiêm</option>
              </select>
            </>
          ) : (
            // Giao diện Chỉ Xem (Giống trong ảnh pop-up của bạn)
            <>
              <div className="info-row"><span className="info-label">Mã lịch tiêm:</span><span className="info-value">{formData.id}</span></div>
              <div className="info-row"><span className="info-label">Bệnh nhân:</span><span className="info-value">{formData.patientName}</span></div>
              <div className="info-row"><span className="info-label">SĐT:</span><span className="info-value">{formData.phone}</span></div>
              <div className="info-row"><span className="info-label">Loại vắc xin:</span><span className="info-value">{formData.vaccine}</span></div>
              <div className="info-row"><span className="info-label">Ngày giờ:</span><span className="info-value">{formData.date} - {formData.time}</span></div>
              <div className="info-row">
                <span className="info-label">Trạng thái:</span>
                <span className={`status-badge ${formData.status === 'completed' ? 'status-active' : 'status-pending'}`}>
                  {formData.status === 'completed' ? 'Đã tiêm' : 'Chờ tiêm'}
                </span>
              </div>
            </>
          )}
        </div>

        <div className="modal-footer">
          {appointment && !isEditing && (
             <button className="btn-delete" onClick={() => onDelete(formData.id)}>Xóa lịch này</button>
          )}
          {appointment && !isEditing && (
             <button className="btn-save" onClick={() => setIsEditing(true)}>Sửa thông tin</button>
          )}
          {isEditing && (
             <button className="btn-save" onClick={handleSubmit}>Lưu thay đổi</button>
          )}
          <button className="btn-cancel" onClick={onClose}>Đóng</button>
        </div>
      </div>
    </div>
  );
}

export default AppointmentModal;