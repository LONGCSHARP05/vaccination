const API_URL = 'http://localhost:8000/api/v1/dashboard/daily-overview';

export const dashboardService = {
    getDailyOverview: async (signal, params = {}, token = null) => {
        try {
            const { page = 1, limit = 10, search = '' } = params;

            const queryParams = new URLSearchParams({
                page,
                limit,
                search
            }).toString();

            const response = await fetch(`${API_URL}?${queryParams}`, {
                method: 'GET',
                signal,
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: `Bearer ${token}` })
                }
            });

            if (!response.ok) {
                throw new Error('Không thể tải dữ liệu Bảng điều khiển');
            }

            return await response.json();

        } catch (error) {
            if (error.name !== "AbortError") {
                console.error("Dashboard Service Error:", error);
            }
            throw error;
        }
    }
};