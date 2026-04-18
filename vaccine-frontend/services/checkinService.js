const API_URL = 'http://localhost:8000/api/v1/patients/search-identifier/';

export const receptionService = {
    searchPatient: async (identifier, token, signal) => {
        try {
            const queryParams = new URLSearchParams({
                identifier: identifier.trim()
            }).toString();

            const response = await fetch(`${API_URL}?${queryParams}`, {
                method: 'GET',
                signal,
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: `Bearer ${token}` })
                }
            });

            if (response.status === 404) {
                return null; // không tìm thấy bệnh nhân
            }

            if (!response.ok) {
                throw new Error('Không thể tìm bệnh nhân');
            }

            return await response.json();

        } catch (error) {
            if (error.name !== "AbortError") {
                console.error("Check-in Service Error:", error);
            }
            throw error;
        }
    }
};