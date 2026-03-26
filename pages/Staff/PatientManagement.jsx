import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function PatientManagement() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleAdd = () => navigate("/staff/patients/new");
  const handleEdit = (id) => navigate(`/staff/patients/edit/${id}`);
  const handleViewHistory = (id) => navigate(`/staff/patients/${id}/history`);
  const handleDelete = (id) => {
    if(window.confirm("Bạn có chắc chắn muốn xóa hồ sơ này?")) {
      alert("Đã xóa hồ sơ thành công!");
    }
  };

  const mockPatients = [
    { id: 1, code: "BN001", name: "Nguyễn Văn An", dob: "12/05/1990", age: 34, phone: "0901234567", gender: "Nam", bloodGroup: "O+", address: "Cầu Giấy, Hà Nội", avatar: "https://i.pravatar.cc/150?img=11" },
    { id: 2, code: "BN002", name: "Trần Thị Bình", dob: "24/08/1995", age: 29, phone: "0987654321", gender: "Nữ", bloodGroup: "A+", address: "Đống Đa, Hà Nội", avatar: "https://i.pravatar.cc/150?img=5" },
    { id: 3, code: "BN003", name: "Lê Hoàng Cường", dob: "05/11/1988", age: 36, phone: "0911222333", gender: "Nam", bloodGroup: "B-", address: "Thanh Xuân, Hà Nội", avatar: "https://i.pravatar.cc/150?img=12" },
    { id: 4, code: "BN004", name: "Phạm Thu Hà", dob: "15/02/2000", age: 24, phone: "0944555666", gender: "Nữ", bloodGroup: "AB+", address: "Hai Bà Trưng, Hà Nội", avatar: "https://i.pravatar.cc/150?img=9" }
  ];

  return (
    <div style={{ padding: "30px", fontFamily: "Nunito, sans-serif", backgroundColor: "#0b1437", minHeight: "100vh" }}>
      
      {/* THỦ THUẬT: Nhúng CSS trực tiếp để ép viền web và nền ngoài cùng thành màu tối */}
      <style>{`
        body, html {
          margin: 0;
          padding: 0;
          background-color: #0b1437;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>

      {/* HEADER */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <div>
          <h1 style={{ fontSize: "28px", color: "white", margin: 0, fontWeight: "700" }}>Hồ sơ bệnh nhân</h1>
          <p style={{ color: "#a3aed1", marginTop: "4px" }}>Quản lý và tra cứu thông tin tiêm chủng</p>
        </div>
        
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <div style={{ background: "#111c44", padding: "8px 16px", borderRadius: "30px", display: "flex", alignItems: "center", border: "1px solid rgba(255,255,255,0.1)" }}>
            <span style={{ color: "#a3aed1", marginRight: "8px" }}>🔍</span>
            <input 
              type="text" 
              placeholder="Tìm kiếm hồ sơ..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ border: "none", outline: "none", width: "220px", fontSize: "14px", fontFamily: "inherit", background: "transparent", color: "white" }}
            />
          </div>
          <button onClick={handleAdd} style={{ backgroundColor: "#4318ff", color: "white", border: "none", padding: "12px 24px", fontSize: "15px", borderRadius: "12px", cursor: "pointer", fontWeight: "600" }}>
            + Thêm mới
          </button>
        </div>
      </header>

      {/* DANH SÁCH THẺ HỒ SƠ - NỀN TỐI */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(450px, 1fr))", gap: "24px" }}>
        {mockPatients.map((patient) => (
          <div key={patient.id} style={{ background: "#111c44", borderRadius: "20px", padding: "24px", display: "flex", flexDirection: "column", border: "1px solid rgba(255,255,255,0.05)", boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }}>
            
            <div style={{ display: "flex", gap: "20px", alignItems: "center", marginBottom: "20px" }}>
              <img src={patient.avatar} alt="Avatar" style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover", border: "4px solid #0b1437" }} />
              <div>
                <h3 style={{ margin: "0 0 6px 0", color: "white", fontSize: "22px" }}>{patient.name}</h3>
                <span style={{ background: "rgba(67, 24, 255, 0.2)", color: "#7551FF", padding: "4px 12px", borderRadius: "20px", fontSize: "13px", fontWeight: "700" }}>
                  Mã BN: {patient.code}
                </span>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", background: "#0b1437", padding: "20px", borderRadius: "16px", marginBottom: "20px" }}>
              <div>
                <p style={{ margin: "0 0 4px 0", color: "#a3aed1", fontSize: "13px" }}>Tuổi</p>
                <p style={{ margin: 0, color: "white", fontWeight: "800", fontSize: "15px" }}>{patient.age} tuổi</p>
              </div>
              <div>
                <p style={{ margin: "0 0 4px 0", color: "#a3aed1", fontSize: "13px" }}>Giới tính</p>
                <p style={{ margin: 0, color: "white", fontWeight: "800", fontSize: "15px" }}>{patient.gender}</p>
              </div>
              <div>
                <p style={{ margin: "0 0 4px 0", color: "#a3aed1", fontSize: "13px" }}>Nhóm máu</p>
                <p style={{ margin: 0, color: "#e11d48", fontWeight: "800", fontSize: "15px" }}>{patient.bloodGroup}</p>
              </div>
              <div>
                <p style={{ margin: "0 0 4px 0", color: "#a3aed1", fontSize: "13px" }}>Số điện thoại</p>
                <p style={{ margin: 0, color: "white", fontWeight: "800", fontSize: "15px" }}>{patient.phone}</p>
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <p style={{ margin: "0 0 4px 0", color: "#a3aed1", fontSize: "13px" }}>Địa chỉ</p>
                <p style={{ margin: 0, color: "white", fontWeight: "800", fontSize: "15px" }}>{patient.address}</p>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "auto" }}>
              <button onClick={() => handleViewHistory(patient.id)} style={{ padding: "10px 16px", background: "#4318ff", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "700", fontSize: "14px", flex: 1 }}>
                Lịch sử tiêm
              </button>
              <button onClick={() => handleEdit(patient.id)} style={{ padding: "10px 20px", background: "rgba(255, 181, 71, 0.15)", color: "#ffb547", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "700", fontSize: "14px" }}>
                Sửa
              </button>
              <button onClick={() => handleDelete(patient.id)} style={{ padding: "10px 20px", background: "rgba(225, 29, 72, 0.15)", color: "#e11d48", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "700", fontSize: "14px" }}>
                Xóa
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}

export default PatientManagement;