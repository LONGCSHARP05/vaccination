import { useState } from "react";
import { login, register } from "../services/authService";
import { saveToken } from "../utils/storage";

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loginUser = async (identifier, password) => {
    try {
      setLoading(true);
      setError(null);

      const data = await login(identifier, password);
      saveToken(data.token);

      return true;
    } catch (err) {
      console.error(err);
      
      setError("Sai tài khoản hoặc mật khẩu");
      return false;
    } finally {
      setLoading(false);
    }
  };
const registerUser = async (username, email, password) => {
    try {
      setLoading(true);
      setError(null);

      await register(username, email, password);
      
      // Nếu API không quăng lỗi (catch) thì tức là đăng ký thành công
      return true; 
    } catch (err) {
      console.error(err);
      // Bắt lỗi từ Backend trả về (nếu có), hoặc báo lỗi chung
      setError(err.response?.data?.message || "Đăng ký thất bại, email có thể đã tồn tại.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loginUser,
    registerUser, // BỔ SUNG: Export hàm này ra
    loading,
    error
  };
}
