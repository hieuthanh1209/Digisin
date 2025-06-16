# Hướng dẫn triển khai Firebase Firestore cho Hệ thống Quản lý Nhà hàng

## Giới thiệu

Tài liệu này trình bày các bước triển khai hệ thống quản lý nhà hàng trên Firebase Firestore. Hệ thống đã được thiết kế sẵn phần frontend, giờ đây chúng ta sẽ kết nối với backend Firestore.

## Các bước triển khai

### 1. Tạo dự án Firebase

1. Truy cập [Firebase Console](https://console.firebase.google.com/)
2. Nhấn "Add project" và đặt tên cho dự án, ví dụ: "restaurant-management-system"
3. Làm theo các bước để hoàn thành việc tạo dự án (bạn có thể tắt Google Analytics nếu không cần)

### 2. Kích hoạt Firebase Authentication

1. Trong Firebase Console, chọn dự án của bạn
2. Truy cập menu "Authentication" > tab "Sign-in method"
3. Kích hoạt phương thức "Email/Password"

### 3. Kích hoạt Firestore Database

1. Truy cập menu "Firestore Database"
2. Nhấn "Create database"
3. Chọn chế độ "Start in production mode"
4. Chọn vị trí lưu trữ gần với người dùng của bạn (ví dụ: asia-southeast1 cho Việt Nam)

### 4. Kích hoạt Firebase Storage

1. Truy cập menu "Storage"
2. Nhấn "Get started"
3. Chọn chế độ "Start in production mode"
4. Chọn vị trí lưu trữ tương tự như Firestore

### 5. Cấu hình Firebase trong ứng dụng

1. Truy cập mục "Project settings" (biểu tượng bánh răng)
2. Trong tab "General", cuộn xuống phần "Your apps"
3. Nhấn biểu tượng Web (</>) để thêm ứng dụng web
4. Đặt tên cho ứng dụng, ví dụ: "restaurant-management-web"
5. Sao chép mã cấu hình Firebase được cung cấp
6. Thay thế mã cấu hình trong tệp `config/firebase-config.js`

```javascript
// Thay đổi thông tin cấu hình này bằng thông tin từ Firebase Console
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

export default firebaseConfig;
```

### 6. Khởi tạo dữ liệu mẫu

1. Sau khi cấu hình Firebase xong, mở trang web của ứng dụng
2. Nhấp vào liên kết "Khởi tạo dữ liệu Firebase" ở góc dưới cùng bên phải của trang đăng nhập
3. Trang "Khởi tạo dữ liệu Firebase" sẽ mở ra, hiển thị thông tin về dữ liệu sẽ được tạo
4. Nhấn nút "Khởi tạo dữ liệu" để bắt đầu quá trình tạo dữ liệu mẫu
5. Chờ quá trình hoàn tất (sẽ thấy các thông báo trong khung trạng thái)

### 7. Triển khai Firestore Rules và Indexes

1. Cài đặt Firebase CLI nếu chưa có:

   ```
   npm install -g firebase-tools
   ```

2. Đăng nhập vào Firebase:

   ```
   firebase login
   ```

3. Khởi tạo dự án Firebase:

   ```
   firebase init
   ```

   Chọn các dịch vụ: Firestore, Storage và Hosting. Sử dụng các tệp cấu hình có sẵn.

4. Triển khai luật và chỉ mục:
   ```
   firebase deploy --only firestore:rules,firestore:indexes
   ```

## Cấu trúc dữ liệu

Hệ thống sử dụng các collection sau:

1. **users** - Thông tin người dùng
2. **menu_items** - Danh sách món ăn
3. **inventory** - Nguyên liệu trong kho
4. **tables** - Thông tin bàn ăn
5. **orders** - Đơn hàng
6. **transactions** - Giao dịch thu chi
7. **inventory_history** - Lịch sử nhập xuất kho
8. **reports** - Báo cáo
9. **settings** - Cấu hình hệ thống
10. **notifications** - Thông báo hệ thống

Chi tiết về cấu trúc của từng collection, vui lòng tham khảo tệp `Firebase-FirestorePlan.md`.

## Các tài khoản demo

Hệ thống được tạo sẵn với 8 tài khoản demo:

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

## Xử lý hình ảnh

- **Món ăn**: Hình ảnh món ăn được lưu trữ trong Firebase Storage tại đường dẫn `menu_items/{menuItemId}`
- **Hình ảnh người dùng**: Hệ thống sử dụng placeholder từ dịch vụ UI Avatars cho hình ảnh người dùng

## Vấn đề cần lưu ý

1. **Bảo mật**: Firestore Rules đã được thiết lập để phân quyền theo vai trò, nhưng trong môi trường sản xuất thực tế nên cân nhắc thêm các biện pháp bảo mật khác.

2. **Hiệu suất**: Các chỉ mục (indexes) đã được thiết lập cho các truy vấn phổ biến, nhưng có thể cần thêm chỉ mục tùy thuộc vào cách sử dụng thực tế.

3. **Chi phí**: Lưu ý về giới hạn và chi phí khi sử dụng các dịch vụ Firebase trong môi trường sản xuất.

4. **Sao lưu dữ liệu**: Thiết lập sao lưu dữ liệu định kỳ để tránh mất dữ liệu.

## Hỗ trợ và tài liệu tham khảo

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
- [Firebase Storage Documentation](https://firebase.google.com/docs/storage)
