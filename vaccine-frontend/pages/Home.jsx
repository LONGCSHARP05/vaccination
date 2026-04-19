import { useNavigate } from "react-router-dom";
import { removeToken } from "../utils/storage";
import "../assets/home.css";

function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    navigate("/login");
  };

  const handleNavigateVaccines = () => {
    navigate("/vaccines");
  };

  const handleNavigateWaiting = () => {
    navigate("/waiting-for-injection");
  };

  return (
    <div className="home-page">
      <header className="home-header">
        <div className="header-content">
          <h1 className="app-title">Trung Tâm Tiêm Chủng ANORA</h1>
          <button className="logout-btn" onClick={handleLogout}>
            Đăng xuất
          </button>
        </div>
      </header>

      <div className="home-container">
        <div className="welcome-section">
          <h2>Chào mừng đến hệ thống quản lý tiêm chủng</h2>
          <p>
            Hệ thống quản lý tiêm chủng toàn diện, giúp bạn dễ dàng tra cứu
            thông tin vaccine, quản lý lịch tiêm chủng và theo dõi tình trạng
            sức khỏe.
          </p>
        </div>

        <div className="menu-grid">
          <div className="menu-card" onClick={handleNavigateVaccines}>
            <div className="card-icon">🔍</div>
            <h3>Tra cứu Vaccine</h3>
            <p>Tìm kiếm thông tin chi tiết về các loại vaccine</p>
            <button className="card-btn">Vào trang</button>
          </div>

          <div className="menu-card" onClick={handleNavigateWaiting}>
            <div className="card-icon">💉</div>
            <h3>Chờ tiêm</h3>
            <p>Quản lý danh sách bệnh nhân đang chờ tiêm</p>
            <button className="card-btn">Vào trang</button>
          </div>

          <div className="menu-card disabled">
            <div className="card-icon">👥</div>
            <h3>Quản lý bệnh nhân</h3>
            <p>Quản lý thông tin và hồ sơ tiêm chủng bệnh nhân</p>
            <button className="card-btn" disabled>
              Sắp ra mắt
            </button>
          </div>

          <div className="menu-card disabled">
            <div className="card-icon">📊</div>
            <h3>Báo cáo</h3>
            <p>Xem các báo cáo thống kê về tiêm chủng</p>
            <button className="card-btn" disabled>
              Sắp ra mắt
            </button>
          </div>
        </div>

        <div className="features-section">
          <h2>Tính năng chính</h2>
          <div className="features-list">
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>Tra cứu nhanh chóng thông tin vaccine</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>Quản lý lịch tiêm chủng dễ dàng</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>Cập nhật thông tin vaccine mới nhất</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>Báo cáo và thống kê chi tiết</span>
            </div>
          </div>
        </div>
      </div>

      <footer className="home-footer">
        <p>&copy; 2026 Trung Tâm Tiêm Chủng ANORA. Bảo vệ sức khỏe cộng đồng.</p>
      </footer>
    </div>
  );
}

export default Home;
