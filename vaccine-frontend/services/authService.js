import axios from "axios";

const API_URL = "http://localhost:8000/api/v1/auth";

export const login = async (identifier, password) => {
  const response = await axios.post(`${API_URL}/login`, {
    identifier,
    password
  });
  return response.data;
};

// BỔ SUNG THÊM: Hàm đăng ký
export const register = async (username, email, password) => {
  const response = await axios.post(`${API_URL}/register`, {
    username,
    email,
    password
  });
  return response.data;
};