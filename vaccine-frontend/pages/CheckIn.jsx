// import React from 'react';
// import '../assets/check-in.css'; 
// import { useState } from 'react';
// import { useCheckIn } from '../hooks/useCheckIn';

// const CheckIn = () => {
//   const [searchInput, setSearchInput] = useState("");
//   const { patient, loading, handleSearch, handleConfirmCheckin } = useCheckIn();

//     // Xử lý khi nhấn Enter ở ô tìm kiếm
//   const onKeyDown = (e) => {
//     if (e.key === 'Enter') handleSearch(searchInput);
//   };
//   return (
//     <div className="checkin-wrapper">
      
//       {/* Page Heading */}
//       <header className="checkin-header">
//         <h2 className="page-title font-headline">Tiếp đón Bệnh nhân</h2>
//         <p className="page-subtitle">Tìm kiếm và xác nhận thông tin bệnh nhân trước khi chuyển sang phòng khám sàng lọc.</p>
//       </header>

//       {/* Main Layout Grid */}
//       <div className="checkin-grid">
        
//         {/* --- Cột Trái: Tìm kiếm & Thông tin bệnh nhân --- */}
//         <div className="checkin-col-left">
          
//           {/* Card: Thanh tìm kiếm */}
//           <div className="checkin-card">
//             <h3 className="card-title font-headline">Tìm kiếm thông tin bệnh nhân</h3>
//             <div className="search-group">
//               {/* <div className="input-wrapper">
//                 <span className="material-symbols-outlined input-icon">badge</span>
                
//               </div> */}
//               <input
//                   className="search-input"
//                   placeholder="Nhập Số điện thoại hoặc CCCD..."
//                   type="text"
//                   value={searchInput}
//                   onChange={(e) => setSearchInput(e.target.value)}
//                   onKeyDown={onKeyDown}
//                 />
//               <button 
//                 className="btn-primary"
//                 onClick={() => handleSearch(searchInput)}
//                 disabled={loading}
//               >
//                 <span className="material-symbols-outlined">search</span>
//                 <span>Tìm kiếm</span>
//               </button>
//             </div>
//           </div>

//           {/* Card: Thông tin chi tiết */}
//           <div className="checkin-card overflow-hidden">
//             <div className="card-accent-line"></div>

//             <div className="patient-header">
//               <div className="patient-profile">
//                 <div className="patient-avatar font-headline">LM</div>
//                 <div>
//                   <h3 className="patient-name font-headline">{patient.FullName || '--'}</h3>
//                   <div className="patient-badges">
//                     <span className="badge-id">Mã: {patient.PatientCode || '--'}</span>
//                     <span>•</span>
//                     <span className="badge-status">
//                       <span className="material-symbols-outlined">check_circle</span> 
//                       Đã định danh
//                     </span>
//                   </div>
//                 </div>
//               </div>
//               <button className="btn-icon">
//                 <span className="material-symbols-outlined">edit</span>
//               </button>
//             </div>

//             <div className="patient-info-grid">
//               <div className="info-item">
//                 <p className="label">Ngày sinh</p>
//                 <p className="value">{patient.DateOfBirth || '--'}</p>
//               </div>
//               <div className="info-item">
//                 <p className="label">Giới tính</p>
//                 <p className="value">{patient.Gender || '--'}</p>
//               </div>
//               <div className="info-item">
//                 <p className="label">Số điện thoại</p>
//                 <p className="value">{patient.PhoneNumber || '--'}</p>
//               </div>
//               <div className="info-item">
//                 <p className="label">Địa chỉ</p>
//                 <p className="value">{patient.Address || '--'}</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* --- Cột Phải: Lịch hẹn & Hành động --- */}
//         <div className="checkin-col-right">
          
//           {/* Card: Lịch hẹn tiêm */}
//           <div className="checkin-card" style={{ height: '100%' }}>
//             <div className="appointments-header">
//               <h3 className="card-title font-headline" style={{ margin: 0 }}>Lịch hẹn tiêm hôm nay</h3>
//               <span className="appointment-count">1 Lịch hẹn</span>
//             </div>

//             <div className="appointment-list">
//               {/* Item Lịch hẹn */}
//               <div className="appointment-item">
//                 <div className="apt-item-header">
//                   <div className="apt-item-title-wrap">
//                     <span className="material-symbols-outlined apt-item-icon">vaccines</span>
//                     <h4 className="apt-item-title">Vắc xin Cúm (Vaxigrip Tetra)</h4>
//                   </div>
//                   <span className="apt-item-time">09:30 AM</span>
//                 </div>
//                 <p className="apt-item-desc">
//                   Liều nhắc lại hàng năm. Bệnh nhân không có tiền sử dị ứng thuốc.
//                 </p>
//               </div>
//             </div>

//             {/* Nút Hành động Chính */}
//             <div className="card-footer">
//               <button 
//                 className="btn-primary-block font-headline"
//                 onClick={() => handleConfirmCheckin(patient.AppointmentID)}
//                 disabled={!patient || loading}
//               >
//                 <span>Xác nhận & Chuyển khám sàng lọc</span>
//                 <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
//               </button>
//             </div>
//           </div>
          
//         </div>

//       </div>
//     </div>
//   );
// };

// export default CheckIn;

import React, { useState } from 'react';
import '../assets/check-in.css';
import { useCheckIn } from '../hooks/useCheckIn';

const CheckIn = () => {
  const [searchInput, setSearchInput] = useState('');
  const { patient, loading, handleSearch, handleConfirmCheckin } = useCheckIn();

  // Nhấn Enter để search
  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch(searchInput.trim());
    }
  };

  // Generate initials
  const getInitials = (name) => {
    if (!name) return '--';
    const words = name.split(' ');
    if (words.length >= 2) {
      return words.slice(-2).map(w => w[0]).join('').toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="checkin-wrapper">
      
      {/* Header */}
      <header className="checkin-header">
        <h2 className="page-title font-headline">Tiếp đón Bệnh nhân</h2>
        <p className="page-subtitle">
          Tìm kiếm và xác nhận thông tin bệnh nhân trước khi chuyển sang phòng khám sàng lọc.
        </p>
      </header>

      <div className="checkin-grid">

        {/* LEFT */}
        <div className="checkin-col-left">

          {/* SEARCH */}
          <div className="checkin-card">
            <h3 className="card-title font-headline">Tìm kiếm thông tin bệnh nhân</h3>

            <div className="search-group">
              <input
                className="search-input"
                placeholder="Nhập SĐT hoặc CCCD..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={onKeyDown}
              />

              <button
                className="btn-primary"
                onClick={() => handleSearch(searchInput.trim())}
                disabled={loading}
              >
                <span className="material-symbols-outlined">search</span>
                <span>Tìm kiếm</span>
              </button>
            </div>
          </div>

          {/* PATIENT INFO */}
          <div className="checkin-card overflow-hidden">
            <div className="card-accent-line"></div>

            {/* HEADER */}
            <div className="patient-header">
              <div className="patient-profile">
                
                <div className="patient-avatar font-headline">
                  {getInitials(patient?.FullName)}
                </div>

                <div>
                  <h3 className="patient-name font-headline">
                    {loading ? 'Đang tìm...' : (patient?.FullName || '--')}
                  </h3>

                  <div className="patient-badges">
                    <span className="badge-id">
                      Mã: {patient?.PatientCode || '--'}
                    </span>

                    <span>•</span>

                    <span className="badge-status">
                      <span className="material-symbols-outlined">check_circle</span>
                      {patient ? ' Đã định danh' : ' Chưa có dữ liệu'}
                    </span>
                  </div>
                </div>
              </div>

              <button className="btn-icon" disabled={!patient}>
                <span className="material-symbols-outlined">edit</span>
              </button>
            </div>

            {/* BODY */}
            <div className="patient-info-grid">

              <div className="info-item">
                <p className="label">Ngày sinh</p>
                <p className="value">{patient?.DateOfBirth || '--'}</p>
              </div>

              <div className="info-item">
                <p className="label">Giới tính</p>
                <p className="value">{patient?.Gender || '--'}</p>
              </div>

              <div className="info-item">
                <p className="label">Số điện thoại</p>
                <p className="value">{patient?.Phone || '--'}</p>
              </div>

              <div className="info-item">
                <p className="label">Địa chỉ</p>
                <p className="value">{patient?.Address || '--'}</p>
              </div>

            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="checkin-col-right">

          <div className="checkin-card" style={{ height: '100%' }}>

            <div className="appointments-header">
              <h3 className="card-title font-headline" style={{ margin: 0 }}>
                Lịch hẹn hôm nay
              </h3>

              <span className="appointment-count">
                {patient ? '1 Lịch hẹn' : '0'}
              </span>
            </div>

            <div className="appointment-list">

              {patient ? (
                <div className="appointment-item">
                  <div className="apt-item-header">
                    <div className="apt-item-title-wrap">
                      <span className="material-symbols-outlined apt-item-icon">
                        vaccines
                      </span>
                      <h4 className="apt-item-title">
                        Thông tin lịch hẹn (demo)
                      </h4>
                    </div>

                    <span className="apt-item-time">--:--</span>
                  </div>

                  <p className="apt-item-desc">
                    Hiện tại chưa load API appointment.
                  </p>
                </div>
              ) : (
                <p style={{ padding: '1rem', color: '#888' }}>
                  Chưa có dữ liệu
                </p>
              )}

            </div>

            {/* ACTION */}
            <div className="card-footer">
              <button
                className="btn-primary-block font-headline"
                onClick={() => handleConfirmCheckin(patient?.AppointmentID)}
                disabled={!patient || loading}
              >
                <span>Xác nhận & Chuyển khám</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default CheckIn;