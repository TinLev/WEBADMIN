# Hệ thống Phân quyền Urban Admin

## Giới thiệu

Urban Admin sử dụng hệ thống phân quyền dựa trên 3 vai trò (Role-Based Access Control - RBAC):

1. **Giám sát (Supervisor)** - 👨‍💼
2. **Điều phối (Coordinator)** - 📋  
3. **Người đi xử lý (Handler)** - 🔧

Mỗi vai trò có những quyền hạn khác nhau trong hệ thống.

---

## Chi tiết vai trò và quyền hạn

### 1. Giám sát (Supervisor) - Full Quyền 🟢

**Mô tả:** Quản lý viên hệ thống, có toàn quyền truy cập và quản lý

**Quyền hạn:**
- ✅ Xem danh sách sự cố
- ✅ Tạo sự cố mới
- ✅ Chỉnh sửa thông tin sự cố
- ✅ Xóa sự cố
- ✅ Cập nhật trạng thái xử lý
- ✅ Gán/Hủy gán người xử lý
- ✅ Thêm ghi chú/nhận xét
- ✅ Xem báo cáo thống kê

**Các chức năng đặc biệt:**
- Truy cập bảng điều khiển quản lý
- Tạo sự cố mới qua nút "Tạo sự cố mới"
- Gán công việc cho các Coordinator hoặc Handler
- Xem lịch sử các sự cố đã xóa

---

### 2. Điều phối (Coordinator) - Quản lý Sự cố 🟡

**Mô tả:** Người phối hợp/quản lý sự cố, gán công việc cho người xử lý

**Quyền hạn:**
- ✅ Xem danh sách sự cố
- ✅ Chỉnh sửa thông tin sự cố (ngoài tình trạng kỹ thuật)
- ✅ Cập nhật trạng thái xử lý
- ✅ Gán/Hủy gán người xử lý
- ✅ Thêm ghi chú/nhận xét
- ✅ Xem báo cáo thống kê
- ❌ Không thể tạo sự cố mới
- ❌ Không thể xóa sự cố
- ❌ Không thể xem báo cáo toàn hệ thống

**Các chức năng đặc biệt:**
- Có nút "Tạo sự cố mới" trong danh sách
- Gán công việc cho Handler
- Cập nhật trạng thái để theo dõi tiến độ

---

### 3. Người đi xử lý (Handler) - Xử lý Sự cố 🔵

**Mô tả:** Người thực hiện công việc xử lý sự cố

**Quyền hạn:**
- ✅ Xem danh sách sự cố
- ✅ Cập nhật trạng thái sự cố (chỉ khi đang xử lý)
- ✅ Thêm ghi chú/nhận xét
- ❌ Không thể tạo sự cố
- ❌ Không thể chỉnh sửa thông tin sự cố
- ❌ Không thể xóa sự cố
- ❌ Không thể gán công việc

**Các chức năng đặc biệt:**
- Chỉ có thể cập nhật trạng thái khi sự cố ở trạng thái "Đang xử lý"
- Không thể đổi trạng thái khi sự cố chưa được gán
- Có thể thêm ghi chú để báo cáo tiến độ

---

## Trạng thái Sự cố

Hệ thống sử dụng 3 trạng thái sự cố:

1. **Chờ xử lý** (Open) - 🔴
   - Sự cố mới được tạo hoặc chưa được gán
   - Supervisor & Coordinator có thể gán người xử lý

2. **Đang xử lý** (In Progress) - 🟡
   - Sự cố đã được gán cho Handler
   - Handler có thể cập nhật trạng thái
   - Supervisor & Coordinator có thể gán lại hoặc thay đổi trạng thái

3. **Đã giải quyết** (Resolved) - 🟢
   - Sự cố đã được xử lý xong
   - Chỉ Supervisor & Coordinator mới có thể đổi trạng thái này

---

## Quy trình Xử lý Sự cố

```
Supervisor/Coordinator
       ↓
  Tạo sự cố
       ↓  
   Gán Handler
       ↓
   Status: Chờ xử lý → Đang xử lý
       ↓
     Handler
  Cập nhật tiến độ
  Thêm ghi chú
       ↓
Supervisor/Coordinator
  Xem tiến độ
  Cập nhật trạng thái
       ↓
   Status: Đã giải quyết
```

---

## Cách Đăng nhập với các Role khác nhau

### Đăng nhập với role Giám sát
- Tên đăng nhập: `admin`
- Mật khẩu: `123456`
- Vai trò: **Giám sát (Supervisor)**

### Đăng nhập với role Điều phối
- Tên đăng nhập: `coordinator`
- Mật khẩu: `123456`
- Vai trò: **Điều phối (Coordinator)**

### Đăng nhập với role Người đi xử lý
- Tên đăng nhập: `technician`
- Mật khẩu: `123456`
- Vai trò: **Người đi xử lý (Handler)**

---

## Triển khai Quyền hạn trong Code

### AuthContext
```typescript
// context/AuthContext.tsx
export type UserRole = 'supervisor' | 'coordinator' | 'handler'

interface AuthContextType {
  user: User | null
  hasPermission: (requiredRoles: UserRole[]) => boolean
}
```

### Sử dụng trong Component
```typescript
const { hasPermission } = useAuth()

if (hasPermission(['supervisor', 'coordinator'])) {
  // Hiển thị button tạo sự cố
}
```

### Phân quyền trong IncidentDetail
```typescript
{hasPermission(['supervisor', 'coordinator']) && (
  <button onClick={handleStatusUpdate}>
    Cập nhật trạng thái
  </button>
)}
```

---

## Mở rộng Quyền hạn

Để thêm vai trò mới hoặc thay đổi quyền hạn:

1. Cập nhật `UserRole` type trong `AuthContext.tsx`
2. Thêm role mới vào `rolePermissions` trong `utils/permissions.ts`
3. Cập nhật logic `hasPermission()` nếu cần
4. Thêm điều kiện phân quyền vào các component liên quan

---

## Ghi chú Bảo mật

- **Demo Mode**: Hiện tại, mật khẩu không được xác minh thực tế. Trong production, bạn cần triển khai xác thực thực sự.
- **Authorization**: Quyền hạn được kiểm tra trên client-side. Trong production, cần kiểm tra trên server-side.
- **Token**: Sử dụng JWT hoặc session để lưu trữ thông tin người dùng an toàn.

---

## Hỏi Đáp

**Q: Làm cách nào để thay đổi vai trò của người dùng?**  
A: Hiện tại, vai trò được chọn khi đăng nhập. Trong production, bạn có thể thêm trang "Quản lý người dùng" để Supervisor thay đổi vai trò.

**Q: Có thể có 4 vai trò khác ngoài 3 cái hiện tại không?**  
A: Có, bạn có thể dễ dàng thêm vai trò mới bằng cách cập nhật `UserRole` type và thêm quyền hạn trong `permissions.ts`.

**Q: Người dùng có thể có nhiều vai trò cùng lúc không?**  
A: Hiện tại không, nhưng bạn có thể sửa đổi để hỗ trợ điều đó bằng cách thay đổi `user.role` thành `user.roles: UserRole[]`.
