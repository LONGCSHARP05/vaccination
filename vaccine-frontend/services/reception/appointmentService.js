import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api/v1/reception/appointments/'; // Hoặc đường dẫn tương ứng của bạn

export const appointmentService = {
  fetchList: async (params = {}, signal) => {
    try {
      // Lấy các tham số từ UI
      const { page = 1, limit = 10, search = '', date = '' } = params;
      
      // Chuyển đổi page thành skip cho Backend
      const skip = (page - 1) * limit;

      const res = await axios.get(BASE_URL, {
        params: {
          skip,
          limit,
          identifier: search, // Map 'search' của frontend thành 'identifier' của backend
          date: date || undefined // Gửi undefined nếu chuỗi rỗng để Backend không bị lỗi parse date
        },
        signal
      });

      return {
        data: res.data?.data || [],
        total: res.data?.total || 0
      };

    } catch (error) {
      if (error.name !== 'CanceledError') {
        console.error('Appointment Service Error:', error);
      }
      throw error;
    }
  }
};

export default appointmentService;