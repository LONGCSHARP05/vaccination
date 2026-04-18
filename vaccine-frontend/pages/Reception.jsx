import React from "react";
import "../assets/reception.css";

const Reception = () => {
  return (
    <div className="app">
      
      {/* SIDEBAR */}
      <div className="sidebar">
        <div className="logo">
          <div className="logo-icon">+</div>
          <div>
            <h3>Anora Health</h3>
            <span>Vaccination Center</span>
          </div>
        </div>

        <button className="new-btn">+ New Patient</button>

        <ul className="menu">
          <li className="active">Reception</li>
          <li>Screening</li>
          <li>Indication</li>
          <li>Scheduling</li>
          <li>Injection</li>
          <li>Monitoring</li>
        </ul>

        <div className="bottom">
          <p>Support</p>
          <p className="logout">Logout</p>
        </div>
      </div>

      {/* MAIN */}
      <div className="main">

        {/* HEADER */}
        <div className="header">
          <div>
            <h2>Bảng điều khiển</h2>
            <p>Danh sách bệnh nhân đang chờ tiếp nhận</p>
          </div>

          <div className="header-right">
            <div className="role">Role: Administrator</div>
            <div className="icons">🔍 🔔 👤</div>
          </div>
        </div>

        {/* CARDS */}
        <div className="cards">
          <div className="card">
            <p>Đang chờ (RECEIVED)</p>
            <h3>12</h3>
          </div>

          <div className="card">
            <p>Đang khám</p>
            <h3>4</h3>
          </div>

          <div className="card qr">
            <p>Quét mã QR Bệnh nhân</p>
          </div>
        </div>

        {/* TABLE */}
        <div className="table">
          <div className="table-header">
            <h3>Danh sách chờ</h3>
            <button>Lọc</button>
          </div>

          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>TÊN BỆNH NHÂN</th>
                <th>THỜI GIAN CHECK-IN</th>
                <th>TRẠNG THÁI</th>
                <th>THAO TÁC</th>
              </tr>
            </thead>

            <tbody>
              {[
                { name: "Nguyễn Văn A", time: "08:15 AM" },
                { name: "Trần Thị B", time: "08:22 AM" },
                { name: "Lê Minh C", time: "08:45 AM" },
              ].map((p, i) => (
                <tr key={i}>
                  <td>0{i + 1}</td>
                  <td>
                    <div className="patient">
                      <div className="avatar">
                        {p.name.charAt(0)}
                      </div>
                      <div>
                        <strong>{p.name}</strong>
                        <p>BN-2023-089{i + 1}</p>
                      </div>
                    </div>
                  </td>
                  <td>{p.time}</td>
                  <td>
                    <span className="status">RECEIVED</span>
                  </td>
                  <td className="action">Xử lý</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="more">Xem thêm</div>
        </div>

      </div>
    </div>
  );
};

export default Reception;