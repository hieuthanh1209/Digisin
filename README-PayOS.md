# 💳 Tích hợp PayOS - Hệ thống Quản lý Nhà hàng

## 📋 Tổng quan

PayOS đã được tích hợp thành công vào hệ thống quản lý nhà hàng, cho phép thanh toán trực tuyến qua:
- 📱 Quét mã QR
- 🏦 Chuyển khoản ngân hàng
- 💳 Thanh toán điện tử

## 🚀 Khởi chạy Hệ thống

### 1. Chạy Frontend Server (Port 8000)
```bash
python -m http.server 8000
```

### 2. Chạy PayOS Backend Server (Port 3000)
```bash
node payos-server.js
```

### 3. Truy cập ứng dụng
- **Trang chủ**: http://localhost:8000
- **Thu ngân**: http://localhost:8000/dashboard/cashier-dashboard.html
- **PayOS API**: http://localhost:3000/api/payos

## 💰 Cách sử dụng PayOS

### Từ giao diện Thu ngân:

1. **Chọn đơn hàng** cần thanh toán
2. **Nhấn "Thanh toán"** để mở modal
3. **Chọn "PayOS (QR Code/Banking)"** từ dropdown
4. **Nhập thông tin khách hàng** (tùy chọn):
   - Email khách hàng
   - Số điện thoại
5. **Nhấn "Thanh toán với PayOS"**
6. **Hệ thống sẽ chuyển hướng** đến trang PayOS
7. **Khách hàng quét QR** hoặc chuyển khoản
8. **Hệ thống tự động cập nhật** sau khi thanh toán

### Xử lý kết quả:
- ✅ **Thành công**: Đơn hàng được đánh dấu "Đã thanh toán"
- ❌ **Thất bại**: Hiển thị thông báo lỗi
- 🚫 **Hủy**: Quay về trang Thu ngân

## 🔧 Cấu hình

### PayOS Credentials
Cập nhật trong `config/payos-config.js` và `payos-server.js`:
```javascript
const payOS = new PayOS(
  "YOUR_CLIENT_ID",        // Client ID từ PayOS
  "YOUR_API_KEY",          // API Key từ PayOS
  "YOUR_CHECKSUM_KEY"      // Checksum Key từ PayOS
);
```

### URLs
```javascript
RETURN_URL: "http://localhost:8000/dashboard/cashier-dashboard.html",
CANCEL_URL: "http://localhost:8000/dashboard/cashier-dashboard.html"
```

## 🧪 Kiểm tra Hệ thống

### Test PayOS Integration:
```bash
node test-payos-integration.js
```

### Health Check:
```bash
curl http://localhost:3000/health
```

### Test Payment API:
```bash
curl -X POST http://localhost:3000/api/payos/create-payment \
  -H "Content-Type: application/json" \
  -d '{
    "orderCode": 123456,
    "amount": 50000,
    "description": "Test payment"
  }'
```

## ⚡ Các tính năng mới

### 1. Modal PayOS Processing
- Hiển thị loading khi tạo payment link
- Thông báo bảo mật bởi PayOS
- Nút hủy thanh toán

### 2. Xử lý Return từ PayOS
- Tự động phát hiện kết quả thanh toán
- Cập nhật Firebase và tài chính
- Hiển thị modal kết quả

### 3. Thông tin khách hàng
- Email (tùy chọn)
- Số điện thoại (tùy chọn)
- Validation format

### 4. In hóa đơn PayOS
- Hỗ trợ in hóa đơn sau thanh toán PayOS
- Hiển thị thông tin PayOS trên hóa đơn

## 📊 API Endpoints

### POST `/api/payos/create-payment`
Tạo liên kết thanh toán

### GET `/api/payos/get-payment?orderCode=xxx`
Lấy thông tin thanh toán

### POST `/api/payos/cancel-payment`
Hủy thanh toán

### POST `/api/payos/webhook`
Webhook từ PayOS

## 🛡️ Bảo mật

- ✅ CORS được cấu hình đúng
- ✅ Validate input data
- ✅ Error handling
- ✅ Timeout protection
- ✅ Amount validation (1,000 - 500,000,000 VND)

## ⚠️ Lưu ý quan trọng

1. **Mô tả đơn hàng**: Tối đa 25 ký tự
2. **OrderCode**: Phải là số duy nhất
3. **Amount**: Số nguyên, không có số thập phân
4. **Server**: PayOS server phải chạy trước khi test
5. **Credentials**: Sử dụng sandbox cho development

## 🐛 Troubleshooting

### Lỗi CORS
- Kiểm tra server PayOS chạy port 3000
- Frontend chạy port 8000

### Lỗi Credentials
- Kiểm tra Client ID, API Key, Checksum Key
- Đảm bảo kênh thanh toán đã kích hoạt

### Lỗi Amount
- Số tiền phải 1,000 - 500,000,000 VND
- Phải là số nguyên

### Lỗi Description
- Mô tả tối đa 25 ký tự
- Không ký tự đặc biệt

## 🎯 Kết quả đạt được

✅ **Tích hợp hoàn chỉnh** PayOS vào hệ thống<br>
✅ **Không làm mất** các chức năng hiện có<br>
✅ **Giao diện thân thiện** với user<br>
✅ **Xử lý lỗi** và validation đầy đủ<br>
✅ **Test case** và documentation<br>
✅ **Production ready** với proper error handling<br>

## 📞 Hỗ trợ

- **PayOS Docs**: https://payos.vn/docs
- **PayOS Support**: support@payos.vn
- **Project Issues**: Check console logs

---

**🎉 PayOS đã sẵn sàng sử dụng trong hệ thống quản lý nhà hàng!**
