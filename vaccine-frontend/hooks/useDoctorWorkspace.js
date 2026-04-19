// /**
//  * useDoctorWorkspace.js
//  * Custom hooks for Doctor Workspace screens
//  */

// import { useState, useEffect, useCallback } from 'react';
// import * as doctorService from '../services/doctorService';

// // ─── WAITING LIST HOOK ────────────────────────────────────────────────────────
// export const useWaitingList = () => {
//   const [sessions, setSessions] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const fetchList = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const data = await doctorService.getWaitingList();
//       setSessions(data?.data || data || []);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => { fetchList(); }, [fetchList]);

//   return { sessions, loading, error, refetch: fetchList };
// };

// // ─── DOCTOR WORKSPACE HOOK ───────────────────────────────────────────────────
// export const useDoctorWorkspace = (sessionId) => {
//   const [session, setSession] = useState(null);
//   const [customer, setCustomer] = useState(null);
//   const [vaccinationHistory, setVaccinationHistory] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const fetchSession = useCallback(async () => {
//     if (!sessionId) return;
//     setLoading(true);
//     setError(null);
//     try {
//       const data = await doctorService.getSessionById(sessionId);
//       setSession(data);
//       if (data?.customerId) {
//         const [cust, history] = await Promise.all([
//           doctorService.getCustomerById(data.customerId),
//           doctorService.getVaccinationHistory(data.customerId),
//         ]);
//         setCustomer(cust);
//         setVaccinationHistory(history?.data || history || []);
//       }
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }, [sessionId]);

//   useEffect(() => { fetchSession(); }, [fetchSession]);

//   return { session, customer, vaccinationHistory, loading, error, refetch: fetchSession };
// };

// // ─── VACCINES HOOK ────────────────────────────────────────────────────────────
// export const useVaccines = () => {
//   const [vaccines, setVaccines] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     setLoading(true);
//     doctorService.getVaccines()
//       .then((data) => setVaccines(data?.data || data || []))
//       .catch(console.error)
//       .finally(() => setLoading(false));
//   }, []);

//   return { vaccines, loading };
// };

// // ─── SCREENING HOOK ───────────────────────────────────────────────────────────
// export const useScreening = (sessionId) => {
//   const [saving, setSaving] = useState(false);
//   const [success, setSuccess] = useState(false);
//   const [error, setError] = useState(null);

//   const SCREENING_QUESTIONS = [
//     'Hôm nay bạn có bị bệnh gì không?',
//     'Bạn có dị ứng với thuốc, thực ăn hay vắc xin không?',
//     'Bạn có bị phản ứng nặng sau những lần tiêm chủng vắc xin trước đây không?',
//     'Bạn có bị động kinh hoặc có bệnh lý về não, thần kinh không?',
//     'Bạn có bị ung thư, bệnh bạch cầu, AIDS, hay bất cứ rối loạn hệ thống miễn dịch nào hay không?',
//     'Trong vòng 3 tháng qua, bạn có được sử dụng cotissone, prednisone, các thuốc steroids khác hay thuốc điều trị ung thư hoặc điều trị bằng tia X không?',
//     'Trong vòng một năm qua, bạn có được truyền máu hoặc các chế phẩm từ máu hay có sử dụng globulin miễn dịch không?',
//     'Đối với phụ nữ, bạn có đang mang thai hay có dự định mang thai trong tháng tới không?',
//     'Bạn có được tiêm chủng vắc xin trong 4 tuần vừa qua không?',
//     'Thân nhiệt >= 37,5 độ C hoặc <= 35,5 độ C?',
//   ];

//   const saveScreening = useCallback(async (formData) => {
//     setSaving(true);
//     setError(null);
//     setSuccess(false);
//     try {
//       await doctorService.saveScreeningNote(sessionId, formData);
//       setSuccess(true);
//       setTimeout(() => setSuccess(false), 3000);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setSaving(false);
//     }
//   }, [sessionId]);

//   const cancelScreening = useCallback(async () => {
//     await doctorService.cancelScreeningNote(sessionId);
//   }, [sessionId]);

//   return { saving, success, error, saveScreening, cancelScreening, SCREENING_QUESTIONS };
// };

// // ─── PRESCRIPTION HOOK ────────────────────────────────────────────────────────
// export const usePrescription = (sessionId) => {
//   const [rows, setRows] = useState([
//     { id: Date.now(), vaccineId: '', doseNumber: 1, dosePerVial: '0.5ml', note: '' },
//   ]);
//   const [prescriptionNote, setPrescriptionNote] = useState('');
//   const [saving, setSaving] = useState(false);
//   const [success, setSuccess] = useState(false);
//   const [error, setError] = useState(null);

//   const addRow = useCallback(() => {
//     setRows((prev) => [
//       ...prev,
//       { id: Date.now(), vaccineId: '', doseNumber: 1, dosePerVial: '0.5ml' },
//     ]);
//   }, []);

//   const removeRow = useCallback((id) => {
//     setRows((prev) => prev.filter((r) => r.id !== id));
//   }, []);

//   const updateRow = useCallback((id, field, value) => {
//     setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
//   }, []);

//   const savePrescription = useCallback(async () => {
//     setSaving(true);
//     setError(null);
//     setSuccess(false);
//     try {
//       const validRows = rows.filter((r) => r.vaccineId);
//       if (validRows.length === 0) throw new Error('Vui lòng chọn ít nhất 1 loại vắc xin');
//       await doctorService.savePrescriptionRows(sessionId, validRows);
//       if (prescriptionNote.trim()) {
//         await doctorService.savePrescriptionNote(sessionId, prescriptionNote);
//       }
//       setSuccess(true);
//       setTimeout(() => setSuccess(false), 3000);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setSaving(false);
//     }
//   }, [sessionId, rows, prescriptionNote]);

//   const cancelPrescription = useCallback(() => {
//     setRows([{ id: Date.now(), vaccineId: '', doseNumber: 1, dosePerVial: '0.5ml' }]);
//     setPrescriptionNote('');
//   }, []);

//   return {
//     rows, addRow, removeRow, updateRow,
//     prescriptionNote, setPrescriptionNote,
//     saving, success, error,
//     savePrescription, cancelPrescription,
//   };
// };

// // ─── APPOINTMENT HOOK ─────────────────────────────────────────────────────────
// export const useAppointment = (sessionId, customerId) => {
//   const [appointmentRows, setAppointmentRows] = useState([
//     { id: Date.now(), vaccineId: '', appointmentDate: '', doseNumber: 1, note: '' },
//   ]);
//   const [recentAppointments, setRecentAppointments] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [success, setSuccess] = useState(false);
//   const [error, setError] = useState(null);

//   // Fetch recent appointments
//   const fetchAppointments = useCallback(async () => {
//     if (!customerId) return;
//     setLoading(true);
//     try {
//       const data = await doctorService.getAppointmentsByCustomer(customerId);
//       setRecentAppointments(data?.data || data || []);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   }, [customerId]);

//   useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

//   const addAppointmentRow = useCallback(() => {
//     setAppointmentRows((prev) => [
//       ...prev,
//       { id: Date.now(), vaccineId: '', appointmentDate: '', doseNumber: 1, note: '' },
//     ]);
//   }, []);

//   const removeAppointmentRow = useCallback((id) => {
//     setAppointmentRows((prev) => prev.filter((r) => r.id !== id));
//   }, []);

//   const updateAppointmentRow = useCallback((id, field, value) => {
//     setAppointmentRows((prev) =>
//       prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
//     );
//   }, []);

//   const saveAppointments = useCallback(async () => {
//     setSaving(true);
//     setError(null);
//     setSuccess(false);
//     try {
//       const validRows = appointmentRows.filter((r) => r.vaccineId && r.appointmentDate);
//       if (validRows.length === 0) throw new Error('Vui lòng điền đầy đủ thông tin lịch hẹn');
//       await Promise.all(
//         validRows.map((row) =>
//           doctorService.createAppointment({
//             customerId,
//             vaccineId: row.vaccineId,
//             appointmentDate: row.appointmentDate,
//             doseNumber: row.doseNumber,
//             note: row.note,
//           })
//         )
//       );
//       setSuccess(true);
//       setAppointmentRows([{ id: Date.now(), vaccineId: '', appointmentDate: '', doseNumber: 1, note: '' }]);
//       await fetchAppointments();
//       setTimeout(() => setSuccess(false), 3000);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setSaving(false);
//     }
//   }, [customerId, appointmentRows, fetchAppointments]);

//   const cancelAppointments = useCallback(async () => {
//     // Delete newly added rows (no IDs from server yet)
//     setAppointmentRows([{ id: Date.now(), vaccineId: '', appointmentDate: '', doseNumber: 1, note: '' }]);
//   }, []);

//   const deleteRecentAppointment = useCallback(async (appointmentId) => {
//     try {
//       await doctorService.deleteAppointment(appointmentId);
//       await fetchAppointments();
//     } catch (err) {
//       setError(err.message);
//     }
//   }, [fetchAppointments]);

//   return {
//     appointmentRows, addAppointmentRow, removeAppointmentRow, updateAppointmentRow,
//     recentAppointments, loading,
//     saving, success, error,
//     saveAppointments, cancelAppointments, deleteRecentAppointment,
//   };
// };


import { useState, useEffect, useCallback } from 'react';
import { doctorService } from '../services/doctorService';

// 1. Hook Danh sách chờ
export const useWaitingList = () => {
  const [waitingList, setWaitingList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchList = useCallback(async () => {
    try {
      setLoading(true);
      // Bạn có thể thêm timestamp vào params để tránh browser cache (nếu cần)
      const data = await doctorService.getWaitingList('SCREENED', 'APPROVED'); 
      
      // Đảm bảo data luôn là mảng mới nhất
      setWaitingList(data ); 
    } catch (error) {
      console.error("Lỗi khi làm mới danh sách:", error);
      setWaitingList([]); // Reset về mảng rỗng nếu lỗi
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { 
    fetchList(); 
  }, [fetchList]);

  // Vẫn giữ nguyên return như bạn yêu cầu
  return { waitingList, loading, refresh: fetchList };
};
// 2. Hook Data tổng của Workspace (Đã sửa tên biến trả về cho khớp UI)
export const useDoctorWorkspace = (sessionId) => {
  const [session, setSession] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [vaccinationHistory, setVaccinationHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sessionId) return;
    const loadAllData = async () => {
      setLoading(true);
      try {
        const sessionData = await doctorService.getSessionDetail(sessionId);
        setSession(sessionData);
        
        const [patientData, histData] = await Promise.all([
          doctorService.getPatientDetails(sessionData.PatientID),
          doctorService.getPatientHistory(sessionData.PatientID)
        ]);
        
        setCustomer(patientData);
        setVaccinationHistory(histData.data || histData);
      } catch (err) {
        setError(err.message || 'Lỗi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };
    loadAllData();
  }, [sessionId]);

  return { session, customer, vaccinationHistory, loading, error };
};

// 3. Hook Tab Khám Sàng Lọc (Đã thêm State và Câu hỏi)
export const useScreening = (sessionId) => {
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const SCREENING_QUESTIONS = [
    "Có sốt hay đang mắc bệnh cấp tính không?",
    "Có tiền sử dị ứng, phản vệ với thuốc, vắc xin không?",
    "Có đang dùng thuốc ức chế miễn dịch không?",
    "Có đang mang thai hoặc cho con bú không?"
  ];

  const saveScreening = async (screeningData) => {
    setSaving(true);
    setSuccess(false);
    setError(null);
    try {
      const noteText = `\n--- KHÁM SÀNG LỌC ---\nNhiệt độ: ${screeningData.temperature}°C\nCân nặng: ${screeningData.weight}kg`;
      await doctorService.appendSessionNote(sessionId, noteText);
      setSuccess(true);
      return true;
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const cancelScreening = () => { setSuccess(false); setError(null); };
  
  return { saving, success, error, saveScreening, cancelScreening, SCREENING_QUESTIONS };
};

// 4. Hook Tab Chỉ định Vắc xin (Đã thêm quản lý Rows)
export const usePrescription = (sessionId) => {
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  // Quản lý dòng vắc xin
  const [rows, setRows] = useState([{ vaccineId: '', doseNumber: 1, doseQuantity: '0.5ml' }]);
  const [prescriptionNote, setPrescriptionNote] = useState('');

  const addRow = () => setRows([...rows, { vaccineId: '', doseNumber: 1, doseQuantity: '0.5ml' }]);
  const removeRow = (index) => setRows(rows.filter((_, i) => i !== index));
  const updateRow = (index, field, value) => {
    const newRows = [...rows];
    newRows[index][field] = value;
    setRows(newRows);
  };

  const savePrescription = async () => {
    setSaving(true);
    try {
      const payload = {
        screening_result: 'APPROVED',
        note: prescriptionNote,
        vaccines: rows.filter(r => r.vaccineId !== '') // Bỏ qua dòng trống
      };
      await doctorService.savePrescription(sessionId, payload);
      setSuccess(true);
    } catch (err) {
      console.setError(err.message || 'Lỗi lưu chỉ định');
    } finally {
      setSaving(false);
    }
  };

  const cancelPrescription = () => {
    setRows([{ vaccineId: '', doseNumber: 1, doseQuantity: '0.5ml' }]);
    setPrescriptionNote('');
  };

  return { rows, addRow, removeRow, updateRow, prescriptionNote, setPrescriptionNote, saving, success, error, setError, savePrescription, cancelPrescription };
};

// 5. Hook Tab Hẹn tiêm (Đã map tên biến recentAppointments)
export const useAppointment = (patientId) => {
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadAppointments = useCallback(async () => {
    if (!patientId) return;
    setLoading(true);
    try {
      const data = await doctorService.getAppointments(patientId);
      setRecentAppointments(data.data || data);
    } catch (error) {
      console.setError(error.message || 'Lỗi tải lịch hẹn');
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => { loadAppointments(); }, [loadAppointments]);

  const addAppointment = async (payload) => {
    await doctorService.createAppointment({ ...payload, patient_id: patientId });
    await loadAppointments(); 
  };

  const deleteRecentAppointment = async (id) => {
    await doctorService.deleteAppointment(id);
    await loadAppointments();
  };

  return { recentAppointments, loading, addAppointment, deleteRecentAppointment };
};

// 6. Hook Load Danh mục Vắc xin
export const useVaccines = () => {
  const [vaccines, setVaccines] = useState([]);
  useEffect(() => {
    doctorService.getVaccines().then(data => setVaccines(data.data || data)).catch(()=>[]);
  }, []);
  return { vaccines };
};