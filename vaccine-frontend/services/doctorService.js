// /**
//  * doctorService.js
//  * API calls for Doctor Workspace screens
//  * Based on database schema: VaccinationSession, VaccinationDetail, VaccineAppointment, Customer
//  */

// const BASE_URL = import.meta.env.VITE_API_URL || '/api';

// // ─── HELPERS ─────────────────────────────────────────────────────────────────
// const handleResponse = async (res) => {
//   if (!res.ok) {
//     const err = await res.json().catch(() => ({ message: res.statusText }));
//     throw new Error(err.message || 'Request failed');
//   }
//   return res.json();
// };

// const authHeaders = () => ({
//   'Content-Type': 'application/json',
//   Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
// });

// // ─── WAITING LIST ─────────────────────────────────────────────────────────────
// /**
//  * Lấy danh sách chờ khám của bác sĩ:
//  * VaccinationSession WHERE status = 'SCREENED' AND screeningResult = 'APPROVED'
//  */
// export const getWaitingList = async (params = {}) => {
//   const query = new URLSearchParams({
//     status: 'SCREENED',
//     screeningResult: 'APPROVED',
//     ...params,
//   });
//   const res = await fetch(`${BASE_URL}/vaccination-sessions?${query}`, {
//     headers: authHeaders(),
//   });
//   return handleResponse(res);
// };

// // ─── VACCINATION SESSION ──────────────────────────────────────────────────────
// /** Lấy 1 session theo ID (kèm thông tin customer, details, appointments) */
// export const getSessionById = async (sessionId) => {
//   const res = await fetch(`${BASE_URL}/vaccination-sessions/${sessionId}`, {
//     headers: authHeaders(),
//   });
//   return handleResponse(res);
// };

// /**
//  * Lưu phiếu khám sàng lọc → append vào note của VaccinationSession
//  * Body: { note: string }
//  */
// export const saveScreeningNote = async (sessionId, screeningData) => {
//   const { weight, temperature, answers, examType } = screeningData;
//   const noteText = buildScreeningNote({ weight, temperature, answers, examType });
//   const res = await fetch(`${BASE_URL}/vaccination-sessions/${sessionId}/note`, {
//     method: 'PATCH',
//     headers: authHeaders(),
//     body: JSON.stringify({ appendNote: noteText }),
//   });
//   return handleResponse(res);
// };

// const buildScreeningNote = ({ weight, temperature, answers, examType }) => {
//   const date = new Date().toLocaleString('vi-VN');
//   const answerLines = answers
//     .map((a, i) => `  Q${i + 1}: ${a.answer === 'yes' ? 'Có' : 'Không'}`)
//     .join('\n');
//   return `\n--- Khám sàng lọc (${examType || 'Khám thường'}) - ${date} ---\nCân nặng: ${weight} kg | Thân nhiệt: ${temperature}°C\n${answerLines}\n`;
// };

// /** Hủy phiếu (xóa note vừa ghi, không thay đổi status) */
// export const cancelScreeningNote = async (sessionId) => {
//   // Business rule: hủy phiếu chỉ clear draft - tuỳ backend implement
//   // Ở đây ta không làm gì hoặc gọi endpoint riêng
//   return Promise.resolve({ success: true });
// };

// // ─── VACCINATION DETAIL (Chỉ định) ───────────────────────────────────────────
// /** Lấy danh sách chỉ định của 1 session */
// export const getVaccinationDetails = async (sessionId) => {
//   const res = await fetch(`${BASE_URL}/vaccination-sessions/${sessionId}/details`, {
//     headers: authHeaders(),
//   });
//   return handleResponse(res);
// };

// /**
//  * Lưu các hàng chỉ định (insert VaccinationDetail)
//  * rows: [{ vaccineId, doseNumber, dosePerVial }]
//  */
// export const savePrescriptionRows = async (sessionId, rows) => {
//   const res = await fetch(`${BASE_URL}/vaccination-sessions/${sessionId}/details/bulk`, {
//     method: 'POST',
//     headers: authHeaders(),
//     body: JSON.stringify({ details: rows }),
//   });
//   return handleResponse(res);
// };

// /** Xóa 1 hàng chỉ định */
// export const deleteVaccinationDetail = async (detailId) => {
//   const res = await fetch(`${BASE_URL}/vaccination-details/${detailId}`, {
//     method: 'DELETE',
//     headers: authHeaders(),
//   });
//   return handleResponse(res);
// };

// /**
//  * Append ghi chú chỉ định vào note của VaccinationSession
//  */
// export const savePrescriptionNote = async (sessionId, note) => {
//   const noteText = `\n--- Ghi chú chỉ định (${new Date().toLocaleString('vi-VN')}) ---\n${note}\n`;
//   const res = await fetch(`${BASE_URL}/vaccination-sessions/${sessionId}/note`, {
//     method: 'PATCH',
//     headers: authHeaders(),
//     body: JSON.stringify({ appendNote: noteText }),
//   });
//   return handleResponse(res);
// };

// // ─── VACCINE APPOINTMENT (Hẹn tiêm) ──────────────────────────────────────────
// /** Lấy lịch hẹn gần đây của 1 customer */
// export const getAppointmentsByCustomer = async (customerId) => {
//   const res = await fetch(
//     `${BASE_URL}/vaccine-appointments?customerId=${customerId}&sort=appointmentDate:desc&limit=10`,
//     { headers: authHeaders() }
//   );
//   return handleResponse(res);
// };

// /**
//  * Tạo lịch hẹn mới
//  * appointment: { customerId, vaccineId, appointmentDate, doseNumber, note }
//  */
// export const createAppointment = async (appointment) => {
//   const res = await fetch(`${BASE_URL}/vaccine-appointments`, {
//     method: 'POST',
//     headers: authHeaders(),
//     body: JSON.stringify(appointment),
//   });
//   return handleResponse(res);
// };

// /** Xóa lịch hẹn */
// export const deleteAppointment = async (appointmentId) => {
//   const res = await fetch(`${BASE_URL}/vaccine-appointments/${appointmentId}`, {
//     method: 'DELETE',
//     headers: authHeaders(),
//   });
//   return handleResponse(res);
// };

// // ─── CUSTOMER ────────────────────────────────────────────────────────────────
// /** Lấy thông tin chi tiết khách hàng */
// export const getCustomerById = async (customerId) => {
//   const res = await fetch(`${BASE_URL}/customers/${customerId}`, {
//     headers: authHeaders(),
//   });
//   return handleResponse(res);
// };

// /** Lấy lịch sử tiêm chủng của khách hàng */
// export const getVaccinationHistory = async (customerId) => {
//   const res = await fetch(
//     `${BASE_URL}/vaccination-sessions?customerId=${customerId}&status=COMPLETED&sort=createdAt:desc`,
//     { headers: authHeaders() }
//   );
//   return handleResponse(res);
// };

// // ─── VACCINE LIST ─────────────────────────────────────────────────────────────
// /** Lấy danh sách vaccine để chọn trong dropdown */
// export const getVaccines = async () => {
//   const res = await fetch(`${BASE_URL}/vaccines?isActive=true`, {
//     headers: authHeaders(),
//   });
//   return handleResponse(res);
// };


import axios from 'axios';
const BASE_URL = 'http://localhost:8000/api/v1/doctor'; // Điều chỉnh prefix theo backend của bạn

// Helper tự động lấy token
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const doctorService = {
  // 1. Waiting List
  getWaitingList: async (status = 'RECEIVED', screeningResult = '') => {
    const res = await axios.get(`${BASE_URL}/waiting-list`, {
      params: { status, screening_result: screeningResult },
      headers: getAuthHeader()
    });
    return res.data;
  },

  // 2. Thông tin chung (Bệnh nhân & Session)
  getSessionDetail: async (sessionId) => {
    const res = await axios.get(`${BASE_URL}/sessions/${sessionId}`, { headers: getAuthHeader() });
    return res.data;
  },
  getPatientDetails: async (patientId) => {
    const res = await axios.get(`http://localhost:8000/api/v1/patients/${patientId}`, { headers: getAuthHeader() });
    return res.data;
  },
  getPatientHistory: async (patientId) => {
    const res = await axios.get(`${BASE_URL}/patient-history/${patientId}`, { headers: getAuthHeader() });
    return res.data;
  },

  // 3. Khám Sàng Lọc (Patch Note)
  appendSessionNote: async (sessionId, note) => {
    const res = await axios.patch(`${BASE_URL}/sessions/${sessionId}/note`, { note }, { headers: getAuthHeader() });
    return res.data;
  },

  // 4. Chỉ định (Save Prescription)
  savePrescription: async (sessionId, payload) => {
    const res = await axios.post(`${BASE_URL}/session/${sessionId}/save-prescription`, payload, {
      headers: getAuthHeader()
    });
    return res.data;
  },

  // 5. Hẹn tiêm
  getAppointments: async (patientId) => {
    const res = await axios.get(`${BASE_URL}/appointments`, { params: { patient_id: patientId }, headers: getAuthHeader() });
    return res.data;
  },
  createAppointment: async (payload) => {
    const res = await axios.post(`${BASE_URL}/appointments`, payload, { headers: getAuthHeader() });
    return res.data;
  },
  deleteAppointment: async (appointmentId) => {
    const res = await axios.delete(`${BASE_URL}/appointments/${appointmentId}`, { headers: getAuthHeader() });
    return res.data;
  },

  // 6. Danh sách Vaccine
  getVaccines: async () => {
    const res = await axios.get(`http://localhost:8000/api/v1/vaccines`, { headers: getAuthHeader() });
    return res.data;
  }
};