import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import VaccineList from "../components/VaccineList";
import VaccineModal from "../components/VaccineModal";
import { getAllVaccines } from "../services/vaccineService";
import "../assets/vaccine-search.css";

function VaccineSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [vaccines, setVaccines] = useState([]);
  const [filteredVaccines, setFilteredVaccines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVaccine, setSelectedVaccine] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const navigate = useNavigate();

  // Fetch all vaccines on component mount
  useEffect(() => {
    const fetchVaccines = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        
        // Allow access without token for public vaccine search
        const data = await getAllVaccines(token || "");
        setVaccines(data.data || data);
        setFilteredVaccines(data.data || data);
        setError(null);
      } catch (err) {
        setError("Failed to load vaccines: " + err.message);
        console.error("Error fetching vaccines:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVaccines();
  }, []);

  // Handle search input change
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (!query.trim()) {
      setFilteredVaccines(vaccines);
      return;
    }

    const filtered = vaccines.filter(
      (vaccine) =>
        vaccine.VaccineName?.toLowerCase().includes(query) ||
        vaccine.VaccineCode?.toLowerCase().includes(query) ||
        vaccine.Manufacturer?.toLowerCase().includes(query)
    );

    setFilteredVaccines(filtered);
  };

  // Handle vaccine selection to view details
  const handleSelectVaccine = (vaccine) => {
    setSelectedVaccine(vaccine);
  };

  // Handle back from details
  const handleBack = () => {
    setSelectedVaccine(null);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="vaccine-search-page">
        <header className="vaccine-header">
          <h1>Tra cứu Vaccine</h1>
          <button className="logout-btn" onClick={handleLogout}>
            Đăng xuất
          </button>
        </header>
        <div className="loading-container">
          <p>Đang tải dữ liệu vaccine...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="vaccine-search-page">
      <header className="vaccine-header">
        <h1>Tra cứu Vaccine</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Đăng xuất
        </button>
      </header>

      <div className="search-container">
        <div className="search-box">
          <InputField
            type="text"
            placeholder="Tìm kiếm theo tên vaccine, mã hoặc nhà sản xuất..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        {/* Toggle View Button Group */}
        <div className="view-toggle-container">
          <div className="view-toggle-group">
            <button
              className={`toggle-btn ${viewMode === "table" ? "active" : ""}`}
              onClick={() => setViewMode("table")}
              title="Xem bảng"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 3v18M3 12h18M3 6h18M3 18h18" />
              </svg>
              <span>Bảng</span>
            </button>
            <button
              className={`toggle-btn ${viewMode === "grid" ? "active" : ""}`}
              onClick={() => setViewMode("grid")}
              title="Xem lưới"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
              <span>Lưới</span>
            </button>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {filteredVaccines.length === 0 ? (
          <div className="no-results">
            <p>
              {searchQuery
                ? "Không tìm thấy vaccine phù hợp"
                : "Chưa có vaccine nào"}
            </p>
          </div>
        ) : (
          <div className="results-container">
            <p className="results-count">
              Tìm thấy {filteredVaccines.length} vaccine
            </p>
            <VaccineList
              vaccines={filteredVaccines}
              onSelectVaccine={handleSelectVaccine}
              viewMode={viewMode}
            />
          </div>
        )}
      </div>

      {/* Vaccine Details Modal */}
      <VaccineModal vaccine={selectedVaccine} onClose={handleBack} />
    </div>
  );
}

export default VaccineSearch;
