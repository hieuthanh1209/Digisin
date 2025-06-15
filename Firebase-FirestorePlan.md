# Phương án triển khai Firebase Firestore cho Hệ thống Quản lý Nhà hàng

## 1. Giới thiệu

Tài liệu này trình bày phương án tổ chức cơ sở dữ liệu trên Firebase Firestore cho hệ thống quản lý nhà hàng. Firestore là cơ sở dữ liệu NoSQL dựa trên tài liệu (document) và bộ sưu tập (collection) thay vì bảng và quan hệ như cơ sở dữ liệu quan hệ truyền thống.

### 1.1. Tài khoản demo cho mục đích thử nghiệm

Hệ thống được thiết lập với các tài khoản demo sau để phục vụ mục đích thử nghiệm:

| Vai trò      | Email                | Mật khẩu | Phân quyền                                     |
| ------------ | -------------------- | -------- | ---------------------------------------------- |
| **Thu ngân** | thanhhieu@gmail.com  | 123456   | Quản lý đơn hàng, thanh toán, xuất hóa đơn     |
|              | tiendung@yahoo.com   | 56789    |                                                |
| **Phục vụ**  | ngochoa@gmail.com    | 123456   | Xem bàn trống, nhận order, cập nhật trạng thái |
|              | thuytien@yahoo.com   | 56789    |                                                |
| **Đầu bếp**  | minhtri@gmail.com    | 123456   | Nhận order, cập nhật trạng thái nấu            |
|              | vietanh@yahoo.com    | 56789    |                                                |
| **Quản lý**  | quocminh@gmail.com   | 123456   | Toàn quyền trên hệ thống                       |
|              | thanhtrung@yahoo.com | 56789    |                                                |

> Lưu ý: Các tài khoản này chỉ sử dụng cho mục đích phát triển và thử nghiệm. Trong môi trường sản xuất, cần thiết lập hệ thống xác thực và phân quyền chặt chẽ hơn.

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

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Hàm kiểm tra xem người dùng đã đăng nhập chưa
    function isSignedIn() {
      return request.auth != null;
    }

    // Hàm kiểm tra role của người dùng
    function hasRole(role) {
      return isSignedIn() && request.auth.token.role == role;
    }

    // Hàm kiểm tra xem người dùng có phải là quản lý không
    function isManager() {
      return hasRole('manager');
    }

    // Hàm kiểm tra xem người dùng có phải là chủ của dữ liệu không
    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }

    // Quy tắc cho collection users
    match /users/{userId} {
      // Ai cũng có thể đọc thông tin cơ bản của users
      allow read: if isSignedIn();
      // Chỉ owner hoặc manager mới có thể sửa thông tin user
      allow write: if isOwner(userId) || isManager();
    }

    // Quy tắc cho collection menu_items
    match /menu_items/{itemId} {
      // Ai cũng có thể xem menu
      allow read: if isSignedIn();
      // Chỉ manager mới có thể thêm/sửa/xóa món ăn
      allow write: if isManager();
    }

    // Quy tắc cho collection orders
    match /orders/{orderId} {
      // Tất cả nhân viên đều có thể xem orders
      allow read: if isSignedIn();
      // Waiter có thể tạo và cập nhật order
      allow create, update: if hasRole('waiter') || hasRole('cashier') || isManager();
      // Cashier có thể cập nhật trạng thái thanh toán
      allow update: if hasRole('cashier') &&
                     (request.resource.data.diff(resource.data).affectedKeys()
                      .hasOnly(['paymentStatus', 'paymentMethod', 'updatedAt']));
      // Chef có thể cập nhật trạng thái các món ăn
      allow update: if hasRole('chef') &&
                     (request.resource.data.diff(resource.data).affectedKeys()
                      .hasOnly(['items', 'status', 'updatedAt']));
      // Chỉ manager mới có thể xóa đơn hàng
      allow delete: if isManager();
    }

    // Quy tắc cho collection transactions
    match /transactions/{transId} {
      // Cashier và manager có thể đọc transactions
      allow read: if hasRole('cashier') || isManager();
      // Cashier chỉ có thể thêm/cập nhật giao dịch thu
      allow create, update: if hasRole('cashier') && request.resource.data.type == 'income';
      // Manager có thể thêm/sửa/xóa tất cả giao dịch
      allow write: if isManager();
    }

    // Quy tắc cho collection inventory
    match /inventory/{ingredientId} {
      // Chef và manager có thể xem kho
      allow read: if hasRole('chef') || isManager();
      // Chỉ manager mới có thể thêm/sửa/xóa nguyên liệu
      allow write: if isManager();
    }

    // Quy tắc cho collection tables
    match /tables/{tableId} {
      // Tất cả nhân viên đều có thể xem bàn
      allow read: if isSignedIn();
      // Waiter và cashier có thể cập nhật trạng thái bàn
      allow update: if hasRole('waiter') || hasRole('cashier') || isManager();
      // Chỉ manager mới có thể tạo/xóa bàn
      allow create, delete: if isManager();
    }

    // Quy tắc cho collection reports
    match /reports/{reportId} {
      // Chỉ manager mới có thể đọc/ghi báo cáo
      allow read, write: if isManager();
    }

    // Quy tắc cho collection settings
    match /settings/{docId} {
      // Tất cả nhân viên đều có thể đọc cấu hình
      allow read: if isSignedIn();
      // Chỉ manager mới có thể thay đổi cấu hình
      allow write: if isManager();
    }

    // Quy tắc cho collection notifications
    match /notifications/{notificationId} {
      // Người dùng chỉ có thể đọc thông báo dành cho họ
      allow read: if isSignedIn() &&
                   (resource.data.targetUsers.hasAny([request.auth.uid]) ||
                    resource.data.targetRoles.hasAny([request.auth.token.role]));
      // Chỉ manager mới có thể tạo thông báo
      allow create: if isManager();
      // Người dùng có thể cập nhật trạng thái đã đọc của họ
      allow update: if isSignedIn() &&
                     request.resource.data.diff(resource.data).affectedKeys()
                     .hasOnly(['read.' + request.auth.uid]);
    }
  }
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

### 6.2. Thiết lập Authentication

1. Kích hoạt phương thức đăng nhập Email/Password trong Firebase Authentication
2. Tạo tài khoản người dùng demo như đã định nghĩa ở phần 1.1
3. Sử dụng Firebase Admin SDK để gán Custom Claims cho vai trò người dùng:

```javascript
// Ví dụ thiết lập role cho người dùng
const admin = require("firebase-admin");
admin.initializeApp();

async function setUserRole(email, role) {
  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, { role: role });
    console.log(`Đã thiết lập role ${role} cho user ${email}`);
  } catch (error) {
    console.error("Lỗi:", error);
  }
}

// Thiết lập role cho các tài khoản demo
setUserRole("thanhhieu@gmail.com", "cashier");
setUserRole("tiendung@yahoo.com", "cashier");
setUserRole("ngochoa@gmail.com", "waiter");
setUserRole("thuytien@yahoo.com", "waiter");
setUserRole("minhtri@gmail.com", "chef");
setUserRole("vietanh@yahoo.com", "chef");
setUserRole("quocminh@gmail.com", "manager");
setUserRole("thanhtrung@yahoo.com", "manager");
```

4. Tạo thông tin người dùng trong collection `users` tương ứng với các tài khoản Authentication

### 6.3. Thiết lập cấu hình

1. Tạo các collection và document mẫu
2. Thiết lập Security Rules
3. Tạo Indexes cần thiết

### 6.4. Tích hợp SDK

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

### 6.5. Tích hợp Firebase Authentication

Kết hợp Firebase Authentication với trang đăng nhập:

```javascript
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";

const auth = getAuth(app);

// Hàm đăng nhập
async function loginWithEmail(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Lấy token để kiểm tra role
    const idTokenResult = await user.getIdTokenResult();
    const role = idTokenResult.claims.role;

    // Điều hướng dựa trên role
    switch (role) {
      case "cashier":
        window.location.href = "./dashboard/cashier-dashboard.html";
        break;
      case "waiter":
        window.location.href = "./dashboard/waiter-dashboard.html";
        break;
      case "chef":
        window.location.href = "./dashboard/chef-dashboard.html";
        break;
      case "manager":
        window.location.href = "./dashboard/manager-dashboard.html";
        break;
      default:
        // Xử lý trường hợp không có role hoặc role không hợp lệ
        console.error("Role không hợp lệ hoặc không được thiết lập");
    }

    return { success: true, user };
  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
    return { success: false, error: error.message };
  }
}

// Kiểm tra trạng thái đăng nhập
onAuthStateChanged(auth, (user) => {
  if (user) {
    // Người dùng đã đăng nhập
    console.log("Đã đăng nhập:", user.email);
  } else {
    // Người dùng chưa đăng nhập, điều hướng về trang đăng nhập
    if (!window.location.href.includes("index.html")) {
      window.location.href = "../index.html";
    }
  }
});
```

### 6.6. Sử dụng Firebase Storage cho lưu trữ hình ảnh

Cấu hình Firebase Storage để lưu trữ hình ảnh món ăn, logo nhà hàng và hình ảnh người dùng:

```javascript
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const storage = getStorage(app);

// Upload hình ảnh món ăn
async function uploadMenuImage(menuId, file) {
  try {
    const storageRef = ref(storage, `menu_items/${menuId}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    // Cập nhật URL hình ảnh vào document menu_items
    await updateDoc(doc(db, "menu_items", menuId), {
      image: downloadURL,
      updatedAt: serverTimestamp(),
    });

    return { success: true, url: downloadURL };
  } catch (error) {
    console.error("Lỗi upload hình ảnh:", error);
    return { success: false, error: error.message };
  }
}
```

### 6.7. Thiết lập Firebase Cloud Functions

Tạo các Cloud Functions để tự động hóa các tác vụ quan trọng:

```javascript
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// Function tự động cập nhật kho khi hoàn thành đơn hàng
exports.updateInventoryOnOrderComplete = functions.firestore
  .document("orders/{orderId}")
  .onUpdate(async (change, context) => {
    const newValue = change.after.data();
    const previousValue = change.before.data();

    // Nếu đơn hàng vừa được đánh dấu là đã hoàn thành
    if (
      previousValue.status !== "completed" &&
      newValue.status === "completed"
    ) {
      const orderId = context.params.orderId;
      const db = admin.firestore();

      // Lấy thông tin các món ăn trong đơn hàng
      const orderItems = newValue.items;

      for (const item of orderItems) {
        // Lấy thông tin món ăn
        const menuItemRef = db.collection("menu_items").doc(item.id);
        const menuItemDoc = await menuItemRef.get();
        if (!menuItemDoc.exists) continue;

        const menuItemData = menuItemDoc.data();
        const ingredients = menuItemData.ingredients || [];

        // Cập nhật tồn kho cho từng nguyên liệu
        for (const ingredient of ingredients) {
          const ingredientRef = db.collection("inventory").doc(ingredient.id);
          const ingredientDoc = await ingredientRef.get();
          if (!ingredientDoc.exists) continue;

          const ingredientData = ingredientDoc.data();
          const currentStock = ingredientData.currentStock || 0;
          const usedAmount = ingredient.amount * item.quantity;
          const newStock = Math.max(0, currentStock - usedAmount);

          // Cập nhật số lượng tồn kho mới
          await ingredientRef.update({
            currentStock: newStock,
            usedToday: admin.firestore.FieldValue.increment(usedAmount),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          });

          // Ghi lịch sử xuất kho
          await db.collection("inventory_history").add({
            id: db.collection("inventory_history").doc().id,
            ingredientId: ingredient.id,
            ingredientName: ingredient.name,
            type: "out",
            quantity: usedAmount,
            remainingStock: newStock,
            unit: ingredient.unit,
            date: admin.firestore.FieldValue.serverTimestamp(),
            reason: "consumption",
            relatedOrderId: orderId,
            createdBy: newValue.waiterId || "system",
            note: `Sử dụng cho đơn hàng #${orderId}`,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
          });

          // Kiểm tra và gửi thông báo nếu tồn kho dưới ngưỡng
          if (newStock <= ingredientData.thresholdAlert) {
            await db.collection("notifications").add({
              id: db.collection("notifications").doc().id,
              type: "alert",
              title: "Cảnh báo tồn kho thấp",
              message: `Nguyên liệu ${ingredient.name} đã xuống dưới ngưỡng cảnh báo (${newStock} ${ingredient.unit})`,
              targetRoles: ["manager"],
              read: {},
              relatedTo: {
                type: "inventory",
                id: ingredient.id,
              },
              createdAt: admin.firestore.FieldValue.serverTimestamp(),
            });
          }
        }
      }
    }
  });

// Function tạo báo cáo hàng ngày tự động
exports.generateDailyReport = functions.pubsub
  .schedule("0 0 * * *") // Chạy lúc 00:00 mỗi ngày
  .timeZone("Asia/Ho_Chi_Minh")
  .onRun(async (context) => {
    const db = admin.firestore();

    // Lấy ngày hiện tại và ngày hôm qua
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const startDate = admin.firestore.Timestamp.fromDate(
      new Date(
        yesterday.getFullYear(),
        yesterday.getMonth(),
        yesterday.getDate(),
        0,
        0,
        0
      )
    );
    const endDate = admin.firestore.Timestamp.fromDate(
      new Date(
        yesterday.getFullYear(),
        yesterday.getMonth(),
        yesterday.getDate(),
        23,
        59,
        59
      )
    );

    // Lấy tất cả đơn hàng đã hoàn thành trong ngày hôm qua
    const ordersRef = db.collection("orders");
    const completedOrders = await ordersRef
      .where("status", "==", "completed")
      .where("completedAt", ">=", startDate)
      .where("completedAt", "<=", endDate)
      .get();

    // Tổng hợp dữ liệu
    let totalRevenue = 0;
    let orderCount = 0;
    const itemsSold = {};
    const categorySales = {};

    completedOrders.forEach((doc) => {
      const order = doc.data();
      totalRevenue += order.total;
      orderCount++;

      // Thống kê số lượng món bán được
      order.items.forEach((item) => {
        if (!itemsSold[item.id]) {
          itemsSold[item.id] = {
            id: item.id,
            name: item.name,
            quantity: 0,
            revenue: 0,
          };
        }
        itemsSold[item.id].quantity += item.quantity;
        itemsSold[item.id].revenue += item.price * item.quantity;
      });
    });

    // Lấy thông tin các giao dịch chi trong ngày
    const expenseTransactions = await db
      .collection("transactions")
      .where("type", "==", "expense")
      .where("date", ">=", startDate)
      .where("date", "<=", endDate)
      .get();

    let totalExpense = 0;
    expenseTransactions.forEach((doc) => {
      totalExpense += doc.data().amount;
    });

    // Top 5 món bán chạy
    const topSellingItems = Object.values(itemsSold)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Tạo báo cáo
    await db.collection("reports").add({
      id: db.collection("reports").doc().id,
      name: `Báo cáo ngày ${yesterday.getDate()}/${
        yesterday.getMonth() + 1
      }/${yesterday.getFullYear()}`,
      type: "daily",
      startDate: startDate,
      endDate: endDate,
      revenue: totalRevenue,
      costs: totalExpense,
      profit: totalRevenue - totalExpense,
      orderCount: orderCount,
      averageOrderValue: orderCount > 0 ? totalRevenue / orderCount : 0,
      topSellingItems: topSellingItems,
      createdBy: "system",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return null;
  });
```

## 7. Kết luận

Firebase Firestore kết hợp với Firebase Authentication, Storage, và Cloud Functions cung cấp một giải pháp toàn diện cho hệ thống quản lý nhà hàng với các ưu điểm:

1. **Đồng bộ thời gian thực**: Các cập nhật được phản ánh ngay lập tức trên tất cả các thiết bị kết nối, giúp nhân viên luôn cập nhật tình trạng đơn hàng, bàn ăn, và kho.

2. **Hoạt động offline**: Ứng dụng vẫn hoạt động khi mất kết nối internet, đảm bảo việc kinh doanh không bị gián đoạn.

3. **Bảo mật linh hoạt**: Hệ thống phân quyền chi tiết, kiểm soát truy cập chính xác theo vai trò người dùng.

4. **Tự động hóa**: Cloud Functions giúp tự động hóa các tác vụ như cập nhật kho, tạo báo cáo, và gửi thông báo.

5. **Khả năng mở rộng**: Cơ sở hạ tầng serverless tự động mở rộng theo nhu cầu sử dụng, phù hợp cho cả nhà hàng nhỏ và chuỗi nhà hàng lớn.

Với sự linh hoạt của Firestore, cấu trúc này có thể dễ dàng điều chỉnh theo yêu cầu cụ thể của từng nhà hàng và phát triển theo thời gian.
