import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";

// Các component của Staff
import PatientManagement from "../pages/staff/PatientManagement";
import PatientForm from "../pages/staff/PatientForm";
import VaccineHistory from "../pages/staff/VaccineHistory";

// Giả sử nhóm bạn có một layout riêng cho nhân viên
// import StaffLayout from "../layouts/StaffLayout"; 

function AppRoutes() {
  return (
    <Routes>
      {/* Route Public */}
      <Route path="/login" element={<Login />} />

      {/* CÁC ROUTE DÀNH CHO NHÂN VIÊN */}
      {/* Bọc trong StaffLayout nếu nhóm bạn đã tạo, nếu chưa thì tạm thời để trống */}
      <Route path="/staff/patients" element={<PatientManagement />} />
      <Route path="/staff/patients/new" element={<PatientForm />} />
      <Route path="/staff/patients/edit/:id" element={<PatientForm />} />
      <Route path="/staff/patients/:id/history" element={<VaccineHistory />} />
      
    </Routes>
  );
}

export default AppRoutes;