import axios from "axios";
import { getToken } from "../utils/storage";

const API_URL = "http://localhost:8000/api/v1/patients";

// Helper function để lấy config có chứa token
const getAuthConfig = () => {
  const token = getToken();
  return {
    headers: { Authorization: `Bearer ${token}` }
  };
};

// CRUD Hồ sơ
export const getPatients = async () => {
  const response = await axios.get(API_URL, getAuthConfig());
  return response.data;
};

export const createPatient = async (patientData) => {
  const response = await axios.post(API_URL, patientData, getAuthConfig());
  return response.data;
};

export const updatePatient = async (id, patientData) => {
  const response = await axios.put(`${API_URL}/${id}`, patientData, getAuthConfig());
  return response.data;
};

export const deletePatient = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getAuthConfig());
  return response.data;
};

// Lấy lịch sử tiêm của một bệnh nhân
export const getVaccineHistory = async (patientId) => {
  const response = await axios.get(`${API_URL}/${patientId}/history`, getAuthConfig());
  return response.data;
};