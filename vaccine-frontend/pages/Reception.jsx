


import React, { useState } from 'react';
import '../assets/reception.css';
import { useReception } from '../hooks/useReception';
import { toast } from 'react-toastify';
import patientService from '../services/reception/patientService';

const Reception = () => {
  const [activeTab, setActiveTab] = useState('list'); // 'list', 'registered', 'appointments'
  const {
    data, loading, page, setPage, total,
    handleSearchKeyDown, filters, setFilters, search, setSearch
  } = useReception(activeTab);

  const refresh = () => {
    setSearch(''); // Reset search
    setFilters({ status: '', date: '' });
    setPage(1); // Reset to first page
    // loadData() sẽ tự động được gọi qua useEffect khi page, search hoặc filters thay đổi
  }

  const [selectedItem, setSelectedItem] = useState(null); // Lưu thông tin item đang xem
  const [showModal, setShowModal] = useState(false);

  const handleOpenDetail = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const totalPages = Math.ceil(total / 10);
  
  const getStatusBadge = (status) => {
    const statusMap = {
      'RECEIVED': { label: 'Đã tiếp nhận', class: 'st-exam' },
      'SCREENED': { label: 'Đã khám sàng lọc', class: 'st-inject' },
      'VACCINATED': { label: 'Đã tiêm', class: 'st-done' },
      'OBSERVED': { label: 'Đang theo dõi', class: 'st-observed' },
      'COMPLETED': { label: 'Hoàn tất', class: 'st-done' }

    };
    const config = statusMap[status] || { label: status, class: 'st-exam' };
    return <span className={`status-badge ${config.class}`}>{config.label}</span>;
  };

  const [isProcessing, setIsProcessing] = useState(false);


  const handleAccept = async (patient) => {
    if (isProcessing) return;

    const { token } = localStorage.getItem(token);

    if (!token) {
      toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!");
      return;
    }
    setIsProcessing(true);
    try {
      // 1. Gọi API tiếp nhận (Giả sử patientId lấy từ item.PatientID)
      // Nếu là từ tab Lịch hẹn thì truyền thêm AppointmentID, tab Danh sách thì để null
      await patientService.registerPatient(patient.PatientID, token);
      
      toast.success(`Đã tiếp nhận bệnh nhân ${patient.FullName}`);
      
      // 2. Chuyển sang tab "Đã đăng ký" để xem kết quả
      setActiveTab('registered');
      
      // 3. Reset trang về 1 để load data mới nhất
      setPage(1); 
    } catch (error) {
      toast.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="reception-wrapper">
      {/* 1. Sub-bar */}
      <nav className="sub-bar">
        <div className={`sub-bar-item ${activeTab === 'list' ? 'active' : ''}`} onClick={() => setActiveTab('list')}>Danh sách</div>
        <div className={`sub-bar-item ${activeTab === 'registered' ? 'active' : ''}`} onClick={() => setActiveTab('registered')}>Đã đăng ký</div>
        <div className={`sub-bar-item ${activeTab === 'appointments' ? 'active' : ''}`} onClick={() => setActiveTab('appointments')}>Lịch tiêm</div>
      </nav>

{/* 2. Controls (Search & Filters & Refresh) */}
      <div className="controls-container">
        
        {/* TRÁI: Thanh Tìm Kiếm + Nút Tìm Kiếm */}
        <div className="search-wrapper-flex">
          <div className="search-group-refined">
            <span className="material-symbols-outlined" style={{color: '#64748b', fontSize: '20px'}}>search</span>
            <input 
              type="text"
              className="search-input-refined"
              placeholder="Tìm kiếm SĐT hoặc CCCD..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearchKeyDown} // Vẫn giữ tính năng nhấn Enter
            />
          </div>
          {/* {/* <button 
            className="action-btn btn-search-solid" 
            onClick={() => setPage(1)} /* Click tìm kiếm sẽ reset về trang 1 
             Tìm kiếm
           </button> */}
        </div>

        {/* PHẢI: Các Bộ Lọc + Nút Làm mới */}
        <div className="filter-wrapper-flex">
          
          {/* Nút/Dropdown Lọc Trạng thái (Chỉ hiện ở Tab Đã đăng ký) */}
          {activeTab === 'registered' && (
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined" ></span>
              <select 
                className="filter-select" 
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
              >
                <option value="">Tất cả trạng thái</option>
                <option value="RECEIVED">Đang chờ khám</option>
                <option value="SCREENED">Đã khám</option>
                <option value="VACCINATED">Đã tiêm</option>
                <option value="OBSERVED">Đang theo dõi</option>
                <option value="COMPLETED">Hoàn tất</option>
              </select>
            </div>
          )}

          {/* Nút/Dropdown Lọc Ngày (Chỉ hiện ở Tab Lịch tiêm) */}
          {activeTab === 'appointments' && (
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined"></span>
              <input 
                type="date" 
                className="filter-select" 
                value={filters.date}
                onChange={(e) => setFilters({...filters, date: e.target.value})} 
              />
            </div>
          )}

          {/* Nút Làm Mới (Refresh) */}
          <button 
            className="action-btn btn-outline-action" 
            onClick={refresh} /* Gọi hàm loadData từ Hook */
            title="Tải lại dữ liệu mới nhất"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>refresh</span>
            Làm mới
          </button>

        </div>
      </div>

      {/* 3. Main Content Area */}
      <div className="reception-table-card">
        {loading ? (
          <div className="p-10 text-center text-slate-400">Đang đồng bộ dữ liệu...</div>
        ) : data.length === 0 ? (
          <div className="p-10 text-center text-slate-400">
            <span className="material-symbols-outlined block text-4xl mb-2">database_off</span>
            Không tìm thấy dữ liệu phù hợp.
          </div>
        ) : (
          <table className="reception-table">
            <thead>
              {activeTab === 'list' && (
                <tr>
                  <th>Mã tiêm chủng</th><th>Họ và tên</th><th>Giới tính</th><th>Ngày sinh</th><th>Địa chỉ</th><th style={{textAlign: 'right'}}>Thao tác</th>
                </tr>
              )}
              {activeTab === 'registered' && (
                <tr>
                  <th>Họ và tên</th><th>CCCD</th><th>Trạng thái</th><th>Vaccine chỉ định</th><th style={{textAlign: 'right'}}>Thao tác</th>
                </tr>
              )}
              {activeTab === 'appointments' && (
                <tr>
                  <th>Họ tên</th><th>SĐT</th><th>Ngày hẹn</th><th>Vaccine</th><th>Trạng thái</th><th style={{textAlign: 'right'}}>Thao tác</th>
                </tr>
              )}
            </thead>
            <tbody>
              {data.map((item, idx) => (
                <tr key={idx}>
                  {/* Render dữ liệu tương ứng từng Tab - Ở đây là ví dụ mapping logic */}
                  {activeTab === 'list' && (
                    <>
                      <td><span className="patient-code-tag">{item.PatientCode}</span></td>
                      <td style={{fontWeight: 600}}>{item.FullName}</td>
                      <td>{item.Gender}</td>
                      <td>{item.DateOfBirth}</td>
                      <td className="truncate max-w-[200px]">{item.Address}</td>
                      <td style={{textAlign: 'right'}}>
                        <span className="text-action"><span className="material-symbols-outlined"  onClick={() => handleAccept(item)}>add_circle</span> Tiếp nhận</span>
                      </td>
                    </>
                  )}
                  {activeTab === 'registered' && (
                    <>
                      <td style={{fontWeight: 600}}>{item.FullName}</td>
                      <td>{item.CitizenID}</td>
                      <td>{getStatusBadge(item.Status)}</td>
                      <td>{item.VaccineName || 'Chưa chỉ định'}</td>
                      <td style={{textAlign: 'right'}}>
                        <span className="material-symbols-outlined icon-delete">delete</span>
                      </td>
                    </>
)}
                  {activeTab === 'appointments' && (
                    <>
                      <td style={{fontWeight: 600}}>{item.FullName}</td>
                      <td>{item.Phone}</td>
                      <td style={{color: 'var(--on-surface-variant)'}}>
                        {new Date(item.AppointmentDate).toLocaleDateString('vi-VN')}
                      </td>
                      <td>
                        <span className="patient-code-tag" style={{background: '#fef3c7', color: '#92400e'}}>
                          {item.VaccineName}
                        </span>
                      </td>
                      <td>{getStatusBadge(item.Status)}</td>
                      <td style={{textAlign: 'right'}}>
                        {/* ICON XEM CHI TIẾT */}
                        <div className="btn-view-detail" onClick={() => handleOpenDetail(item)}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                        </div>                        
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 4. Pagination (Bottom Right) */}
      <div className="pagination-right">

        <button
          className="page-btn-small"
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          ‹
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
          <button
            key={p}
            className={`page-btn-small ${p === page ? 'active' : ''}`}
            onClick={() => setPage(p)}
          >
            {p}
          </button>
        ))}

        <button
          className="page-btn-small"
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          ›
        </button>
      </div>

{/* --- POPUP CHI TIẾT LỊCH HẸN --- */}
      {showModal && selectedItem && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-container" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="font-headline" style={{margin: 0, fontSize: '1.125rem'}}>Chi tiết lịch hẹn</h3>
              <button onClick={() => setShowModal(false)} style={{background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8'}}>
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            
            <div className="modal-body">
              <div className="detail-row">
                <span className="detail-label">Họ và tên:</span>
                <span className="detail-value">{selectedItem.FullName}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Mã bệnh nhân:</span>
                <span className="detail-value">{selectedItem.PatientCode}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Số điện thoại:</span>
                <span className="detail-value">{selectedItem.Phone}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Ngày hẹn:</span>
                <span className="detail-value">{new Date(selectedItem.AppointmentDate).toLocaleDateString('vi-VN')}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Vaccine:</span>
                <span className="detail-value">{selectedItem.VaccineName}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Ghi chú:</span>
                <span className="detail-value" style={{fontWeight: 400}}>{selectedItem.Note || 'Không có ghi chú'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Trạng thái:</span>
                {getStatusBadge(selectedItem.Status)}
              </div>
            </div>

            <div className="modal-footer">
              <button className="action-btn btn-outline-action" onClick={() => setShowModal(false)}>Đóng</button>
              <button className="action-btn btn-search-solid">Xác nhận tiếp nhận</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Reception;