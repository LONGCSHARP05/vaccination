import axios from 'axios';

const API_BASE = '/api/reception';

const fetchData = async (tab, params, signal) => {
  try {
    const response = await axios.get(`${API_BASE}/${tab}`, {
      params: {
        page: params.page,
        limit: params.limit,
        search: params.search || '',
        status: params.status || '',
        date: params.date || ''
      },
      signal
    });

    return {
      data: response.data?.data || [],
      total: response.data?.total || 0
    };

  } catch (error) {
    if (axios.isCancel(error)) {
      throw error;
    }

    console.error('Reception API error:', error);

    return {
      data: [],
      total: 0,
      error: true
    };
  }
};

const receptionService = {
  fetchData
};

export default receptionService;