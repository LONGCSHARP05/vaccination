import axios from 'axios';
const BASE_URL = 'http://localhost:8000/api/v1';

export const patientService = {
  fetchList: async (params, signal) => {
    const { page = 1, limit = 10, search = '' } = params;
    const skip = (page - 1) * limit; // Chuyển page sang skip cho Backend
    
    const res = await axios.get(`${BASE_URL}/reception/patient_list/`, {
      params: { skip, limit, identifier: search }, // Map search -> identifier
      signal
    });
    return res.data; // Axios trả về data trực tiếp
  },

  // Thêm vào trong object service của bạn
  registerPatient: async (patientId, token) => {
  try {
    const res = await axios.post(`${BASE_URL}/vaccination-sessions/register-session`, null, {
      params: { 
        patient_id: patientId 
      },
      headers: { 
        // BẮT BUỘC phải có dòng này để Backend biết bạn là ai
        Authorization: `Bearer ${token}` 
      }
    });
    return res.data;
  } catch (error) {
    throw error.response?.data?.detail || "Lỗi khi tiếp nhận bệnh nhân";
  }
}

};


export default patientService;