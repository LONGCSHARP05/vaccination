import { useState, useEffect } from "react";
import { getPatients, deletePatient } from "../services/patientService";

export function usePatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const data = await getPatients();
      setPatients(data);
    } catch (err) {
      setError("Không thể tải danh sách hồ sơ");
    } finally {
      setLoading(false);
    }
  };

  const removePatient = async (id) => {
    try {
      await deletePatient(id);
      setPatients(patients.filter(p => p.id !== id));
      return true;
    } catch (err) {
      setError("Lỗi khi xóa hồ sơ");
      return false;
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return { patients, loading, error, fetchPatients, removePatient };
}