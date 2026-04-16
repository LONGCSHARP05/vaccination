import { PropTypes } from "prop-types";
import "../assets/vaccine-modal.css";

function VaccineModal({ vaccine, onClose }) {
  if (!vaccine) return null;

  return (
    <>
      {/* Overlay/Backdrop */}
      <div className="modal-overlay" onClick={onClose}></div>

      {/* Modal Content */}
      <div className="vaccine-modal">
        <div className="modal-header">
          <h2>{vaccine.VaccineName}</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="detail-row">
            <label>Mã Vaccine:</label>
            <span>{vaccine.VaccineCode || "N/A"}</span>
          </div>
          <div className="detail-row">
            <label>Nhà sản xuất:</label>
            <span>{vaccine.Manufacturer || "N/A"}</span>
          </div>
          <div className="detail-row">
            <label>Quốc gia:</label>
            <span>{vaccine.CountryOfOrigin || "N/A"}</span>
          </div>
          <div className="detail-row">
            <label>Liều/Lọ:</label>
            <span>{vaccine.DosePerVial || "N/A"}</span>
          </div>
          <div className="detail-row">
            <label>Trạng thái:</label>
            <span className={`status ${vaccine.IsActive ? "active" : "inactive"}`}>
              {vaccine.IsActive ? "Hoạt động" : "Không hoạt động"}
            </span>
          </div>
          <div className="detail-row full-width">
            <label>Mô tả:</label>
            <p className="description">
              {vaccine.Description || "Không có mô tả"}
            </p>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-close" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </>
  );
}

VaccineModal.propTypes = {
  vaccine: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};

export default VaccineModal;
