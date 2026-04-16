// File: pages/Appointments.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppointmentModal from "../components/AppointmentModal"; 
import { getAppointments } from "../services/appointmentService";
import "../assets/appointments.css"; 

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState(null); 

  // State điều khiển giao diện và bộ lọc
  const [viewMode, setViewMode] = useState("list"); // Mặc định để 'list' hoặc 'card' tùy bạn
  const [statusFilter, setStatusFilter] = useState("all"); 

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await getAppointments();
        setAppointments(response.data);
      } catch (error) {
        console.error("Lỗi:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleAddNew = () => {
    setSelectedAppt(null); 
    setIsModalOpen(true);
  };

  const handleViewDetail = (appt) => {
    setSelectedAppt(appt);
    setIsModalOpen(true);
  };

  const handleSave = (savedAppt) => {
    if (selectedAppt) {
      setAppointments(appointments.map(a => a.id === savedAppt.id ? savedAppt : a));
    } else {
      const newAppt = { ...savedAppt, id: `AP-00${appointments.length + 1}` };
      setAppointments([...appointments, newAppt]);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa lịch tiêm chủng này?")) {
      setAppointments(appointments.filter(a => a.id !== id));
      setIsModalOpen(false); 
    }
  };

  // Logic lọc dữ liệu (Search + Status)
  const filteredAppointments = appointments.filter(appt => {
    const matchesSearch = 
      appt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appt.vaccine.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appt.phone.includes(searchTerm);
    
    const matchesStatus = statusFilter === "all" || appt.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="dashboard-page">
      {/* HEADER */}
      <div className="header-top">
        <div style={{ width: '100px' }}></div> 
        <h1 className="page-title">Quản lý Lịch Tiêm Chủng</h1>
        <button className="btn-logout" onClick={handleLogout}>Đăng xuất</button>
      </div>

      {/* KHUNG NỘI DUNG CHÍNH */}
      <div className="main-content">
        
        {/* THANH CÔNG CỤ (View Toggle -> Filter -> Search) */}
        <div className="controls-row">
          
          {/* 1. NÚT CHUYỂN ĐỔI CHẾ ĐỘ XEM (SVG ICONS) */}
          <div className="view-toggle">
            
            {/* Nút List View (Icon dấu tích + 3 dòng kẻ) */}
            <button 
              className={`btn-view ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="Xem dạng danh sách"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 12 7 16 11 10" />
                <line x1="14" y1="10" x2="21" y2="10" />
                <line x1="14" y1="14" x2="21" y2="14" />
                <line x1="14" y1="18" x2="21" y2="18" />
              </svg>
            </button>

            {/* Nút Grid View (Icon 4 ô vuông) */}
            <button 
              className={`btn-view ${viewMode === 'card' ? 'active' : ''}`}
              onClick={() => setViewMode('card')}
              title="Xem dạng thẻ lưới"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="4" width="6" height="6" rx="1" />
                <rect x="14" y="4" width="6" height="6" rx="1" />
                <rect x="14" y="14" width="6" height="6" rx="1" />
                <rect x="4" y="14" width="6" height="6" rx="1" />
              </svg>
            </button>
            
          </div>

          {/* 2. Bộ lọc trạng thái */}
          <select 
            className="filter-select" 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ tiêm</option>
            <option value="completed">Đã tiêm</option>
          </select>

          {/* 3. Ô tìm kiếm */}
          <div className="search-wrapper-inline">
            <input 
              type="text" 
              className="search-input-inline" 
              placeholder="Tìm kiếm theo tên bệnh nhân, vắc xin hoặc SĐT..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* THANH THÔNG TIN */}
        <div className="info-bar">
          <span style={{ fontWeight: '600' }}>Tìm thấy {filteredAppointments.length} lịch tiêm chủng</span>
          <button style={{ backgroundColor: '#10b981', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }} onClick={handleAddNew}>
            + Đặt lịch mới
          </button>
        </div>

        {/* HIỂN THỊ DỮ LIỆU */}
        {loading ? (
          <div style={{ textAlign: 'center', color: 'white', marginTop: '50px', fontSize: '18px' }}>Đang tải dữ liệu...</div>
        ) : (
          viewMode === 'card' ? (
            
            // --- DẠNG THẺ (CARD GRID) ---
            <div className="card-grid">
              {filteredAppointments.map((item) => (
                <div className="appt-card" key={item.id}>
                  <div className="card-header-color">
                    <h3>{item.patientName}</h3>
                    <span className={`status-badge ${item.status === 'completed' ? 'status-active' : 'status-pending'}`}>
                      {item.status === 'completed' ? 'ĐÃ TIÊM' : 'CHỜ TIÊM'}
                    </span>
                  </div>
                  <div className="card-body-white">
                    <div className="info-row"><span className="info-label">Mã:</span><span className="info-value">{item.id}</span></div>
                    <div className="info-row"><span className="info-label">SĐT:</span><span className="info-value">{item.phone}</span></div>
                    <div className="info-row"><span className="info-label">Vắc xin:</span><span className="info-value">{item.vaccine}</span></div>
                    <div className="info-row"><span className="info-label">Lịch:</span><span className="info-value">{item.date} {item.time}</span></div>
                    <div className="card-desc">Vui lòng đối chiếu thông tin bệnh nhân trên hệ thống trước khi thực hiện quy trình tiêm.</div>
                    <button className="btn-detail" onClick={() => handleViewDetail(item)}>Xem chi tiết</button>
                  </div>
                </div>
              ))}
            </div>

          ) : (
            
            // --- DẠNG BẢNG (LIST VIEW) ---
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Mã Lịch</th>
                    <th>Tên Bệnh Nhân</th>
                    <th>Số Điện Thoại</th>
                    <th>Loại Vắc Xin</th>
                    <th>Ngày Giờ</th>
                    <th>Trạng Thái</th>
                    <th>Thao Tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map((item) => (
                    <tr key={item.id}>
                      <td style={{ fontWeight: '600' }}>{item.id}</td>
                      <td>{item.patientName}</td>
                      <td>{item.phone}</td>
                      <td>{item.vaccine}</td>
                      <td>{item.date} {item.time}</td>
                      <td>
                        <span className={`status-badge ${item.status === 'completed' ? 'status-active' : 'status-pending'}`}>
                          {item.status === 'completed' ? 'ĐÃ TIÊM' : 'CHỜ TIÊM'}
                        </span>
                      </td>
                      <td>
                        <button className="btn-action-sm" onClick={() => handleViewDetail(item)}>Chi tiết</button>
                      </td>
                    </tr>
                  ))}
                  {filteredAppointments.length === 0 && (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>Không tìm thấy lịch tiêm nào thỏa mãn điều kiện lọc.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>

      <AppointmentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        appointment={selectedAppt}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default Appointments;