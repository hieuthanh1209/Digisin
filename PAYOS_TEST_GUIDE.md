# Hướng Dẫn Test PayOS với Live Server

## 🎯 **Bước 0: Tạo đơn hàng ảo (Quan trọng!)**

Trước khi test PayOS, bạn cần có đơn hàng để thanh toán:

### Cách 1: Tạo đơn hàng ảo tự động
1. **Mở file:** `http://127.0.0.1:5500/create-sample-orders.html`
2. **Click nút:** "📝 Tạo 5 đơn hàng ảo"
3. **Đợi hoàn thành:** Sẽ tạo 5 đơn hàng demo
4. **Reload cashier dashboard** để thấy đơn hàng mới

### Cách 2: Tạo bằng console
1. **Mở:** `http://127.0.0.1:5500/create-sample-orders.html`
2. **Mở F12 Console**
3. **Chạy lệnh:** `createSampleOrders()`

## ⚠️ QUAN TRỌNG: Debug PayOS Return Issue

Nếu bạn thấy popup "Thất bại" mặc dù thanh toán thành công, hãy làm theo các bước debug sau:

### Quick Test UI (Không cần Firebase):

1. **Mở F12 Developer Tools** trước khi test
2. **Vào tab Console** để xem log messages
3. **Test popup success:**
   ```javascript
   testPayOSSuccessUI();
   ```
4. **Test popup failure:**
   ```javascript
   testPayOSFailureUI();
   ```

### Advanced Test (Với Firebase - cần có pending orders):

```javascript
// Test với đơn hàng thật (cần có pending order)
testPayOSSuccess();

// Test hủy thanh toán
testPayOSCancel();

// Kiểm tra server
testPayOSServer();

// Kiểm tra localStorage
checkPayOSStorage();

// Clear localStorage nếu cần
clearPayOSStorage();
```

## Bước 1: Chạy PayOS Server

```bash
cd "d:\DevProject\CNPMLT"
node payos-pure-server.js
```

Server sẽ chạy trên port 3000 với các endpoint:
- `http://localhost:3000/health` - Health check
- `http://localhost:3000/api/test-cors` - Test CORS
- `http://localhost:3000/api/payos/create-payment` - Tạo thanh toán PayOS
- `http://localhost:3000/api/payos/get-payment` - Lấy thông tin thanh toán
- `http://localhost:3000/api/payos/cancel-payment` - Hủy thanh toán
- `http://localhost:3000/api/payos/webhook` - PayOS webhook

## Bước 2: Chạy Live Server

1. Mở `index.html` hoặc `dashboard/cashier-dashboard.html` bằng VS Code
2. Click chuột phải và chọn "Open with Live Server"
3. Live Server sẽ chạy trên `http://127.0.0.1:5500`

## Bước 3: Test PayOS Integration

1. **Truy cập Cashier Dashboard:**
   ```
   http://127.0.0.1:5500/dashboard/cashier-dashboard.html
   ```

2. **Tạo đơn hàng mới (nếu chưa có):**
   - Mở `http://127.0.0.1:5500/create-sample-orders.html`
   - Click "📝 Tạo 5 đơn hàng ảo"
   - Đợi script tạo xong
   - Reload cashier dashboard

3. **Chọn đơn hàng để thanh toán:**
   - Chọn một đơn hàng từ danh sách "Hóa đơn chờ thanh toán"
   - Nhấn "Thanh toán"

4. **Chọn PayOS payment:**
   - Trong modal thanh toán, chọn "PayOS" từ dropdown
   - Điền thông tin khách hàng (tùy chọn):
     - Email: test@example.com
     - Số điện thoại: 0123456789
   - Nhấn "Thanh toán với PayOS"

4. **Xác nhận thanh toán:**
   - Modal PayOS sẽ hiển thị với QR code và link thanh toán
   - Click "Mở trang thanh toán" để test

5. **Debug nếu có lỗi:**
   - Mở F12 Console
   - Chạy `testPayOSSuccess()` để test popup thành công
   - Kiểm tra log messages để tìm lỗi

## Bước 4: Test CORS

Kiểm tra CORS hoạt động bằng Developer Tools:
1. Mở F12 trong browser
2. Vào tab Console
3. Chạy lệnh test:

```javascript
fetch('http://localhost:3000/api/test-cors', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log('CORS test success:', data))
.catch(error => console.error('CORS test error:', error));
```

Nếu thành công, bạn sẽ thấy:
```json
{
  "message": "CORS test successful from Pure Node.js server",
  "origin": "http://127.0.0.1:5500",
  "timestamp": "2025-07-20T04:37:06.638Z",
  "method": "GET"
}
```

## Debug Commands

Trong Console, bạn có các command debug:

```javascript
// Test server connection
testPayOSServer();

// Test successful payment popup (UI only - safe)
testPayOSSuccessUI();

// Test failed payment popup (UI only - safe)  
testPayOSFailureUI();

// Test with real pending order (needs existing order)
testPayOSSuccess();

// Test cancelled payment popup
testPayOSCancel();

// Check what's stored in localStorage
checkPayOSStorage();

// Clear all PayOS data from localStorage
clearPayOSStorage();
```

## Troubleshooting

### Nếu popup hiển thị "Thất bại" mặc dù server log thành công:

1. **Kiểm tra Console log:**
   ```javascript
   // Trong Console, xem có error gì không
   console.log('Checking errors...');
   ```

2. **Test popup thành công:**
   ```javascript
   testPayOSSuccess();
   ```

3. **Kiểm tra URL return parameters:**
   - PayOS có thể return với parameters khác
   - Code đã được cập nhật để handle trường hợp này

4. **Clear cache và reload:**
   - Ctrl+F5 để hard refresh
   - Clear localStorage: `clearPayOSStorage()`

### Nếu gặp CORS error:
1. Đảm bảo PayOS server đang chạy trên port 3000
2. Kiểm tra server log để xem request có đến không
3. Thử restart server và Live Server

### Nếu không tạo được thanh toán:
1. Kiểm tra Console log trong browser
2. Kiểm tra server log
3. Đảm bảo số tiền >= 1,000 VND và <= 500,000,000 VND

### Commands hữu ích:

```bash
# Kiểm tra server có chạy không
curl http://localhost:3000/health

# Test CORS
curl -X OPTIONS http://localhost:3000/api/test-cors -H "Origin: http://127.0.0.1:5500" -v

# Dừng server
Ctrl+C

# Dừng tất cả Node.js processes
taskkill /F /IM node.exe
```

## Các tính năng đã tích hợp:

✅ **CORS hoàn chỉnh** - Hỗ trợ Live Server (127.0.0.1:5500)
✅ **PayOS integration** - Tạo, hủy, webhook thanh toán  
✅ **Error handling** - Xử lý lỗi chi tiết
✅ **Validation** - Kiểm tra dữ liệu đầu vào
✅ **Logging** - Log chi tiết cho debugging
✅ **Firebase integration** - Lưu order vào Firestore
✅ **UI responsive** - Modal, notification
✅ **Debug functions** - Test popup và debug issues

## Kết quả mong đợi:

- Live Server chạy được mà không gặp CORS error
- Tạo được payment link PayOS thành công  
- Modal hiển thị đúng SUCCESS khi thanh toán thành công
- Modal hiển thị đúng FAILURE khi thanh toán thất bại
- Tất cả function cũ trong hệ thống vẫn hoạt động bình thường

## Log Examples:

**Thành công:**
```
[PayOS Init] URL has PayOS parameters, processing return...
[PayOS Return] URL Parameters: {code: "00", status: "PAID", orderCode: "123"}
[PayOS Return] Payment assessment: {isSuccessful: true, reasoning: "No error code or positive indicators"}
[PayOS Success] Processing successful payment...
```

**Thất bại:**
```
[PayOS Return] URL Parameters: {code: "01", status: "FAILED"}  
[PayOS Return] Payment assessment: {isSuccessful: false, reasoning: "Error code or negative status detected"}
```
