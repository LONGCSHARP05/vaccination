import { PropTypes } from "prop-types";
import "../assets/vaccine-list.css";

function VaccineList({ vaccines, onSelectVaccine, viewMode = "grid" }) {
  if (viewMode === "table") {
    return (
      <div className="vaccine-table-wrapper">
        <table className="vaccine-table">
          <thead>
            <tr>
              <th>Mã</th>
              <th>Tên Vaccine</th>
              <th>Nhà Sản Xuất</th>
              <th>Quốc gia</th>
              <th>Liều/Lọ</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {vaccines.map((vaccine) => (
              <tr key={vaccine.VaccineDetailID || vaccine.id} className="vaccine-row">
                <td>{vaccine.VaccineCode || "-"}</td>
                <td>{vaccine.VaccineName}</td>
                <td>{vaccine.Manufacturer || "-"}</td>
                <td>{vaccine.CountryOfOrigin || "-"}</td>
                <td>{vaccine.DosePerVial || "-"}</td>
                <td>
                  <span className={`status-badge ${vaccine.IsActive ? "active" : "inactive"}`}>
                    {vaccine.IsActive ? "Hoạt động" : "Không hoạt động"}
                  </span>
                </td>
                <td>
                  <button
                    className="action-btn"
                    onClick={() => onSelectVaccine(vaccine)}
                  >
                    Xem chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Grid view (default)
  return (
    <div className="vaccine-list">
      {vaccines.map((vaccine) => (
        <div
          key={vaccine.VaccineDetailID || vaccine.id}
          className="vaccine-card"
          onClick={() => onSelectVaccine(vaccine)}
        >
          <div className="vaccine-card-header">
            <h3 className="vaccine-name">{vaccine.VaccineName}</h3>
            <span className={`status-badge ${vaccine.IsActive ? "active" : "inactive"}`}>
              {vaccine.IsActive ? "Hoạt động" : "Không hoạt động"}
            </span>
          </div>

          <div className="vaccine-card-body">
            {vaccine.VaccineCode && (
              <div className="vaccine-info">
                <span className="label">Mã:</span>
                <span className="value">{vaccine.VaccineCode}</span>
              </div>
            )}

            {vaccine.Manufacturer && (
              <div className="vaccine-info">
                <span className="label">NSX:</span>
                <span className="value">{vaccine.Manufacturer}</span>
              </div>
            )}

            {vaccine.CountryOfOrigin && (
              <div className="vaccine-info">
                <span className="label">Quốc gia:</span>
                <span className="value">{vaccine.CountryOfOrigin}</span>
              </div>
            )}

            {vaccine.DosePerVial && (
              <div className="vaccine-info">
                <span className="label">Liều/Lọ:</span>
                <span className="value">{vaccine.DosePerVial}</span>
              </div>
            )}

            {vaccine.Description && (
              <div className="vaccine-description">
                {vaccine.Description.substring(0, 100)}
                {vaccine.Description.length > 100 ? "..." : ""}
              </div>
            )}
          </div>

          <div className="vaccine-card-footer">
            <button className="view-details-btn">Xem chi tiết</button>
          </div>
        </div>
      ))}
    </div>
  );
}

VaccineList.propTypes = {
  vaccines: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSelectVaccine: PropTypes.func.isRequired,
  viewMode: PropTypes.oneOf(["table", "grid"]),
};

export default VaccineList;
