import { useState } from "react";
import { login } from "../services/authService";
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

 

  return {
    loginUser,
    loading,
    error
  };
}
