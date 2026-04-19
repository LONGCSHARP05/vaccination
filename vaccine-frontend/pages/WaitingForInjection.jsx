import React, { useState } from 'react';
import { 
  Search, 
  Eye,
  Trash2 
} from 'lucide-react';
import '../assets/post-vaccine-tracking.css';
import InjectionModal from '../components/InjectionModal';

const WaitingForInjection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isInjectionModalOpen, setIsInjectionModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Mock data khởi tạo dựa trên ngữ cảnh màn hình theo dõi
  const [patients, setPatients] = useState([
    {
      id: 1,
      stt: 1,
      trangThai: 'Chờ tiêm',
      soTT: 1,
      hoTen: 'Nguyễn Văn A',
      ngaySinh: '15/05/1990',
      dienThoai: '0901234567',
      diaChi: '123 Đường Lê Lợi, Hà Nội',
      tenVacxin: 'COVID-19 Pfizer',
      ghiChu: 'Dị ứng Penicillin',
      ngayDangKy: '18/04/2026 15:30'
    },
    {
      id: 2,
      stt: 2,
      trangThai: 'Chờ tiêm',
      soTT: 2,
      hoTen: 'Trần Thị B',
      ngaySinh: '22/08/1985',
      dienThoai: '0987654321',
      diaChi: '456 Đường Nguyễn Huệ, TP HCM',
      tenVacxin: 'Influenza 2026',
      ghiChu: 'Tăng huyết áp',
      ngayDangKy: '18/04/2026 15:45'
    },
    {
      id: 3,
      stt: 3,
      trangThai: 'Chờ tiêm',
      soTT: 3,
      hoTen: 'Lê Minh C',
      ngaySinh: '10/12/1995',
      dienThoai: '0912345678',
      diaChi: '789 Đường Tôn Đức Thắng, Đà Nẵng',
      tenVacxin: 'Hepatitis B',
      ghiChu: '',
      ngayDangKy: '18/04/2026 16:00'
    },
    {
      id: 4,
      stt: 4,
      trangThai: 'Chờ tiêm',
      soTT: 4,
      hoTen: 'Phạm Văn D',
      ngaySinh: '18/03/1988',
      dienThoai: '0933445566',
      diaChi: '321 Đường Hàng Bài, Hà Nội',
      tenVacxin: 'HPV 9v',
      ghiChu: 'Mẹ đơn thân',
      ngayDangKy: '18/04/2026 16:15'
    }
  ]);

  // Hàm xử lý lưu tiêm
  const handleSaveInjection = (patient, injectData) => {
    // 1. Tạo thời gian tiêm từ form (giờ địa phương), nếu lỗi thì fallback về thời điểm bấm nút
    let injectedTime = new Date(`${injectData.date}T${injectData.time}:00`);
    if (isNaN(injectedTime.getTime())) {
      injectedTime = new Date(); 
    }
    const isoTime = injectedTime.toISOString();

    // 2. Cập nhật trạng thái thành "Đã tiêm" và lưu lại các thông tin từ form
    setPatients((prev) => prev.map((p) => p.id === patient.id ? { 
      ...p, 
      trangThai: 'Đã tiêm',
      vaccineStatus: injectData.vaccineStatus,
      vaccineLot: injectData.vaccineLot,
      injector: injectData.injector,
      ngayGioTiem: isoTime
    } : p));

    // 3. Format lại ngày sinh sang định dạng YYYY-MM-DD để trang theo dõi đọc được
    let formattedDob = '1990-01-01';
    if (patient.ngaySinh) {
      const parts = patient.ngaySinh.split('/');
      if (parts.length === 3) formattedDob = `${parts[2]}-${parts[1]}-${parts[0]}`;
    }

    // 4. Tạo dữ liệu để đẩy sang trang Theo dõi sau tiêm
    const newTrackedPatient = {
      id: patient.id, // Dùng luôn ID của bệnh nhân để tránh bị lặp khi lưu lại nhiều lần
      hoTen: patient.hoTen,
      ngaySinh: formattedDob,
      diaChi: patient.diaChi,
      ghiChu: patient.ghiChu,
      ngayGioTiem: isoTime, // Chuyển sang định dạng ISO 
      tenVacxin: patient.tenVacxin,
      thoiGian: 30, // 30 phút đếm ngược
      status: 'monitoring'
    };

    // 4. Lưu tạm vào sessionStorage để danh sách tự động trống từ đầu khi mở web
    const existingInjected = JSON.parse(sessionStorage.getItem('sessionInjectedPatients') || '[]');
    const existingIndex = existingInjected.findIndex(p => p.id === patient.id);
    if (existingIndex >= 0) {
      existingInjected[existingIndex] = newTrackedPatient; // Cập nhật nếu đã có
    } else {
      existingInjected.push(newTrackedPatient); // Thêm mới nếu chưa có
    }
    sessionStorage.setItem('sessionInjectedPatients', JSON.stringify(existingInjected));

    // 5. Đóng Modal và thông báo
    setIsInjectionModalOpen(false);
    alert(`Đã lưu tiêm thành công cho bệnh nhân ${patient.hoTen}. Hệ thống đã tự động chuyển sang danh sách Theo dõi!`);
  };

  return (
    <div className="post-vaccine-tracking-wrapper">
      {/* Page Header */}
      <header className="pvt-header">
        <div>
          <h1 className="pvt-title font-headline">Danh sách chờ tiêm</h1>
          <p className="pvt-subtitle">Quản lý và điều phối bệnh nhân đang chờ thực hiện tiêm chủng</p>
        </div>
      </header>

      {/* Main Card */}
      <div className="pvt-card-container">
        
        {/* Thanh công cụ Tìm kiếm & Nút bấm */}
        <div className="pvt-toolbar">
          <div className="pvt-search-section">
            <div className="pvt-search-box">
              <Search className="pvt-search-icon" size={18} />
              <input
                type="text"
                placeholder="Tìm mã tiêm chủng / họ tên..."
                className="pvt-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="pvt-btn pvt-btn-primary">Tìm kiếm</button>
          </div>
        </div>

        {/* Bảng dữ liệu */}
        <div className="pvt-table-wrapper">
          <table className="pvt-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Trạng thái</th>
                <th>Số TT</th>
                <th>Họ Tên</th>
                <th>Ngày sinh</th>
                <th>Điện thoại</th>
                <th>Địa chỉ</th>
                <th>Tên vắc xin tiêm</th>
                <th>Ghi chú</th>
                <th>Ngày đăng ký</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {patients.length > 0 ? (
                patients.map((patient) => (
                  <tr key={patient.id}>
                    <td>{patient.stt}</td>
                    <td>
                      <span className={`pvt-countdown-badge ${patient.trangThai === 'Đã tiêm' ? 'completed' : 'monitoring'}`}>
                        {patient.trangThai}
                      </span>
                    </td>
                    <td className="pvt-bold" style={{ fontSize: '1.1em' }}>{patient.soTT}</td>
                    <td 
                      className="pvt-bold" 
                      style={{ color: '#2563eb', cursor: 'pointer' }}
                      onClick={() => { setSelectedPatient(patient); setIsInjectionModalOpen(true); }}
                    >
                      {patient.hoTen}
                    </td>
                    <td>{patient.ngaySinh}</td>
                    <td>{patient.dienThoai}</td>
                    <td className="pvt-address">{patient.diaChi}</td>
                    <td>{patient.tenVacxin}</td>
                    <td>{patient.ghiChu || '-'}</td>
                    <td>{patient.ngayDangKy}</td>
                    <td>
                      <div className="pvt-actions">
                        <button 
                          className="pvt-action-btn pvt-action-view" 
                          title="Xem chi tiết"
                          onClick={() => { setSelectedPatient(patient); setIsInjectionModalOpen(true); }}
                        >
                          <Eye size={18} />
                        </button>
                        <button className="pvt-action-btn pvt-action-delete" title="Xóa">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="11" className="pvt-no-data">
                    Không có bệnh nhân nào đang chờ tiêm.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <InjectionModal 
        isOpen={isInjectionModalOpen} 
        onClose={() => setIsInjectionModalOpen(false)} 
        patientData={selectedPatient} 
        onSave={handleSaveInjection}
      />
    </div>
  );
};

export default WaitingForInjection;