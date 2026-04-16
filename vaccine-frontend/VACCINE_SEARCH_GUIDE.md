# Hướng dẫn: Chức năng Tra cứu Vaccine

## Tổng quan

Chức năng tra cứu vaccine cho phép người dùng tìm kiếm, xem danh sách và xem chi tiết thông tin về các loại vaccine trong hệ thống.

## Cấu trúc tệp tin

```
vaccine-frontend-repo/
├── pages/
│   ├── VaccineSearch.jsx       # Trang chính tra cứu vaccine
│   ├── Home.jsx                # Trang dashboard
│   └── Login.jsx               # Trang đăng nhập
├── components/
│   ├── VaccineList.jsx         # Component hiển thị danh sách vaccine
│   └── InputField.jsx          # Component input field tái sử dụng
├── services/
│   ├── vaccineService.js       # Service gọi API vaccine
│   ├── authService.js          # Service xử lý đăng nhập
├── assets/
│   ├── vaccine-search.css      # Styles trang tra cứu
│   ├── vaccine-list.css        # Styles component danh sách
│   └── home.css                # Styles trang home
├── routes/
│   └── AppRoutes.jsx           # Router ứng dụng
└── utils/
    └── storage.js              # Utility lưu token
```

## Các component và chức năng

### 1. VaccineSearch Page (`pages/VaccineSearch.jsx`)

**Chức năng chính:**
- Tải danh sách tất cả vaccine khi component mount
- Tìm kiếm vaccine theo tên, mã hoặc nhà sản xuất
- Hiển thị chi tiết vaccine khi click vào một vaccine
- Quản lý trạng thái loading, error, và dữ liệu

**State:**
```javascript
const [searchQuery, setSearchQuery] = useState("");
const [vaccines, setVaccines] = useState([]);
const [filteredVaccines, setFilteredVaccines] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [selectedVaccine, setSelectedVaccine] = useState(null);
```

**Quy trình:**
1. Khi component mount, fetch dữ liệu vaccine từ API
2. Hiển thị danh sách vaccine bằng component VaccineList
3. Khi user nhập query tìm kiếm, filter danh sách vaccine client-side
4. Khi user click vào vaccine, hiển thị chi tiết vaccine

### 2. VaccineList Component (`components/VaccineList.jsx`)

**Props:**
- `vaccines`: mảng các object vaccine
- `onSelectVaccine`: callback khi user click vào vaccine

**Hiển thị:**
- Card cho mỗi vaccine
- Hiển thị: Tên, Mã, NSX, Quốc gia, Liều/Lọ, Trạng thái
- Button "Xem chi tiết"

### 3. InputField Component (`components/InputField.jsx`)

**Props:**
- `label` (optional): nhãn input
- `type` (default: "text"): loại input
- `value`: giá trị input
- `onChange`: callback khi input change
- `className` (default: ""): CSS class thêm
- `...rest`: các props khác (placeholder, required, etc.)

### 4. Home Page (`pages/Home.jsx`)

**Chức năng:**
- Trang dashboard chào mừng
- Menu các chức năng: Tra cứu vaccine (hoạt động), Lịch tiêm chủng, Quản lý bệnh nhân, Báo cáo (sắp ra mắt)
- Liệt kê các tính năng chính
- Nút đăng xuất

## API Services

### `vaccineService.js`

**Hàm có sẵn:**

```javascript
// Fetch tất cả vaccine
getAllVaccines(token) -> Promise<data>

// Tìm kiếm vaccine (phía server)
searchVaccines(query, token) -> Promise<data>

// Lấy chi tiết vaccine theo ID
getVaccineById(vaccineId, token) -> Promise<data>

// Lấy danh sách lô/batch của vaccine
getVaccineLots(vaccineId, token) -> Promise<data>
```

**Base URL:** `http://localhost:8000/api/v1/vaccines`

## Routes

Các route được định nghĩa trong `routes/AppRoutes.jsx`:

| Route | Component | Yêu cầu | Mô tả |
|-------|-----------|---------|-------|
| `/` | Auto-redirect | - | Tự động điều hướng |
| `/login` | Login | - | Trang đăng nhập |
| `/dashboard` | Home | Token | Trang chủ dashboard |
| `/vaccines` | VaccineSearch | Token | Trang tra cứu vaccine |

## Protected Routes

Các route `/dashboard` và `/vaccines` được bảo vệ bằng component `ProtectedRoute`. Nếu user không có token, sẽ bị redirect về `/login`.

## Token Management

- Token được lưu trong `localStorage` khi user đăng nhập thành công
- Token được gửi trong header `Authorization: Bearer <token>` với mỗi API request
- Utility `saveToken()`, `getToken()`, `removeToken()` được dùng để quản lý token

## Styling

### CSS Frameworks & Approach
- Pure CSS (không dùng CSS framework)
- Responsive design (mobile-first)
- Gradient backgrounds
- Flexbox & CSS Grid

### Các file CSS chính:
- `login.css`: Style trang login
- `home.css`: Style trang home/dashboard
- `vaccine-search.css`: Style trang tra cứu vaccine
- `vaccine-list.css`: Style component danh sách vaccine

### Responsive Breakpoints:
- Desktop: 1200px+
- Tablet: 768px - 1199px
- Mobile: < 768px
- Small mobile: < 480px

## Cài đặt và chạy ứng dụng

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Chạy development server

```bash
npm run dev
```

Ứng dụng sẽ chạy trên `http://localhost:5173` (Vite default)

### 3. Build production

```bash
npm run build
```

## Quy trình sử dụng

1. **Đăng nhập**
   - Truy cập `/login`
   - Nhập email/tên đăng nhập và mật khẩu
   - Click nút "Đăng nhập"

2. **Dashboard**
   - Sau khi login thành công, được chuyển hướng tới `/dashboard`
   - Xem các menu chức năng
   - Click "Tra cứu Vaccine" để vào trang tra cứu

3. **Tra cứu Vaccine**
   - Nhập từ khóa tìm kiếm (tên, mã hoặc nhà sản xuất)
   - Danh sách sẽ được filter theo từ khóa
   - Click "Xem chi tiết" trên một vaccine để xem thông tin đầy đủ
   - Click "Quay lại" để trở về danh sách

## Tích hợp với Backend

### Yêu cầu API Backend

Backend cần cung cấp endpoint:
- `GET /api/v1/vaccines` - Lấy danh sách tất cả vaccine
- `GET /api/v1/vaccines?q=<query>` - Tìm kiếm vaccine (optional)
- `GET /api/v1/vaccines/<id>` - Lấy chi tiết vaccine

### Định dạng Response

```javascript
{
  "data": [
    {
      "VaccineDetailID": 1,
      "VaccineCode": "V001",
      "VaccineName": "Vaccine A",
      "Manufacturer": "Nhà sản xuất X",
      "CountryOfOrigin": "Việt Nam",
      "DosePerVial": 10,
      "Description": "Mô tả vaccine",
      "IsActive": true
    }
    // ... more vaccines
  ]
}
```

## Troubleshooting

### Frontend không kết nối được với Backend
- Kiểm tra Backend đang chạy trên `http://localhost:8000`
- Kiểm tra CORS configuration trên Backend
- Kiểm tra API endpoint có đúng không

### Token hết hạn
- Token phía client sẽ bị xóa khi logout
- Nếu API trả về 401 Unauthorized, user sẽ bị redirect về login

### Vaccine list trống
- Kiểm tra Backend có dữ liệu vaccine không
- Kiểm tra API endpoint có hoạt động không (thử trực tiếp trên Postman)

## Mở rộng tính năng

### Thêm chức năng lọc nâng cao
```javascript
// Lọc theo nhà sản xuất, quốc gia, etc.
const [filters, setFilters] = useState({
  manufacturer: "",
  country: "",
  isActive: true
});
```

### Phân trang (Pagination)
```javascript
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 10;
const totalPages = Math.ceil(vaccines.length / itemsPerPage);
```

### Hiển thị lô vaccine (Lots)
```javascript
const [vaccineLots, setVaccineLots] = useState([]);
const fetchLots = async (vaccineId) => {
  const lots = await getVaccineLots(vaccineId, token);
  setVaccineLots(lots);
};
```

## Performance Optimization

Hiện tại không sử dụng:
- React.memo (vì component không quá phức tạp)
- useMemo/useCallback (tìm kiếm client-side đơn giản)
- Code splitting (ứng dụng nhỏ)

Có thể thêm nếu cần:
```javascript
// Memoize component VaccineList khi danh sách lớn
const VaccineListMemo = React.memo(VaccineList);

// Debounce search
const debouncedSearch = useCallback(
  debounce((query) => handleSearch(query), 300),
  []
);
```

## Tài liệu liên quan

- [React Documentation](https://react.dev)
- [React Router Documentation](https://reactrouter.com)
- [Axios Documentation](https://axios-http.com)
- [Vite Documentation](https://vitejs.dev)

---

**Author:** Vaccine Management System Team
**Last Updated:** March 2026
