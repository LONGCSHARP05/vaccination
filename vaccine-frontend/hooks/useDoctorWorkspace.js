/**
 * useDoctorWorkspace.js
 * Custom hooks for Doctor Workspace screens
 */

import { useState, useEffect, useCallback } from 'react';
import * as doctorService from '../services/doctorService';

// ─── WAITING LIST HOOK ────────────────────────────────────────────────────────
export const useWaitingList = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await doctorService.getWaitingList();
      setSessions(data?.data || data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchList(); }, [fetchList]);

  return { sessions, loading, error, refetch: fetchList };
};

// ─── DOCTOR WORKSPACE HOOK ───────────────────────────────────────────────────
export const useDoctorWorkspace = (sessionId) => {
  const [session, setSession] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [vaccinationHistory, setVaccinationHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSession = useCallback(async () => {
    if (!sessionId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await doctorService.getSessionById(sessionId);
      setSession(data);
      if (data?.customerId) {
        const [cust, history] = await Promise.all([
          doctorService.getCustomerById(data.customerId),
          doctorService.getVaccinationHistory(data.customerId),
        ]);
        setCustomer(cust);
        setVaccinationHistory(history?.data || history || []);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => { fetchSession(); }, [fetchSession]);

  return { session, customer, vaccinationHistory, loading, error, refetch: fetchSession };
};

// ─── VACCINES HOOK ────────────────────────────────────────────────────────────
export const useVaccines = () => {
  const [vaccines, setVaccines] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    doctorService.getVaccines()
      .then((data) => setVaccines(data?.data || data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { vaccines, loading };
};

// ─── SCREENING HOOK ───────────────────────────────────────────────────────────
export const useScreening = (sessionId) => {
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const SCREENING_QUESTIONS = [
    'Hôm nay bạn có bị bệnh gì không?',
    'Bạn có dị ứng với thuốc, thực ăn hay vắc xin không?',
    'Bạn có bị phản ứng nặng sau những lần tiêm chủng vắc xin trước đây không?',
    'Bạn có bị động kinh hoặc có bệnh lý về não, thần kinh không?',
    'Bạn có bị ung thư, bệnh bạch cầu, AIDS, hay bất cứ rối loạn hệ thống miễn dịch nào hay không?',
    'Trong vòng 3 tháng qua, bạn có được sử dụng cotissone, prednisone, các thuốc steroids khác hay thuốc điều trị ung thư hoặc điều trị bằng tia X không?',
    'Trong vòng một năm qua, bạn có được truyền máu hoặc các chế phẩm từ máu hay có sử dụng globulin miễn dịch không?',
    'Đối với phụ nữ, bạn có đang mang thai hay có dự định mang thai trong tháng tới không?',
    'Bạn có được tiêm chủng vắc xin trong 4 tuần vừa qua không?',
    'Thân nhiệt >= 37,5 độ C hoặc <= 35,5 độ C?',
  ];

  const saveScreening = useCallback(async (formData) => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      await doctorService.saveScreeningNote(sessionId, formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }, [sessionId]);

  const cancelScreening = useCallback(async () => {
    await doctorService.cancelScreeningNote(sessionId);
  }, [sessionId]);

  return { saving, success, error, saveScreening, cancelScreening, SCREENING_QUESTIONS };
};

// ─── PRESCRIPTION HOOK ────────────────────────────────────────────────────────
export const usePrescription = (sessionId) => {
  const [rows, setRows] = useState([
    { id: Date.now(), vaccineId: '', doseNumber: 1, dosePerVial: '0.5ml', note: '' },
  ]);
  const [prescriptionNote, setPrescriptionNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const addRow = useCallback(() => {
    setRows((prev) => [
      ...prev,
      { id: Date.now(), vaccineId: '', doseNumber: 1, dosePerVial: '0.5ml' },
    ]);
  }, []);

  const removeRow = useCallback((id) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const updateRow = useCallback((id, field, value) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  }, []);

  const savePrescription = useCallback(async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const validRows = rows.filter((r) => r.vaccineId);
      if (validRows.length === 0) throw new Error('Vui lòng chọn ít nhất 1 loại vắc xin');
      await doctorService.savePrescriptionRows(sessionId, validRows);
      if (prescriptionNote.trim()) {
        await doctorService.savePrescriptionNote(sessionId, prescriptionNote);
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }, [sessionId, rows, prescriptionNote]);

  const cancelPrescription = useCallback(() => {
    setRows([{ id: Date.now(), vaccineId: '', doseNumber: 1, dosePerVial: '0.5ml' }]);
    setPrescriptionNote('');
  }, []);

  return {
    rows, addRow, removeRow, updateRow,
    prescriptionNote, setPrescriptionNote,
    saving, success, error,
    savePrescription, cancelPrescription,
  };
};

// ─── APPOINTMENT HOOK ─────────────────────────────────────────────────────────
export const useAppointment = (sessionId, customerId) => {
  const [appointmentRows, setAppointmentRows] = useState([
    { id: Date.now(), vaccineId: '', appointmentDate: '', doseNumber: 1, note: '' },
  ]);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Fetch recent appointments
  const fetchAppointments = useCallback(async () => {
    if (!customerId) return;
    setLoading(true);
    try {
      const data = await doctorService.getAppointmentsByCustomer(customerId);
      setRecentAppointments(data?.data || data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

  const addAppointmentRow = useCallback(() => {
    setAppointmentRows((prev) => [
      ...prev,
      { id: Date.now(), vaccineId: '', appointmentDate: '', doseNumber: 1, note: '' },
    ]);
  }, []);

  const removeAppointmentRow = useCallback((id) => {
    setAppointmentRows((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const updateAppointmentRow = useCallback((id, field, value) => {
    setAppointmentRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  }, []);

  const saveAppointments = useCallback(async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const validRows = appointmentRows.filter((r) => r.vaccineId && r.appointmentDate);
      if (validRows.length === 0) throw new Error('Vui lòng điền đầy đủ thông tin lịch hẹn');
      await Promise.all(
        validRows.map((row) =>
          doctorService.createAppointment({
            customerId,
            vaccineId: row.vaccineId,
            appointmentDate: row.appointmentDate,
            doseNumber: row.doseNumber,
            note: row.note,
          })
        )
      );
      setSuccess(true);
      setAppointmentRows([{ id: Date.now(), vaccineId: '', appointmentDate: '', doseNumber: 1, note: '' }]);
      await fetchAppointments();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }, [customerId, appointmentRows, fetchAppointments]);

  const cancelAppointments = useCallback(async () => {
    // Delete newly added rows (no IDs from server yet)
    setAppointmentRows([{ id: Date.now(), vaccineId: '', appointmentDate: '', doseNumber: 1, note: '' }]);
  }, []);

  const deleteRecentAppointment = useCallback(async (appointmentId) => {
    try {
      await doctorService.deleteAppointment(appointmentId);
      await fetchAppointments();
    } catch (err) {
      setError(err.message);
    }
  }, [fetchAppointments]);

  return {
    appointmentRows, addAppointmentRow, removeAppointmentRow, updateAppointmentRow,
    recentAppointments, loading,
    saving, success, error,
    saveAppointments, cancelAppointments, deleteRecentAppointment,
  };
};