import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import { useAuth } from "../hooks/useAuth";
import "../assets/login.css";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState("");
  
  const { registerUser, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError(""); // Xóa lỗi cũ trước khi submit

    // Kiểm tra mật khẩu khớp nhau ở phía Front-end
    if (password !== confirmPassword) {
      setValidationError("Mật khẩu xác nhận không khớp!");
      return;
    }

    // Gọi hàm registerUser từ hook useAuth
    const success = await registerUser(username, email, password);
    if (success) {
      // Nếu đăng ký thành công, chuyển hướng người dùng về trang đăng nhập
      navigate("/login");
    }
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <div className="login-page">
      {/* NỬA TRÁI - Lưới ảnh và Banner nhận diện thương hiệu */}
      <div className="login-left">
        <div className="photo-grid">
          <div className="photo-tile tile-1" aria-hidden="true" />
          <div className="photo-tile tile-2" aria-hidden="true" />
          <div className="photo-tile tile-3" aria-hidden="true" />
          <div className="photo-tile tile-4" aria-hidden="true" />
          <div className="photo-tile tile-5" aria-hidden="true" />
        </div>
        
        <div className="hero-card">
          <div className="hero-overlay">
            <div className="hero-text1">
              <div>Vì sức khỏe</div>
            </div>
            <div className="hero-text2">
              <div>gia đình</div>
              <div className="hero-text-strong">Việt</div>
            </div>
          </div>
        </div>
      </div>

      {/* NỬA PHẢI - Form Đăng ký */}
      <div className="login-right">
        <header className="brand-header">
          <h1 className="brand-title">Trung Tâm Tiêm Chủng</h1>
          <h2 className="brand-name">ANORA</h2>
          <p style={{ marginTop: '10px', color: '#666', fontSize: '18px' }}>Tạo tài khoản mới</p>
        </header>

        <form onSubmit={handleSubmit} className="login-form" noValidate>
          
          {/* Trường Họ và tên */}
          <div className="field-row">
            <span className="field-icon user" aria-hidden="true" />
            <div className="input-field">
              <label htmlFor="name-input">Tên đăng nhập</label>
              <InputField
                id="name-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nguyễn Văn A"
                required
              />
            </div>
          </div>

          {/* Trường Email */}
          <div className="field-row">
            <span className="field-icon email" aria-hidden="true" />
            <div className="input-field">
              <label htmlFor="email-input">Email</label>
              <InputField
                id="email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                required
                aria-invalid={(error || validationError) ? "true" : "false"}
              />
            </div>
          </div>

          {/* Trường Mật khẩu */}
          <div className="field-row">
            <span className="field-icon lock" aria-hidden="true" />
            <div className="input-field">
              <label htmlFor="password-input">Mật khẩu</label>
              <InputField
                id="password-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                aria-invalid={(error || validationError) ? "true" : "false"}
              />
            </div>
          </div>

          {/* Trường Xác nhận mật khẩu */}
          <div className="field-row">
            <span className="field-icon lock" aria-hidden="true" />
            <div className="input-field">
              <label htmlFor="confirm-password-input">Xác nhận mật khẩu</label>
              <InputField
                id="confirm-password-input"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                aria-invalid={(error || validationError) ? "true" : "false"}
              />
            </div>
          </div>

          {/* Hiển thị thông báo lỗi (từ state nội bộ hoặc từ API trả về) */}
          {(validationError || error) && (
            <div className="error-text" role="alert" aria-live="polite">
              {validationError || error}
            </div>
          )}

          {/* Nút bấm Submit và Điều hướng */}
          <button 
            type="submit" 
            className="btn-primary" 
            disabled={loading}
            aria-busy={loading}
            style={{ marginTop: '16px' }}
          >
            {loading ? "Đang xử lý..." : "Đăng ký tài khoản"}
          </button>
          
          <button 
            type="button" 
            className="btn-secondary"
            onClick={handleLoginRedirect}
            disabled={loading}
          >
            Đã có tài khoản? Đăng nhập ngay
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;