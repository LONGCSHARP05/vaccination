import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import { useAuth } from "../hooks/useAuth";
import AuthLayout from "../layouts/AuthLayout";
import "../assets/login.css";

function Login() {
  const [useridentifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const { loginUser, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await loginUser(useridentifier, password);
    if (success) 
      if (rememberMe) {
      localStorage.setItem("rememberedEmail", useridentifier);
    } else {
      localStorage.removeItem("rememberedEmail");
    }

    navigate("/vaccines");
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <div className="login-page">
      {/* LEFT SIDE - Photo Grid & Hero Card */}
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

      {/* RIGHT SIDE - Login Form */}
      <div className="login-right">
        <header className="brand-header">
          <h1 className="brand-title">Trung Tâm Tiêm Chủng</h1>
          <h2 className="brand-name">ANORA</h2>
        </header>


        {/* Login Form */}
        <form onSubmit={handleSubmit} className="login-form" noValidate>
          {/* Email Field */}
          <div className="field-row">
            <span className="field-icon email" aria-hidden="true" />
            <div className="input-field">
              <label htmlFor="email-input">Email</label>
              <InputField
                id="email-input"
                type="email"
                value={useridentifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="example@email.com"
                required
                aria-required="true"
                aria-invalid={error ? "true" : "false"}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="field-row">
            <span className="field-icon lock" aria-hidden="true" />
            <div className="input-field">
              <label htmlFor="password-input">Nhập mật khẩu</label>
              <InputField
                id="password-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                aria-required="true"
                aria-invalid={error ? "true" : "false"}
              />
            </div>
          </div>

          {/* Remember & Forgot Password */}
          <div className="options-row">
            <label className="remember">
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                aria-label="Nhớ email hoặc tên đăng nhập"
              />
              <span>Nhớ email hoặc tên đăng nhập</span>
            </label>
            <button 
              type="button" 
              className="forgot"
              onClick={handleForgotPassword}
            >
              Quên mật khẩu?
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-text" role="alert" aria-live="polite">
              {error}
            </div>
          )}

          {/* Submit Buttons */}
          <button 
            type="submit" 
            className="btn-primary" 
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
          
          <button 
            type="button" 
            className="btn-secondary"
            onClick={handleRegister}
            disabled={loading}
          >
            Đăng ký
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
