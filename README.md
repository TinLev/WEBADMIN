# Urban Admin - Hệ thống quản lý sự cố

Ứng dụng web admin React cho quản lý các sự cố thành phố.

## Tính năng

- ✅ **Đăng nhập/Đăng xuất** - Xác thực người dùng
- ✅ **Dashboard tổng quan** - Thống kê các sự cố
- ✅ **Danh sách sự cố** - Hiển thị tất cả các sự cố với lọc và tìm kiếm
- ✅ **Xem chi tiết sự cố** - Thông tin chi tiết của từng sự cố
- ✅ **Cập nhật trạng thái xử lý** - Thay đổi trạng thái từ Chờ xử lý → Đang xử lý → Đã giải quyết
- ✅ **Bản đồ hiển thị vị trí** - Hiển thị vị trí sự cố trên bản đồ OpenStreetMap

## Công nghệ sử dụng

- **React 18** - UI library
- **React Router** - Routing
- **React Leaflet** - Map integration
- **TypeScript** - Type safety
- **Vite** - Build tool
- **CSS3** - Styling

## Cài đặt

1. Cài đặt dependencies:
```bash
npm install
```

2. Chạy development server:
```bash
npm run dev
```

3. Xây dựng cho production:
```bash
npm run build
```

## Demo Login

- **Tên đăng nhập**: Bất kỳ cái nào
- **Mật khẩu**: Bất kỳ cái nào (tối thiểu 6 ký tự)

Ví dụ:
- Username: `admin`
- Password: `123456`

## Cấu trúc dự án

```
src/
├── pages/              # Các trang chính
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── IncidentList.tsx
│   └── IncidentDetail.tsx
├── components/         # UI components
│   ├── Layout.tsx
│   └── ProtectedRoute.tsx
├── context/           # React Context
│   └── AuthContext.tsx
├── App.tsx           # Main App component
└── index.css         # Global styles
```

## Routes

- `/login` - Trang đăng nhập
- `/dashboard` - Bảng điều khiển tổng quan
- `/incidents` - Danh sách sự cố
- `/incidents/:id` - Chi tiết sự cố

## Tính năng nổi bật

### Đăng nhập
- Xác thực người dùng đơn giản
- Lưu trạng thái người dùng vào localStorage
- Redirect tự động tới dashboard sau đăng nhập

### Dashboard
- Hiển thị số lượng sự cố theo trạng thái
- Bảng sự cố gần đây
- Thống kê trực quan

### Danh sách sự cố
- Lọc theo trạng thái
- Tìm kiếm theo tiêu đề hoặc địa điểm
- Hiển thị priority levels
- Link tới chi tiết sự cố

### Chi tiết sự cố
- Bản đồ tương tác hiển thị vị trí
- Cập nhật trạng thái xử lý
- Thêm ghi chú/nhận xét
- Hiệu quả quản lý sự cố

## Ghi chú

- Dữ liệu hiện tại là mock data. Để kết nối với API thực, thay đổi các hàm fetch trong các component.
- Map sử dụng OpenStreetMap (miễn phí, không cần API key)
- Authentication là basic demo. Trong production, nên sử dụng JWT hoặc OAuth.
