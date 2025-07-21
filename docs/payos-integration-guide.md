# Hướng dẫn Tích hợp PayOS

## Tổng quan
PayOS đã được tích hợp vào hệ thống quản lý nhà hàng, cho phép khách hàng thanh toán qua QR Code hoặc chuyển khoản ngân hàng.

## Cài đặt và Chạy Server PayOS

### 1. Cài đặt Dependencies
```bash
# Cài đặt các package cần thiết cho PayOS server
npm install --save @payos/node cors express

# Hoặc sử dụng package.json đã tạo sẵn
cp payos-package.json package-payos.json
cd . && npm install --prefix . --package-lock-only --save @payos/node cors express
```

### 2. Chạy Server PayOS
```bash
# Chạy server PayOS trên port 3000
node payos-server.js

# Hoặc với nodemon để auto-reload
npm install -g nodemon
nodemon payos-server.js
```

### 3. Chạy Frontend (HTTP Server)
```bash
# Chạy static file server trên port 8000 (đã có sẵn)
python -m http.server 8000
```

## Cấu hình PayOS

### 1. Credentials
Trong file `config/payos-config.js` và `payos-server.js`, cập nhật các thông tin sau với credentials thực tế của bạn:

```javascript
const payOS = new PayOS(
  "YOUR_CLIENT_ID",        // Thay bằng Client ID thực tế
  "YOUR_API_KEY",          // Thay bằng API Key thực tế  
  "YOUR_CHECKSUM_KEY"      // Thay bằng Checksum Key thực tế
);
```

### 2. URLs
Cập nhật URLs trong `config/payos-config.js`:
```javascript
RETURN_URL: "http://localhost:8000/dashboard/cashier-dashboard.html",
CANCEL_URL: "http://localhost:8000/dashboard/cashier-dashboard.html",
```

## Cách sử dụng PayOS trong hệ thống

### 1. Thanh toán PayOS
1. Tại trang Thu ngân, chọn đơn hàng cần thanh toán
2. Nhấn "Thanh toán" để mở modal thanh toán
3. Chọn phương thức "PayOS (QR Code/Banking)"
4. Nhập email và số điện thoại khách hàng (tùy chọn)
5. Nhấn "Thanh toán với PayOS"
6. Hệ thống sẽ chuyển hướng đến trang PayOS
7. Khách hàng quét QR hoặc chuyển khoản
8. Sau khi thanh toán, hệ thống tự động cập nhật trạng thái

### 2. Xử lý kết quả thanh toán
- **Thành công**: Đơn hàng được đánh dấu "Đã thanh toán", tạo giao dịch tài chính
- **Thất bại**: Hiển thị thông báo lỗi, đơn hàng vẫn ở trạng thái chờ thanh toán
- **Hủy**: Khách hàng hủy thanh toán, quay về trang Thu ngân

### 3. In hóa đơn
Sau khi thanh toán thành công qua PayOS, có thể in hóa đơn như bình thường.

## API Endpoints

### POST /api/payos/create-payment
Tạo liên kết thanh toán PayOS

**Request Body:**
```javascript
{
  "orderCode": 123456,
  "amount": 50000,
  "description": "Thanh toán đơn hàng Bàn 1",
  "returnUrl": "http://localhost:8000/dashboard/cashier-dashboard.html",
  "cancelUrl": "http://localhost:8000/dashboard/cashier-dashboard.html",
  "items": [
    {
      "name": "Phở bò",
      "quantity": 1,
      "price": 50000
    }
  ],
  "buyerEmail": "customer@example.com",
  "buyerPhone": "0123456789"
}
```

**Response:**
```javascript
{
  "success": true,
  "checkoutUrl": "https://pay.payos.vn/web/...",
  "paymentLinkId": "...",
  "orderCode": 123456,
  "qrCode": "data:image/png;base64,..."
}
```

### GET /api/payos/get-payment/:orderCode
Lấy thông tin thanh toán

### POST /api/payos/cancel-payment
Hủy thanh toán

## Troubleshooting

### 1. Lỗi CORS
Nếu gặp lỗi CORS, đảm bảo:
- Server PayOS đang chạy trên port 3000
- Frontend đang chạy trên port 8000
- CORS đã được cấu hình đúng trong `payos-server.js`

### 2. Lỗi Credentials
- Kiểm tra Client ID, API Key, Checksum Key
- Đảm bảo sử dụng credentials từ môi trường production
- Kiểm tra kênh thanh toán đã được kích hoạt

### 3. Lỗi Amount
- Số tiền phải là số nguyên dương
- Tối thiểu 1,000 VND, tối đa 500,000,000 VND
- Không được chứa số thập phân

### 4. Lỗi OrderCode
- OrderCode phải là số duy nhất
- Không được trùng với các đơn hàng khác
- Hệ thống tự động tạo từ timestamp

## Kiểm tra hệ thống

### 1. Health Check
```bash
curl http://localhost:3000/health
```

### 2. Test Payment
```bash
curl -X POST http://localhost:3000/api/payos/create-payment \
  -H "Content-Type: application/json" \
  -d '{
    "orderCode": 123456,
    "amount": 50000,
    "description": "Test payment"
  }'
```

## Ghi chú quan trọng

1. **Bảo mật**: Không commit credentials thực tế vào Git
2. **Testing**: Sử dụng sandbox credentials cho development
3. **Production**: Đảm bảo HTTPS cho production environment
4. **Logging**: Kiểm tra logs server để debug các vấn đề
5. **Backup**: Lưu trữ dữ liệu thanh toán quan trọng

## Liên hệ hỗ trợ
- PayOS Documentation: https://payos.vn/docs
- PayOS Support: support@payos.vn
