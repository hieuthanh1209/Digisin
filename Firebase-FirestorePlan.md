# Phương án triển khai Firebase Firestore cho Hệ thống Quản lý Nhà hàng

## 1. Giới thiệu

Tài liệu này trình bày phương án tổ chức cơ sở dữ liệu trên Firebase Firestore cho hệ thống quản lý nhà hàng. Firestore là cơ sở dữ liệu NoSQL dựa trên tài liệu (document) và bộ sưu tập (collection) thay vì bảng và quan hệ như cơ sở dữ liệu quan hệ truyền thống.

## 2. Cấu trúc cơ sở dữ liệu

### 2.1. Collection `users` - Người dùng hệ thống

```
users/{userId}
{
  uid: string,              // ID người dùng (từ Firebase Authentication)
  displayName: string,      // Tên hiển thị
  email: string,            // Email đăng nhập
  phoneNumber: string,      // Số điện thoại
  role: string,             // Vai trò: "manager", "cashier", "chef", "waiter"
  status: string,           // Trạng thái: "active", "inactive", "busy"
  profileImage: string,     // URL hình ảnh (optional)
  startDate: timestamp,     // Ngày bắt đầu làm việc
  salary: number,           // Lương (VNĐ)
  createdAt: timestamp,     // Thời điểm tạo tài khoản
  updatedAt: timestamp      // Thời điểm cập nhật gần nhất
}
```

### 2.2. Collection `menu_items` - Các món trong thực đơn

```
menu_items/{menuItemId}
{
  id: string,               // Mã món (ví dụ: MN001)
  name: string,             // Tên món
  category: string,         // Danh mục: "Mì & Phở", "Cơm", "Đồ uống", "Tráng miệng"
  price: number,            // Giá bán (VNĐ)
  cost: number,             // Giá vốn (VNĐ)
  description: string,      // Mô tả món ăn (optional)
  image: string,            // URL hình ảnh (optional)
  ingredients: [            // Danh sách nguyên liệu cần dùng
    {
      id: string,           // ID nguyên liệu
      name: string,         // Tên nguyên liệu
      amount: number,       // Số lượng định lượng chuẩn
      unit: string          // Đơn vị tính
    }
  ],
  status: string,           // Trạng thái: "active", "inactive"
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 2.3. Collection `inventory` - Quản lý kho

```
inventory/{ingredientId}
{
  id: string,               // Mã nguyên liệu (ví dụ: NL001)
  name: string,             // Tên nguyên liệu
  unit: string,             // Đơn vị tính
  standardAmount: number,   // Định mức chuẩn
  currentStock: number,     // Tồn kho hiện tại
  usedToday: number,        // Lượng đã dùng trong ngày
  thresholdAlert: number,   // Ngưỡng cảnh báo
  cost: number,             // Giá thành
  variance: number,         // Độ lệch chuẩn (%)
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 2.4. Collection `tables` - Bàn ăn

```
tables/{tableId}
{
  id: string,               // Mã bàn (ví dụ: T001)
  name: string,             // Tên/số bàn
  capacity: number,         // Sức chứa (số người)
  status: string,           // Trạng thái: "available", "occupied", "reserved"
  location: string,         // Vị trí: "indoor", "outdoor", "vip"
  currentOrder: string,     // ID của đơn hàng hiện tại (nếu có)
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 2.5. Collection `orders` - Đơn hàng

```
orders/{orderId}
{
  id: string,               // Mã đơn hàng (ví dụ: ORD001)
  tableId: string,          // ID bàn
  tableName: string,        // Tên bàn hiển thị
  status: string,           // Trạng thái: "new", "in-progress", "ready", "completed", "cancelled"
  items: [                  // Danh sách món đã gọi
    {
      id: string,           // ID món
      name: string,         // Tên món
      price: number,        // Giá bán
      quantity: number,     // Số lượng
      note: string,         // Ghi chú (optional)
      status: string,       // "pending", "preparing", "ready", "served"
      prepareTime: timestamp // Thời điểm bắt đầu chuẩn bị
    }
  ],
  subtotal: number,         // Tổng tiền trước giảm giá
  discount: number,         // Giảm giá (%)
  tax: number,              // Thuế (%)
  total: number,            // Tổng tiền cuối cùng
  paymentStatus: string,    // "unpaid", "paid", "partial"
  paymentMethod: string,    // "cash", "card", "transfer"
  waiterId: string,         // ID người phục vụ
  createdAt: timestamp,     // Thời điểm tạo đơn
  updatedAt: timestamp,     // Thời điểm cập nhật gần nhất
  completedAt: timestamp    // Thời điểm hoàn thành (optional)
}
```

### 2.6. Collection `transactions` - Giao dịch thu chi

```
transactions/{transactionId}
{
  id: string,               // Mã giao dịch (ví dụ: TC001)
  code: string,             // Mã phiếu (ví dụ: PT2023001, PC2023001)
  date: timestamp,          // Ngày giao dịch
  type: string,             // Loại: "income", "expense"
  category: string,         // Danh mục: "sales", "inventory", "salary", "utilities", "rent", "other"
  description: string,      // Mô tả giao dịch
  amount: number,           // Số tiền
  paymentMethod: string,    // Phương thức: "cash", "transfer", "card"
  relatedOrderId: string,   // ID đơn hàng liên quan (nếu có)
  createdBy: string,        // ID người tạo
  note: string,             // Ghi chú (optional)
  attachments: [string],    // Danh sách URL đính kèm (optional)
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 2.7. Collection `inventory_history` - Lịch sử kho

```
inventory_history/{entryId}
{
  id: string,               // ID bản ghi
  ingredientId: string,     // ID nguyên liệu
  ingredientName: string,   // Tên nguyên liệu
  type: string,             // Loại: "in" (nhập), "out" (xuất)
  quantity: number,         // Số lượng
  remainingStock: number,   // Tồn kho sau thao tác
  unit: string,             // Đơn vị tính
  date: timestamp,          // Ngày thực hiện
  reason: string,           // Lý do: "purchase", "consumption", "adjustment", "damage"
  cost: number,             // Chi phí (nếu nhập)
  relatedOrderId: string,   // ID đơn hàng liên quan (nếu xuất cho đơn hàng)
  createdBy: string,        // ID người thực hiện
  note: string,             // Ghi chú (optional)
  createdAt: timestamp
}
```

### 2.8. Collection `reports` - Báo cáo lưu trữ

```
reports/{reportId}
{
  id: string,               // ID báo cáo
  name: string,             // Tên báo cáo
  type: string,             // Loại: "daily", "weekly", "monthly", "custom"
  startDate: timestamp,     // Ngày bắt đầu
  endDate: timestamp,       // Ngày kết thúc
  revenue: number,          // Doanh thu
  costs: number,            // Chi phí
  profit: number,           // Lợi nhuận
  orderCount: number,       // Tổng số đơn hàng
  averageOrderValue: number, // Giá trị đơn hàng trung bình
  topSellingItems: [        // Top món bán chạy
    {
      id: string,           // ID món
      name: string,         // Tên món
      quantity: number,     // Số lượng đã bán
      revenue: number       // Doanh thu từ món này
    }
  ],
  categoryBreakdown: [      // Phân tích theo danh mục
    {
      category: string,     // Tên danh mục
      revenue: number,      // Doanh thu
      percentage: number    // Phần trăm trong tổng doanh thu
    }
  ],
  fileUrl: string,          // URL file báo cáo đã xuất
  createdBy: string,        // ID người tạo báo cáo
  createdAt: timestamp
}
```

### 2.9. Collection `settings` - Cấu hình hệ thống

```
settings/restaurant_info
{
  name: string,             // Tên nhà hàng
  address: string,          // Địa chỉ
  phone: string,            // Số điện thoại
  email: string,            // Email liên hệ
  logo: string,             // URL logo
  taxRate: number,          // Thuế suất mặc định (%)
  currency: string,         // Đơn vị tiền tệ
  businessHours: {          // Giờ mở cửa
    monday: { open: string, close: string },
    tuesday: { open: string, close: string },
    // ...các ngày khác
  },
  updatedAt: timestamp
}

settings/system_config
{
  allowNegativeInventory: boolean,     // Cho phép tồn kho âm
  inventoryAlertThreshold: number,     // Ngưỡng cảnh báo mặc định
  allowVariance: number,               // Độ lệch cho phép (%)
  autoBackup: boolean,                 // Tự động sao lưu dữ liệu
  receiptFooter: string,               // Chân trang hóa đơn
  updatedAt: timestamp
}
```

### 2.10. Collection `notifications` - Thông báo hệ thống

```
notifications/{notificationId}
{
  id: string,               // ID thông báo
  type: string,             // Loại: "alert", "info", "warning"
  title: string,            // Tiêu đề
  message: string,          // Nội dung
  targetUsers: [string],    // Danh sách ID người dùng nhận thông báo
  targetRoles: [string],    // Danh sách vai trò nhận thông báo
  read: {                   // Trạng thái đọc
    "userId1": timestamp,
    "userId2": timestamp
  },
  relatedTo: {              // Liên kết đến đối tượng
    type: string,           // "order", "inventory", "transaction"
    id: string              // ID của đối tượng liên quan
  },
  createdAt: timestamp
}
```

## 3. Thiết kế và Tối ưu hóa

### 3.1. Denormalization (Phi chuẩn hóa)

Trong Firestore, đôi khi cần lưu trữ dữ liệu trùng lặp để tối ưu hiệu suất đọc. Ví dụ:

- Lưu `tableName` trong `orders` để tránh một truy vấn phụ đến collection `tables`
- Lưu `ingredientName` trong `inventory_history` thay vì chỉ tham chiếu đến `ingredientId`

### 3.2. Subcollections vs Nested Arrays

- **Subcollections**: Sử dụng cho danh sách lớn hoặc phát triển không giới hạn

  ```
  orders/{orderId}/order_items/{itemId}
  users/{userId}/activity_log/{logId}
  ```

- **Nested Arrays**: Sử dụng cho danh sách nhỏ, cố định (như danh sách nguyên liệu của món)

### 3.3. Indexes (Chỉ mục)

Cần tạo composite index cho các truy vấn phức tạp:

- Lọc đơn hàng theo ngày và trạng thái
- Lọc giao dịch theo loại và khoảng thời gian
- Tìm kiếm món ăn theo danh mục và trạng thái

### 3.4. Security Rules (Quy tắc bảo mật)

Thiết lập quy tắc bảo mật chi tiết theo vai trò:

```
match /users/{userId} {
  allow read: if request.auth != null;
  allow write: if request.auth.uid == userId || request.auth.token.role == 'manager';
}
```

### 3.5. Batch Operations (Thao tác hàng loạt)

Sử dụng batch hoặc transaction cho các thao tác cần tính nhất quán:

- Thanh toán đơn hàng (cập nhật `orders`, `tables`, tạo `transactions`)
- Nhập/xuất kho (cập nhật `inventory`, tạo `inventory_history`)

## 4. Quyền truy cập theo vai trò

### 4.1. Thu ngân (Cashier)

- Truy cập: `tables`, `menu_items`, `orders`
- Đọc/ghi `transactions` giới hạn trong loại "income"/"sales"

### 4.2. Phục vụ (Waiter)

- Truy cập: `tables`, `menu_items`, `orders`
- Chỉ có quyền đọc các collection khác

### 4.3. Đầu bếp (Chef)

- Chủ yếu truy cập: `orders` để xem và cập nhật trạng thái các món
- Đọc: `menu_items` và `inventory`

### 4.4. Quản lý (Manager)

- Truy cập đầy đủ tất cả collections
- Đặc biệt quản lý: `reports`, `users`, `transactions`, `inventory`

## 5. Tối ưu hiệu suất

### 5.1. Sharding collections

Nếu số lượng đơn hàng, giao dịch lớn, có thể chia nhỏ theo thời gian:

```
orders_2023_06/{orderId}
orders_2023_07/{orderId}
```

### 5.2. Lazy Loading

Load dữ liệu khi cần, sử dụng pagination:

```javascript
db.collection("orders").orderBy("createdAt", "desc").limit(20).get();
```

### 5.3. Cloud Functions

Sử dụng cho các tác vụ tự động:

- Tính toán tồn kho khi hoàn thành đơn hàng
- Tạo báo cáo tự động theo lịch trình
- Gửi thông báo khi tồn kho dưới ngưỡng

## 6. Kế hoạch triển khai

### 6.1. Khởi tạo dự án Firebase

1. Tạo dự án mới trên Firebase Console
2. Kích hoạt Firestore Database
3. Thiết lập Authentication (Email/Password, Google)

### 6.2. Thiết lập cấu hình

1. Tạo các collection và document mẫu
2. Thiết lập Security Rules
3. Tạo Indexes cần thiết

### 6.3. Tích hợp SDK

```javascript
// Khởi tạo Firebase trong ứng dụng
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
```

### 6.4. Đồng bộ dữ liệu offline

Kích hoạt tính năng đồng bộ offline để ứng dụng hoạt động khi mất kết nối:

```javascript
import { enableIndexedDbPersistence } from "firebase/firestore";

enableIndexedDbPersistence(db).catch((err) => {
  console.error("Không thể kích hoạt persistence:", err);
});
```

## 7. Kết luận

Firebase Firestore cung cấp nền tảng cơ sở dữ liệu mạnh mẽ cho hệ thống quản lý nhà hàng với khả năng mở rộng cao, đồng bộ real-time, và hoạt động offline. Cấu trúc được đề xuất tận dụng các ưu điểm của mô hình NoSQL trong khi vẫn đảm bảo hiệu suất và tính nhất quán của dữ liệu.

Cấu trúc này có thể điều chỉnh dựa trên quy mô và yêu cầu cụ thể của nhà hàng. Firestore linh hoạt cho phép mở rộng và điều chỉnh cơ sở dữ liệu khi ứng dụng phát triển.
