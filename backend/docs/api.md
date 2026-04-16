
---

## 1. **account (Authentication)**

* **POST** `/api/v1/auth/login` – Login
* **GET** `/api/v1/auth/me` – Lấy thông tin người dùng hiện tại
* **POST** `/api/v1/auth/register` – Đăng ký
* **POST** `/api/v1/auth/logout` – Logout
* **POST** `/api/v1/auth/refresh` – Refresh Access Token

---

## 2. **users**

* **GET** `/api/v1/users/me` – Lấy profile cá nhân
* **PUT** `/api/v1/users/me` – Cập nhật profile
* **PUT** `/api/v1/users/me/password` – Đổi mật khẩu
* **GET** `/api/v1/users/` – Danh sách users
* **POST** `/api/v1/users/` – Tạo user
* **GET** `/api/v1/users/{user_uuid}` – Lấy thông tin user
* **PATCH** `/api/v1/users/{user_uuid}/status` – Cập nhật trạng thái user

---

## 3. **roles**

* **GET** `/api/v1/roles/` – Danh sách role
* **POST** `/api/v1/roles/` – Tạo role
* **GET** `/api/v1/roles/{role_id}` – Lấy role
* **PATCH** `/api/v1/roles/{role_id}` – Cập nhật role
* **DELETE** `/api/v1/roles/{role_id}` – Xóa role
* **GET** `/api/v1/roles/{role_id}/permissions` – Lấy quyền của role
* **PUT** `/api/v1/roles/{role_id}/permissions` – Gán quyền cho role
* **GET** `/api/v1/roles/users/{user_uuid}/roles` – Lấy role của user
* **PUT** `/api/v1/roles/users/{user_uuid}/roles` – Cập nhật role cho user

---

## 4. **patients**

* **GET** `/api/v1/patients/` – Danh sách bệnh nhân
* **POST** `/api/v1/patients/` – Tạo bệnh nhân
* **GET** `/api/v1/patients/{patient_uuid}` – Cho tiết bệnh nhân
* **PUT** `/api/v1/patients/{patient_uuid}` – Cập nhật bệnh nhân
* **PATCH** `/api/v1/patients/{patient_uuid}/status` – Cập nhật trạng thái bệnh nhân
* **GET** `/api/v1/patients/{patient_uuid}/appointments` – Lịch hẹn của bệnh nhân
* **GET** `/api/v1/patients/{patient_uuid}/vaccinations` – Lịch sử tiêm

---

## 5. **facilities**

* **GET** `/api/v1/facilities/` – Danh sách cơ sở
* **POST** `/api/v1/facilities/` – Tạo cơ sở
* **GET** `/api/v1/facilities/{facility_uuid}` – Chi tiết cơ sở
* **PUT** `/api/v1/facilities/{facility_uuid}` – Cập nhật cơ sở
* **PATCH** `/api/v1/facilities/{facility_uuid}/status` – Cập nhật trạng thái
* **GET** `/api/v1/facilities/{facility_uuid}/inventory` – Tồn kho
* **GET** `/api/v1/facilities/{facility_uuid}/staff` – Nhân viên cơ sở

---

## 6. **staff-facility**

* **GET** `/api/v1/staff-facility/` – Danh sách staff–facility
* **POST** `/api/v1/staff-facility/` – Gán staff cho facility
* **PATCH** `/api/v1/staff-facility/{staff_facility_id}` – Cập nhật
* **GET** `/api/v1/staff-facility/staff/{staff_uuid}` – Cơ sở của staff

---

## 7. **vaccines**

* **GET** `/api/v1/vaccines/` – Danh sách vaccine
* **POST** `/api/v1/vaccines/` – Tạo vaccine
* **GET** `/api/v1/vaccines/{vaccine_uuid}` – Chi tiết vaccine
* **PUT** `/api/v1/vaccines/{vaccine_uuid}` – Cập nhật vaccine
* **PATCH** `/api/v1/vaccines/{vaccine_uuid}/status` – Cập nhật trạng thái

### Lots

* **GET** `/api/v1/vaccines/lots` – Danh sách lô
* **POST** `/api/v1/vaccines/lots` – Tạo lô
* **GET** `/api/v1/vaccines/lots/{lot_uuid}` – Chi tiết lô
* **PUT** `/api/v1/vaccines/lots/{lot_uuid}` – Cập nhật lô
* **PATCH** `/api/v1/vaccines/lots/{lot_uuid}/status` – Cập nhật trạng thái lô

### Sub-lots

* **GET** `/api/v1/vaccines/sub-lots` – Danh sách sub-lot
* **POST** `/api/v1/vaccines/sub-lots` – Tạo sub-lot
* **GET** `/api/v1/vaccines/sub-lots/{sub_lot_uuid}` – Chi tiết
* **PATCH** `/api/v1/vaccines/sub-lots/{sub_lot_uuid}` – Cập nhật

---

## 8. **appointments**

* **GET** `/api/v1/appointments/` – Danh sách lịch hẹn
* **POST** `/api/v1/appointments/` – Tạo lịch hẹn
* **GET** `/api/v1/appointments/{appointment_uuid}` – Chi tiết lịch hẹn
* **PUT** `/api/v1/appointments/{appointment_uuid}` – Cập nhật
* **PATCH** `/api/v1/appointments/{appointment_uuid}/status` – Cập nhật trạng thái
* **GET** `/api/v1/appointments/patient/{patient_uuid}` – Lịch hẹn theo bệnh nhân
* **GET** `/api/v1/appointments/facility/{facility_uuid}` – Lịch hẹn theo cơ sở

---

## 9. **vaccination-sessions**

* **GET** `/api/v1/vaccination-sessions/` – Danh sách buổi tiêm
* **POST** `/api/v1/vaccination-sessions/` – Tạo buổi tiêm
* **GET** `/api/v1/vaccination-sessions/{session_uuid}` – Chi tiết buổi tiêm
* **GET** `/api/v1/vaccination-sessions/patient/{patient_uuid}` – Lịch sử tiêm bệnh nhân
* **GET** `/api/v1/vaccination-sessions/facility/{facility_uuid}` – Lịch sử tiêm cơ sở
* **POST** `/api/v1/vaccination-sessions/{session_uuid}/details` – Tạo chi tiết tiêm
* **PATCH** `/api/v1/vaccination-sessions/details/{detail_uuid}` – Cập nhật chi tiết tiêm

---

## 10. **inventory**

* **GET** `/api/v1/inventory/summary` – Tổng hợp tồn kho
* **GET** `/api/v1/inventory/facility/{facility_uuid}` – Tồn kho theo cơ sở
* **POST** `/api/v1/inventory/transactions` – Tạo giao dịch kho
* **GET** `/api/v1/inventory/transactions` – Danh sách giao dịch

---

## 11. **inventory-audit-logs**

* **GET** `/api/v1/inventory/audit-logs` – Danh sách audit log
* **GET** `/api/v1/inventory/audit-logs/{audit_log_id}` – Chi tiết audit log

---

## 12. **adverse-reactions**

* **POST** `/api/v1/adverse-reactions/` – Tạo phản ứng phụ
* **GET** `/api/v1/adverse-reactions/` – Danh sách phản ứng phụ
* **GET** `/api/v1/adverse-reactions/{reaction_uuid}` – Chi tiết
* **GET** `/api/v1/adverse-reactions/patient/{patient_uuid}` – Theo bệnh nhân
* **GET** `/api/v1/adverse-reactions/vaccine/{vaccine_uuid}` – Theo vaccine

---

## 13. **system-logs**

* **GET** `/api/v1/system-logs/` – Danh sách log hệ thống
* **GET** `/api/v1/system-logs/{log_id}` – Chi tiết log

---

## 14. **reports**

* **GET** `/api/v1/reports/vaccination-coverage` – Báo cáo độ bao phủ tiêm
* **GET** `/api/v1/reports/inventory-status` – Báo cáo tồn kho
* **GET** `/api/v1/reports/adverse-reactions` – Báo cáo phản ứng phụ
* **GET** `/api/v1/reports/appointments-status` – Báo cáo lịch hẹn

---

## 15. **default**

* **GET** `/` – Root API

---
