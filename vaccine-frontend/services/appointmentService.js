// File: services/appointmentService.js

// Dữ liệu giả (Mock Data)
const mockAppointments = [
  {
    id: "AP-001",
    patientName: "Nguyễn Văn An",
    phone: "0901234567",
    vaccine: "Vắc xin 6 trong 1 (Infanrix Hexa)",
    date: "2026-03-12",
    time: "08:30",
    status: "pending", // Chờ tiêm
  },
  {
    id: "AP-002",
    patientName: "Trần Thị Bích",
    phone: "0912345678",
    vaccine: "Vắc xin phế cầu (Synflorix)",
    date: "2026-03-12",
    time: "09:00",
    status: "completed", // Đã tiêm
  },
  {
    id: "AP-003",
    patientName: "Lê Hoàng Cường",
    phone: "0923456789",
    vaccine: "Vắc xin Cúm (Vaxigrip Tetra)",
    date: "2026-03-13",
    time: "14:00",
    status: "cancelled", // Đã hủy
  },
  {
    id: "AP-004",
    patientName: "Phạm Thị Dung",
    phone: "0934567890",
    vaccine: "Vắc xin Thủy đậu (Varivax)",
    date: "2026-03-14",
    time: "10:15",
    status: "pending",
  }
];

// Hàm giả lập gọi API lấy danh sách
export const getAppointments = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: mockAppointments });
    }, 1000); // Giả lập độ trễ mạng 1 giây
  });
};