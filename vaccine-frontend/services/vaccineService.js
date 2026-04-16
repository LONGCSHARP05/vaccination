import axios from "axios";
import { mockVaccineData, mockVaccineLots } from "./mockData";

const API_URL = "http://localhost:8000/api/v1/vaccines";
const USE_MOCK_DATA = true; // Set to true to use mock data instead of API

// Fetch all vaccines
export const getAllVaccines = async (token) => {
  if (USE_MOCK_DATA) {
    return {
      success: true,
      data: mockVaccineData,
    };
  }

  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.warn("API error, falling back to mock data");
    return {
      success: true,
      data: mockVaccineData,
    };
  }
};

// Search vaccines by name or code
export const searchVaccines = async (query, token) => {
  if (USE_MOCK_DATA) {
    const filtered = mockVaccineData.filter(
      (vaccine) =>
        vaccine.VaccineName?.toLowerCase().includes(query.toLowerCase()) ||
        vaccine.VaccineCode?.toLowerCase().includes(query.toLowerCase()) ||
        vaccine.Manufacturer?.toLowerCase().includes(query.toLowerCase())
    );
    return {
      success: true,
      data: filtered,
    };
  }

  try {
    const response = await axios.get(`${API_URL}/search`, {
      params: { q: query },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.warn("API error, falling back to mock data");
    const filtered = mockVaccineData.filter(
      (vaccine) =>
        vaccine.VaccineName?.toLowerCase().includes(query.toLowerCase()) ||
        vaccine.VaccineCode?.toLowerCase().includes(query.toLowerCase()) ||
        vaccine.Manufacturer?.toLowerCase().includes(query.toLowerCase())
    );
    return {
      success: true,
      data: filtered,
    };
  }
};

// Get vaccine details by ID
export const getVaccineById = async (vaccineId, token) => {
  if (USE_MOCK_DATA) {
    const vaccine = mockVaccineData.find((v) => v.VaccineDetailID === vaccineId);
    if (!vaccine) {
      throw new Error("Vaccine not found");
    }
    return {
      success: true,
      data: vaccine,
    };
  }

  try {
    const response = await axios.get(`${API_URL}/${vaccineId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.warn("API error, falling back to mock data");
    const vaccine = mockVaccineData.find((v) => v.VaccineDetailID === vaccineId);
    if (!vaccine) {
      throw new Error("Vaccine not found");
    }
    return {
      success: true,
      data: vaccine,
    };
  }
};

// Get vaccine lots/batches
export const getVaccineLots = async (vaccineId, token) => {
  if (USE_MOCK_DATA) {
    const lots = mockVaccineLots.filter((lot) => lot.VaccineDetailID === vaccineId);
    return {
      success: true,
      data: lots,
    };
  }

  try {
    const response = await axios.get(`${API_URL}/${vaccineId}/lots`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.warn("API error, falling back to mock data");
    const lots = mockVaccineLots.filter((lot) => lot.VaccineDetailID === vaccineId);
    return {
      success: true,
      data: lots,
    };
  }
};
