/**
 * index.js — Export barrel for doctor-workspace module
 *
 * Usage in router (react-router-dom v6):
 *
 * import WaitingList from './doctor-workspace/pages/WaitingList';
 * import DoctorWorkspace from './doctor-workspace/pages/DoctorWorkspace';
 *
 * <Route path="/bac-si/cho-kham" element={<WaitingList />} />
 * <Route path="/bac-si/workspace/:sessionId" element={<DoctorWorkspace />} />
 *
 * ─── FILE STRUCTURE ───────────────────────────────────────────────────────────
 *
 * doctor-workspace/
 * ├── pages/
 * │   ├── WaitingList.jsx          ← Danh sách chờ khám (status=SCREENED, screeningResult=APPROVED)
 * │   ├── WaitingList.css
 * │   ├── DoctorWorkspace.jsx      ← Màn bác sĩ + 3 tabs
 * │   └── DoctorWorkspace.css
 * ├── components/
 * │   ├── ScreeningTab.jsx         ← Tab khám sàng lọc → ghi vào note session
 * │   ├── PrescriptionTab.jsx      ← Tab chỉ định → insert VaccinationDetail
 * │   ├── AppointmentTab.jsx       ← Tab hẹn tiêm → CRUD VaccineAppointment
 * │   ├── CustomerInfoSidebar.jsx  ← Sidebar phải
 * │   ├── CustomerInfoSidebar.css
 * │   ├── CustomerDetailModal.jsx  ← Pop-up xem chi tiết bệnh nhân
 * │   ├── CustomerDetailModal.css
 * │   └── TabStyles.css            ← Shared styles cho tất cả tabs
 * ├── hooks/
 * │   └── useDoctorWorkspace.js    ← Custom hooks: useWaitingList, useDoctorWorkspace,
 * │                                   useScreening, usePrescription, useAppointment, useVaccines
 * ├── services/
 * │   └── doctorService.js         ← API calls (fetch-based, no axios dependency)
 * └── index.js                     ← This file
 *
 * ─── DATABASE MAPPING ─────────────────────────────────────────────────────────
 *
 * WaitingList:
 *   VaccinationSession WHERE status='SCREENED' AND screeningResult='APPROVED'
 *
 * ScreeningTab:
 *   PATCH /vaccination-sessions/:id/note  (appendNote)
 *   → Tất cả thông tin khám sàng lọc được convert thành text, append vào note
 *   → Bấm "Hủy phiếu": không lưu gì
 *
 * PrescriptionTab:
 *   POST /vaccination-sessions/:id/details/bulk  → VaccinationDetail[]
 *     { vaccineId, doseNumber, dosePerVial }
 *   PATCH /vaccination-sessions/:id/note  (ghi chú chỉ định → append vào note)
 *   Bấm "Hủy phiếu": reset form, không gọi API
 *
 * AppointmentTab:
 *   POST   /vaccine-appointments  → tạo mới
 *     { customerId, vaccineId, appointmentDate, doseNumber, note }
 *   DELETE /vaccine-appointments/:id  → xóa lịch hẹn
 *   GET    /vaccine-appointments?customerId=X  → lịch hẹn gần đây
 *
 * CustomerInfoSidebar:
 *   GET /customers/:id
 *   GET /vaccination-sessions?customerId=X&status=COMPLETED  → lịch sử tiêm
 *
 * ─── API BASE URL ─────────────────────────────────────────────────────────────
 *   Set VITE_API_URL in .env (default: /api)
 *   Auth token: localStorage.getItem('token')  → Bearer header
 */

export { default as WaitingList } from './pages/WaitingList';
export { default as DoctorWorkspace } from './pages/DoctorWorkspace';
export { default as CustomerInfoSidebar } from './components/CustomerInfoSidebar';
export { default as CustomerDetailModal } from './components/CustomerDetailModal';
export { default as ScreeningTab } from './components/ScreeningTab';
export { default as PrescriptionTab } from './components/PrescriptionTab';
export { default as AppointmentTab } from './components/AppointmentTab';

export {
  useWaitingList,
  useDoctorWorkspace,
  useScreening,
  usePrescription,
  useAppointment,
  useVaccines,
} from './hooks/useDoctorWorkspace';

export * as doctorService from './services/doctorService';