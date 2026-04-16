import PropTypes from "prop-types";
import "../assets/vaccine-table.css";

function VaccineTable({ vaccines, onSelectVaccine }) {
  return (
    <div className="vaccine-table-container">
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
            <tr key={vaccine.VaccineDetailID || vaccine.id}>
              <td>{vaccine.VaccineCode || "N/A"}</td>
              <td>{vaccine.VaccineName}</td>
              <td>{vaccine.Manufacturer || "N/A"}</td>
              <td>{vaccine.CountryOfOrigin || "N/A"}</td>
              <td style={{ textAlign: "center" }}>{vaccine.DosePerVial || "N/A"}</td>
              <td>
                <span className={`status ${vaccine.IsActive ? "active" : "inactive"}`}>
                  {vaccine.IsActive ? "Hoạt động" : "Không hoạt động"}
                </span>
              </td>
              <td>
                <button
                  className="view-details-btn"
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

VaccineTable.propTypes = {
  vaccines: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSelectVaccine: PropTypes.func.isRequired,
};

export default VaccineTable;