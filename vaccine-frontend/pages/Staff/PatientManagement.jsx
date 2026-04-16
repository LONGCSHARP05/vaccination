import React, { useState } from "react";

function PatientManagement() {
  // 1. QUẢN LÝ STATE DỮ LIỆU & TÌM KIẾM
  const [searchTerm, setSearchTerm] = useState("");
  
  const [patients, setPatients] = useState([
    { id: 1, code: "BN001", name: "Nguyễn Văn An", dob: "12/05/1990", age: 34, phone: "0901234567", gender: "Nam", bloodGroup: "O+", address: "Cầu Giấy, Hà Nội", avatar: "https://i.pravatar.cc/150?img=11" },
    { id: 2, code: "BN002", name: "Trần Thị Bình", dob: "24/08/1995", age: 29, phone: "0987654321", gender: "Nữ", bloodGroup: "A+", address: "Đống Đa, Hà Nội", avatar: "https://i.pravatar.cc/150?img=5" },
    { id: 3, code: "BN003", name: "Lê Hoàng Cường", dob: "05/11/1988", age: 36, phone: "0911222333", gender: "Nam", bloodGroup: "B-", address: "Thanh Xuân, Hà Nội", avatar: "https://i.pravatar.cc/150?img=12" },
    { id: 4, code: "BN004", name: "Phạm Thu Hà", dob: "15/02/2000", age: 24, phone: "0944555666", gender: "Nữ", bloodGroup: "AB+", address: "Hai Bà Trưng, Hà Nội", avatar: "https://i.pravatar.cc/150?img=9" }
  ]);

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.phone.includes(searchTerm)
  );

  // 2. QUẢN LÝ STATE CHO CÁC POPUP
  const [modalType, setModalType] = useState(null); 
  const [selectedPatient, setSelectedPatient] = useState(null); 

  // 3. CÁC HÀM XỬ LÝ
  const openAddModal = () => { setSelectedPatient(null); setModalType('FORM'); };
  const openEditModal = (p) => { setSelectedPatient(p); setModalType('FORM'); };
  const openHistoryModal = (p) => { setSelectedPatient(p); setModalType('HISTORY'); };
  const closeModal = () => { setModalType(null); setSelectedPatient(null); };

  const handleDelete = (id) => {
    if(window.confirm("Bạn có chắc chắn muốn xóa hồ sơ này?")) {
      setPatients(patients.filter(p => p.id !== id));
    }
  };

  const handleSaveForm = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newName = formData.get("fullName");
    const newDob = formData.get("dob");
    const newGender = formData.get("gender");
    const newPhone = formData.get("phone");
    const yearOfBirth = newDob.split('/').pop();
    const calculatedAge = yearOfBirth ? new Date().getFullYear() - parseInt(yearOfBirth) : 0;

    if (selectedPatient && selectedPatient.id) {
      setPatients(patients.map(p => p.id === selectedPatient.id ? { ...p, name: newName, dob: newDob, gender: newGender, phone: newPhone, age: calculatedAge } : p));
    } else {
      const newPatient = {
        id: Date.now(),
        code: "BN" + Math.floor(Math.random() * 1000).toString().padStart(3, '0'),
        name: newName, dob: newDob, gender: newGender, phone: newPhone, age: calculatedAge,
        bloodGroup: "Chưa rõ", address: "Chưa cập nhật",
        avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 50)}`
      };
      setPatients([newPatient, ...patients]);
    }
    closeModal();
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Nunito, sans-serif", backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      <style>{`
        body, html { margin: 0; padding: 0; background-color: #f4f7fe; }
        * { box-sizing: border-box; }
        .popup-input { width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #cbd5e1; margin-top: 5px; margin-bottom: 15px; outline: none; }
        .list-row:hover { background-color: #f8fafc !important; transform: translateY(-2px); transition: all 0.2s; }
      `}</style>

      {/* HEADER */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
        <div>
          <h1 style={{ fontSize: "26px", color: "#2b3674", margin: 0, fontWeight: "700" }}>Danh sách hồ sơ</h1>
          <p style={{ color: "#707eae", marginTop: "4px", fontSize: "14px" }}>Hiển thị dạng danh sách chi tiết</p>
        </div>
        
        <div style={{ display: "flex", gap: "15px" }}>
          <div style={{ background: "#fff", padding: "8px 15px", borderRadius: "30px", display: "flex", alignItems: "center", border: "1px solid #e2e8f0" }}>
            <span style={{ color: "#a3aed1" }}>🔍</span>
            <input 
              type="text" placeholder="Tìm kiếm nhanh..." value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ border: "none", outline: "none", marginLeft: "10px", width: "200px", color: "#2b3674" }}
            />
          </div>
          <button onClick={openAddModal} style={{ backgroundColor: "#4318ff", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "12px", cursor: "pointer", fontWeight: "600" }}>+ Thêm mới</button>
        </div>
      </header>

      {/* DANH SÁCH DẠNG LIST */}
      <div style={{ background: "transparent", borderRadius: "20px" }}>
        {/* Header của bảng danh sách */}
        <div style={{ display: "flex", padding: "10px 25px", color: "#a3aed1", fontSize: "13px", fontWeight: "600", textTransform: "uppercase" }}>
          <div style={{ flex: 2 }}>Bệnh nhân</div>
          <div style={{ flex: 1 }}>Mã hồ sơ</div>
          <div style={{ flex: 1 }}>Số điện thoại</div>
          <div style={{ flex: 1 }}>Giới tính</div>
          <div style={{ flex: 2, textAlign: "center" }}>Thao tác</div>
        </div>

        {/* Các hàng dữ liệu */}
        <div style={{ marginTop: "10px" }}>
          {filteredPatients.map((patient) => (
            <div key={patient.id} className="list-row" style={{ 
              display: "flex", alignItems: "center", background: "#fff", 
              padding: "15px 25px", borderRadius: "16px", marginBottom: "12px",
              boxShadow: "0px 18px 40px rgba(112, 144, 176, 0.12)"
            }}>
              {/* Cột 1: Thông tin chính */}
              <div style={{ flex: 2, display: "flex", alignItems: "center", gap: "15px" }}>
                <img src={patient.avatar} alt="avatar" style={{ width: "45px", height: "45px", borderRadius: "12px", objectFit: "cover" }} />
                <div>
                  <div style={{ color: "#2b3674", fontWeight: "700", fontSize: "15px" }}>{patient.name}</div>
                  <div style={{ color: "#a3aed1", fontSize: "12px" }}>{patient.age} tuổi</div>
                </div>
              </div>

              {/* Cột 2: Mã hồ sơ */}
              <div style={{ flex: 1, color: "#2b3674", fontWeight: "600", fontSize: "14px" }}>{patient.code}</div>

              {/* Cột 3: SĐT */}
              <div style={{ flex: 1, color: "#707eae", fontSize: "14px" }}>{patient.phone}</div>

              {/* Cột 4: Giới tính */}
              <div style={{ flex: 1 }}>
                <span style={{ 
                  padding: "4px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: "700",
                  background: patient.gender === "Nam" ? "#e0f2fe" : "#fdf2f8",
                  color: patient.gender === "Nam" ? "#0369a1" : "#be185d"
                }}>
                  {patient.gender}
                </span>
              </div>

              {/* Cột 5: Nút bấm */}
              <div style={{ flex: 2, display: "flex", justifyContent: "center", gap: "8px" }}>
                <button onClick={() => openHistoryModal(patient)} style={{ background: "#f4f7fe", border: "none", padding: "8px 12px", borderRadius: "10px", color: "#4318ff", fontWeight: "700", cursor: "pointer", fontSize: "13px" }}>Lịch sử</button>
                <button onClick={() => openEditModal(patient)} style={{ background: "#fff9db", border: "none", padding: "8px 12px", borderRadius: "10px", color: "#f59f00", fontWeight: "700", cursor: "pointer", fontSize: "13px" }}>Sửa</button>
                <button onClick={() => handleDelete(patient.id)} style={{ background: "#fff5f5", border: "none", padding: "8px 12px", borderRadius: "10px", color: "#ff6b6b", fontWeight: "700", cursor: "pointer", fontSize: "13px" }}>Xóa</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* POPUPS (MODALS) - Giữ nguyên logic */}
      {modalType && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
          {modalType === 'FORM' && (
            <div style={{ background: "#fff", width: "450px", borderRadius: "20px", padding: "30px", boxShadow: "0 20px 50px rgba(0,0,0,0.1)" }}>
              <h2 style={{ color: "#2b3674", margin: "0 0 20px 0" }}>{selectedPatient ? "Sửa hồ sơ" : "Hồ sơ mới"}</h2>
              <form onSubmit={handleSaveForm}>
                <label style={{ fontSize: "13px", color: "#a3aed1" }}>Họ và tên</label>
                <input className="popup-input" name="fullName" defaultValue={selectedPatient?.name || ""} required />
                <div style={{ display: "flex", gap: "10px" }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: "13px", color: "#a3aed1" }}>Ngày sinh</label>
                    <input className="popup-input" name="dob" placeholder="DD/MM/YYYY" defaultValue={selectedPatient?.dob || ""} required />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: "13px", color: "#a3aed1" }}>Giới tính</label>
                    <select className="popup-input" name="gender" defaultValue={selectedPatient?.gender || "Nam"}>
                      <option>Nam</option><option>Nữ</option>
                    </select>
                  </div>
                </div>
                <label style={{ fontSize: "13px", color: "#a3aed1" }}>Số điện thoại</label>
                <input className="popup-input" name="phone" defaultValue={selectedPatient?.phone || ""} required />
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                  <button type="button" onClick={closeModal} style={{ padding: "10px 20px", borderRadius: "10px", border: "1px solid #e2e8f0", background: "none", cursor: "pointer" }}>Hủy</button>
                  <button type="submit" style={{ padding: "10px 20px", borderRadius: "10px", border: "none", background: "#4318ff", color: "#fff", cursor: "pointer" }}>Lưu hồ sơ</button>
                </div>
              </form>
            </div>
          )}
          {modalType === 'HISTORY' && selectedPatient && (
            <div style={{ background: "#fff", width: "550px", borderRadius: "20px", padding: "30px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                <h2 style={{ color: "#2b3674", margin: 0 }}>Lịch sử tiêm: {selectedPatient.name}</h2>
                <button onClick={closeModal} style={{ border: "none", background: "none", fontSize: "20px", cursor: "pointer" }}>&times;</button>
              </div>
              <div style={{ background: "#f4f7fe", borderRadius: "15px", padding: "15px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead><tr style={{ color: "#a3aed1", fontSize: "12px" }}><th>Ngày tiêm</th><th>Vaccine</th><th>Mũi số</th></tr></thead>
                  <tbody>
                    <tr style={{ height: "40px", borderBottom: "1px solid #e2e8f0" }}><td>10/02/2026</td><td style={{ fontWeight: "700" }}>Viêm gan B</td><td>Mũi 1</td></tr>
                    <tr style={{ height: "40px" }}><td>15/01/2026</td><td style={{ fontWeight: "700" }}>Cúm mùa</td><td>Nhắc lại</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PatientManagement;
//xong rồi