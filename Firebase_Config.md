# 🔥 Firebase Firestore Database Configuration

## Restaurant Management System

### 📋 Tổng quan

File này chứa cấu trúc chi tiết và hướng dẫn cấu hình Firebase Firestore cho hệ thống quản lý nhà hàng với 4 dashboard: Waiter, Chef, Cashier, Manager.

---

## 🗂️ **Cấu trúc Collections**

### 1. **`users`** - Xác thực & Phân quyền

```javascript
users/{userId}
├── email: string                    // Email đăng nhập
├── name: string                     // Tên đầy đủ
├── role: string                     // "waiter"|"chef"|"cashier"|"manager"
├── phone: string                    // Số điện thoại
├── avatar: string                   // URL avatar
├── status: string                   // "active"|"inactive"|"busy"
├── permissions: array               // Danh sách quyền chi tiết
├── createdAt: timestamp             // Ngày tạo
├── lastLogin: timestamp             // Lần đăng nhập cuối
└── shift: object {                  // Ca làm việc
    ├── start: timestamp             // Bắt đầu ca
    ├── end: timestamp               // Kết thúc ca
    └── status: string               // "working"|"break"|"finished"
}
```

**Ví dụ document:**

```json
{
  "email": "waiter01@restaurant.com",
  "name": "Nguyễn Văn A",
  "role": "waiter",
  "phone": "0901234567",
  "avatar": "https://storage.googleapis.com/avatars/waiter01.jpg",
  "status": "active",
  "permissions": ["view_menu", "create_order", "update_table"],
  "createdAt": "2024-01-15T08:00:00Z",
  "lastLogin": "2024-01-20T14:30:00Z",
  "shift": {
    "start": "2024-01-20T08:00:00Z",
    "end": "2024-01-20T16:00:00Z",
    "status": "working"
  }
}
```

### 2. **`staff`** - Quản lý nhân viên

```javascript
staff/{staffId}
├── employeeId: string               // Mã nhân viên (NV001, NV002...)
├── name: string                     // Tên đầy đủ
├── position: string                 // Chức vụ
├── phone: string                    // Số điện thoại
├── email: string                    // Email
├── address: string                  // Địa chỉ
├── status: string                   // "active"|"inactive"|"on_leave"
├── startDate: timestamp             // Ngày bắt đầu làm việc
├── salary: number                   // Lương cơ bản
├── workSchedule: array              // Lịch làm việc
├── performance: object              // Đánh giá hiệu suất
└── createdAt: timestamp             // Ngày tạo hồ sơ
```

### 3. **`menuItems`** - Thực đơn

```javascript
menuItems/{itemId}
├── id: string                       // Mã món (M001, M002...)
├── name: string                     // Tên món ăn
├── category: string                 // "appetizer"|"main"|"dessert"|"beverage"
├── price: number                    // Giá bán
├── cost: number                     // Giá vốn
├── image: string                    // URL hình ảnh
├── description: string              // Mô tả món ăn
├── ingredients: array               // Nguyên liệu
├── cookingTime: number              // Thời gian chế biến (phút)
├── status: string                   // "available"|"unavailable"|"out_of_stock"
├── isPopular: boolean               // Món phổ biến
├── nutritionInfo: object            // Thông tin dinh dưỡng
├── allergens: array                 // Chất gây dị ứng
└── createdAt: timestamp             // Ngày tạo
```

### 4. **`tables`** - Quản lý bàn

```javascript
tables/{tableId}
├── number: number                   // Số bàn (1-12)
├── capacity: number                 // Số chỗ ngồi
├── status: string                   // "available"|"occupied"|"reserved"|"cleaning"
├── currentOrder: string             // ID đơn hàng hiện tại (null nếu trống)
├── reservationInfo: object {        // Thông tin đặt bàn
    ├── customerName: string
    ├── phone: string
    ├── time: timestamp
    └── notes: string
}
├── qrCode: string                   // Mã QR cho self-order
└── lastUpdated: timestamp           // Cập nhật cuối
```

### 5. **`orders`** - Đơn hàng (Collection chính)

```javascript
orders/{orderId}
├── orderNumber: string              // Số hóa đơn (HD001, HD002...)
├── tableNumber: number              // Số bàn
├── customerId: string               // ID khách hàng (optional)
├── waiterId: string                 // ID nhân viên phục vụ
├── items: array [                   // Danh sách món
    {
        itemId: string,              // ID món ăn
        name: string,                // Tên món
        price: number,               // Giá
        quantity: number,            // Số lượng
        notes: string,               // Ghi chú đặc biệt
        status: string               // "pending"|"preparing"|"ready"|"served"
    }
]
├── status: string                   // "pending"|"confirmed"|"preparing"|"ready"|"completed"|"cancelled"
├── subtotal: number                 // Tổng tiền trước thuế
├── tax: number                      // Thuế VAT 8%
├── discount: number                 // Số tiền giảm giá
├── total: number                    // Tổng tiền sau thuế và giảm giá
├── notes: string                    // Ghi chú đơn hàng
├── createdAt: timestamp             // Thời gian tạo
├── updatedAt: timestamp             // Cập nhật cuối
├── cookingStartTime: timestamp      // Bắt đầu chế biến
├── readyTime: timestamp             // Sẵn sàng phục vụ
└── completedTime: timestamp         // Hoàn thành
```

### 6. **`payments`** - Thanh toán

```javascript
payments/{paymentId}
├── orderId: string                  // ID đơn hàng
├── method: string                   // "cash"|"card"|"bank_transfer"|"momo"
├── amount: number                   // Số tiền cần thanh toán
├── receivedAmount: number           // Số tiền nhận được
├── change: number                   // Tiền thối
├── discountCode: string             // Mã giảm giá sử dụng
├── discountAmount: number           // Số tiền giảm
├── cashierId: string                // ID thu ngân
├── invoice: object {                // Thông tin hóa đơn
    ├── number: string,              // Số hóa đơn
    ├── printedAt: timestamp,        // Thời gian in
    └── customerInfo: object         // Thông tin khách hàng
}
├── status: string                   // "pending"|"completed"|"refunded"
└── createdAt: timestamp             // Thời gian thanh toán
```

### 7. **`inventory`** - Kho nguyên liệu

```javascript
inventory/{itemId}
├── name: string                     // Tên nguyên liệu
├── category: string                 // "meat"|"vegetable"|"seasoning"|"beverage"
├── unit: string                     // "kg"|"gram"|"liter"|"piece"
├── currentStock: number             // Tồn kho hiện tại
├── minStock: number                 // Mức tồn kho tối thiểu
├── maxStock: number                 // Mức tồn kho tối đa
├── cost: number                     // Giá nhập
├── supplier: string                 // Nhà cung cấp
├── expiryDate: timestamp            // Hạn sử dụng
├── lastRestocked: timestamp         // Nhập kho cuối
└── variance: number                 // Độ lệch thực tế (5-10%)
```

### 8. **`discountCodes`** - Mã giảm giá

```javascript
discountCodes/{codeId}
├── code: string                     // Mã giảm giá ("NEWCUSTOMER", "STUDENT")
├── type: string                     // "percentage"|"fixed_amount"
├── value: number                    // Giá trị (% hoặc số tiền)
├── minOrderValue: number            // Giá trị đơn hàng tối thiểu
├── maxDiscount: number              // Giảm giá tối đa (cho percentage)
├── usageLimit: number               // Giới hạn sử dụng
├── usedCount: number                // Số lần đã sử dụng
├── validFrom: timestamp             // Có hiệu lực từ
├── validTo: timestamp               // Hết hạn
├── status: string                   // "active"|"inactive"|"expired"
└── applicableCategories: array      // Danh mục áp dụng
```

---

## 📊 **Subcollections cho Analytics**

### 9. **`orders/{date}/dailyReports`** - Báo cáo hàng ngày

```javascript
orders/{date}/dailyReports/{reportId}
├── date: string                     // "2024-01-15"
├── totalOrders: number              // Tổng số đơn
├── totalRevenue: number             // Tổng doanh thu
├── totalCost: number                // Tổng chi phí
├── profit: number                   // Lợi nhuận
├── topSellingItems: array           // Món bán chạy
├── peakHours: object                // Giờ cao điểm
├── staffPerformance: object         // Hiệu suất nhân viên
└── generatedAt: timestamp           // Thời gian tạo báo cáo
```

### 10. **`orders/{orderId}/tracking`** - Theo dõi đơn hàng

```javascript
orders/{orderId}/tracking/{trackingId}
├── status: string                   // Trạng thái mới
├── timestamp: timestamp             // Thời gian thay đổi
├── staffId: string                  // Nhân viên thực hiện
├── notes: string                    // Ghi chú
└── duration: number                 // Thời gian xử lý (giây)
```

---

## 🔄 **Real-time Listeners**

### Waiter Dashboard

```javascript
// Theo dõi trạng thái bàn
const unsubscribeTables = db.collection("tables").onSnapshot((snapshot) => {
  snapshot.docChanges().forEach((change) => {
    if (change.type === "modified") {
      updateTableStatus(change.doc.data());
    }
  });
});

// Theo dõi đơn hàng của waiter
const unsubscribeOrders = db
  .collection("orders")
  .where("waiterId", "==", currentWaiterId)
  .where("status", "in", ["pending", "confirmed", "ready"])
  .onSnapshot(updateOrdersList);
```

### Chef Dashboard

```javascript
// Theo dõi đơn hàng cần chế biến
const unsubscribeChefOrders = db
  .collection("orders")
  .where("status", "in", ["confirmed", "preparing"])
  .orderBy("createdAt", "asc")
  .onSnapshot(updateChefQueue);

// Theo dõi từng item trong đơn hàng
const unsubscribeOrderItems = db
  .collectionGroup("items")
  .where("status", "in", ["pending", "preparing"])
  .onSnapshot(updateKitchenDisplay);
```

### Cashier Dashboard

```javascript
// Theo dõi đơn hàng sẵn sàng thanh toán
const unsubscribeCashierOrders = db
  .collection("orders")
  .where("status", "==", "ready")
  .onSnapshot(updatePaymentQueue);

// Theo dõi thanh toán hôm nay
const unsubscribePayments = db
  .collection("payments")
  .where("createdAt", ">=", todayStart)
  .onSnapshot(updateDailyRevenue);
```

### Manager Dashboard

```javascript
// Theo dõi tất cả hoạt động
const unsubscribeAllOrders = db
  .collection("orders")
  .where("createdAt", ">=", todayStart)
  .onSnapshot(updateManagerDashboard);

// Theo dõi tồn kho
const unsubscribeInventory = db
  .collection("inventory")
  .where("currentStock", "<=", "minStock")
  .onSnapshot(updateLowStockAlerts);

// Theo dõi nhân viên online
const unsubscribeStaff = db
  .collection("users")
  .where("status", "==", "active")
  .onSnapshot(updateStaffStatus);
```

---

## 🔐 **Security Rules**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Hàm helper kiểm tra role
    function getUserRole() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role;
    }

    function isAuthenticated() {
      return request.auth != null;
    }

    function isManager() {
      return isAuthenticated() && getUserRole() == 'manager';
    }

    function isWaiter() {
      return isAuthenticated() && getUserRole() == 'waiter';
    }

    function isChef() {
      return isAuthenticated() && getUserRole() == 'chef';
    }

    function isCashier() {
      return isAuthenticated() && getUserRole() == 'cashier';
    }

    // Users - chỉ đọc/sửa profile của mình
    match /users/{userId} {
      allow read, write: if isAuthenticated() && request.auth.uid == userId;
      allow read: if isManager(); // Manager có thể xem tất cả user
    }

    // Staff - chỉ manager có full access
    match /staff/{staffId} {
      allow read: if isAuthenticated();
      allow write: if isManager();
    }

    // Menu Items - tất cả đọc được, chỉ manager sửa được
    match /menuItems/{itemId} {
      allow read: if isAuthenticated();
      allow write: if isManager();
    }

    // Tables - waiter và manager có thể cập nhật
    match /tables/{tableId} {
      allow read: if isAuthenticated();
      allow write: if isWaiter() || isManager();
    }

    // Orders - phân quyền theo role
    match /orders/{orderId} {
      allow read: if isAuthenticated();
      allow create: if isWaiter() || isManager();
      allow update: if isAuthenticated() && (
        isManager() ||
        (isWaiter() && resource.data.waiterId == request.auth.uid) ||
        isChef() ||
        isCashier()
      );

      // Subcollection tracking
      match /tracking/{trackingId} {
        allow read, write: if isAuthenticated();
      }
    }

    // Payments - cashier và manager
    match /payments/{paymentId} {
      allow read: if isAuthenticated();
      allow write: if isCashier() || isManager();
    }

    // Inventory - chef và manager
    match /inventory/{itemId} {
      allow read: if isAuthenticated();
      allow write: if isChef() || isManager();
    }

    // Discount codes - cashier và manager đọc, chỉ manager sửa
    match /discountCodes/{codeId} {
      allow read: if isCashier() || isManager();
      allow write: if isManager();
    }

    // Daily reports - chỉ manager
    match /reports/{reportId} {
      allow read, write: if isManager();
    }
  }
}
```

---

## 📈 **Indexes cần tạo**

### Composite Indexes

```javascript
// Orders
orders: [status, createdAt](Ascending);
orders: [waiterId, createdAt](Ascending);
orders: [tableNumber, status](Ascending);
orders: [status, updatedAt](Ascending);

// Menu Items
menuItems: [category, status](Ascending);
menuItems: [status, isPopular](Ascending);

// Inventory
inventory: [currentStock, minStock](Ascending);
inventory: [category, currentStock](Ascending);

// Payments
payments: [createdAt, status](Ascending);
payments: [cashierId, createdAt](Ascending);

// Staff
staff: [status, position](Ascending);

// Users
users: [role, status](Ascending);
```

### Single Field Indexes

```javascript
// Tự động tạo bởi Firestore cho các trường thường query
-orders.status -
  tables.status -
  users.role -
  inventory.currentStock -
  payments.method;
```

---

## ⚙️ **Setup Configuration**

### 1. **Firebase Project Setup**

```bash
# Cài đặt Firebase CLI
npm install -g firebase-tools

# Đăng nhập Firebase
firebase login

# Khởi tạo project
firebase init firestore
```

### 2. **Web App Configuration**

```javascript
// config/firebase-config.js
import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "restaurant-management-xxxxx.firebaseapp.com",
  projectId: "restaurant-management-xxxxx",
  storageBucket: "restaurant-management-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456789",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

// Connect to emulator in development
if (location.hostname === "localhost") {
  connectFirestoreEmulator(db, "localhost", 8080);
}
```

### 3. **Environment Variables**

```bash
# .env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=restaurant-management-xxxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=restaurant-management-xxxxx
VITE_FIREBASE_STORAGE_BUCKET=restaurant-management-xxxxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456789
```

---

## 🛠️ **Best Practices**

### 1. **Data Modeling**

- ✅ Denormalize data khi cần thiết để giảm số lần read
- ✅ Sử dụng array-contains cho query đơn giản
- ✅ Tránh deep nesting (> 3 levels)
- ✅ Sử dụng batch writes cho multiple operations

### 2. **Performance Optimization**

- ✅ Sử dụng pagination cho danh sách lớn
- ✅ Cache data ở client side
- ✅ Sử dụng offline persistence
- ✅ Limit số documents trong real-time listeners

### 3. **Security**

- ✅ Luôn validate data ở Security Rules
- ✅ Không expose sensitive data
- ✅ Sử dụng custom claims cho complex authorization
- ✅ Monitor unusual access patterns

### 4. **Cost Optimization**

- ✅ Minimize số lần read bằng cách batch queries
- ✅ Sử dụng local cache hiệu quả
- ✅ Avoid listening to large collections
- ✅ Use server timestamps instead of client timestamps

---

## 📝 **Sample Data cho Testing**

### Users Sample

```javascript
// users/user1
{
  "email": "waiter01@restaurant.com",
  "name": "Nguyễn Văn Nam",
  "role": "waiter",
  "phone": "0901234567",
  "status": "active",
  "createdAt": "2024-01-15T08:00:00Z"
}

// users/user2
{
  "email": "chef01@restaurant.com",
  "name": "Trần Thị Hoa",
  "role": "chef",
  "phone": "0901234568",
  "status": "active",
  "createdAt": "2024-01-15T08:00:00Z"
}
```

### Menu Items Sample

```javascript
// menuItems/item1
{
  "id": "M001",
  "name": "Phở Bò Tái",
  "category": "main",
  "price": 65000,
  "cost": 35000,
  "image": "https://example.com/pho-bo-tai.jpg",
  "cookingTime": 15,
  "status": "available",
  "isPopular": true,
  "ingredients": ["thịt bò", "bánh phở", "hành lá"],
  "createdAt": "2024-01-15T08:00:00Z"
}
```

### Tables Sample

```javascript
// tables/table1
{
  "number": 1,
  "capacity": 4,
  "status": "available",
  "currentOrder": null,
  "qrCode": "QR_TABLE_001",
  "lastUpdated": "2024-01-20T14:30:00Z"
}
```

---

## 🚀 **Migration Plan**

### Phase 1: Basic Setup (Tuần 1)

- [ ] Tạo Firebase project
- [ ] Setup authentication
- [ ] Tạo basic collections: users, menuItems, tables
- [ ] Implement basic security rules

### Phase 2: Core Features (Tuần 2-3)

- [ ] Implement orders collection với real-time
- [ ] Tích hợp với Waiter và Chef dashboard
- [ ] Add payment processing
- [ ] Setup basic analytics

### Phase 3: Advanced Features (Tuần 4-5)

- [ ] Inventory management
- [ ] Advanced reporting
- [ ] Performance optimization
- [ ] Mobile app preparation

### Phase 4: Production Ready (Tuần 6)

- [ ] Security audit
- [ ] Performance testing
- [ ] Backup strategy
- [ ] Monitoring setup

---

## 📞 **Support & Resources**

- **Firebase Documentation**: https://firebase.google.com/docs/firestore
- **Security Rules**: https://firebase.google.com/docs/rules
- **Best Practices**: https://firebase.google.com/docs/firestore/best-practices
- **Cost Calculator**: https://firebase.google.com/pricing

---

**Tạo ngày**: 2024-01-20  
**Cập nhật cuối**: 2024-01-20  
**Version**: 1.0.0
