// import { useState } from 'react';
// import { receptionService } from '../services/checkinService';
// import { useAuth } from './useAuth';
// import { toast } from 'react-toastify';

// export const useCheckIn = () => {
//   const { token } = useAuth();
//   const [patient, setPatient] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // Logic tìm kiếm: Chỉ chạy khi gọi hàm này (Enter hoặc Click nút)
//   const handleSearch = async (identifier) => {
//     if (!identifier) return;
//     setLoading(true);
//     try {
//       const data = await receptionService.searchPatient(identifier, token);
//       setPatient(data);
//     } catch (err) {
//       setPatient(null);
//       toast.error(err.response?.data?.detail || "Không tìm thấy bệnh nhân");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Logic tạo phiên: Chỉ chạy khi bấm nút xác nhận
//   const handleConfirmCheckin = async (appointmentId) => {
//     if (!patient) {
//       toast.error("Vui lòng tìm kiếm bệnh nhân trước");
//       return;
//     }
//     setLoading(true);
//     try {
//       await receptionService.createSession(patient.PatientID, appointmentId, token);
//       toast.success("Tiếp nhận bệnh nhân thành công!");
//       // Reset hoặc điều hướng sau khi xong
//     } catch (err) {
//       toast.error(err.response?.data?.detail || "Lỗi khi tạo phiên tiếp nhận");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return {
//     patient,
//     loading,
//     handleSearch,
//     handleConfirmCheckin
//   };
// };


import { useState, useRef } from 'react';
import { receptionService } from '../services/checkinService';
import { useAuth } from './useAuth';
import { toast } from 'react-toastify';

export const useCheckIn = () => {
  const { token } = useAuth();

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(false);

  const abortRef = useRef(null);
  const handleSearch = async (identifier) => {
    console.log("SEARCH:", identifier);
    if (!identifier.trim()) return;

    if (abortRef.current) {
      abortRef.current.abort();
    }

    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setPatient(null);

    try {
      const data = await receptionService.searchPatient(
        identifier,
        token,
        controller.signal
      );
      setPatient(data);
    } catch (err) {
      if (err.name !== "AbortError") {
        toast.error(err.message || "Không tìm thấy bệnh nhân");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmCheckin = async (appointmentId) => {
    if (!patient?.PatientID) {
      toast.error("Dữ liệu bệnh nhân không hợp lệ");
      return;
    }

    if (!appointmentId) {
      toast.error("Thiếu thông tin lịch hẹn");
      return;
    }

    setLoading(true);

    try {
      await receptionService.createSession(
        patient.PatientID,
        appointmentId,
        token
      );

      toast.success("Tiếp nhận bệnh nhân thành công!");

      // reset UI
      setPatient(null);

    } catch (err) {
      toast.error(err.message || "Lỗi khi tạo phiên tiếp nhận");
    } finally {
      setLoading(false);
    }

  };

  return {
    patient,
    loading,
    handleSearch,
    handleConfirmCheckin
  };
};