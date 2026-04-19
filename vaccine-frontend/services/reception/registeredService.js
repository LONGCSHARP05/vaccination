import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api/v1/reception/patient_registered/'; // Đảm bảo URL này khớp với Router backend của bạn

export const registeredService = {
  fetchList: async (params = {}, signal) => {
    try {
      // Lấy các tham số từ UI
      const { page = 1, limit = 10, search = '', status = '' } = params;
      
      // Chuyển đổi page thành skip cho Backend
      const skip = (page - 1) * limit;

      const res = await axios.get(BASE_URL, {
        params: {
          skip,
          limit,
          identifier: search, // Map 'search' của frontend thành 'identifier' của backend
          status: status || undefined 
        },
        signal
      });

      return {
        data: res.data?.data || [],
        total: res.data?.total || 0
      };

    } catch (error) {
      if (error.name !== 'CanceledError') {
        console.error('Registered Service Error:', error);
      }
      throw error;
    }
  }
};

export default registeredService;