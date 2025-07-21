# 🏪 Hệ Thống Cài Đặt Thuế VAT

## 📋 Mô Tả
Tính năng "Cài đặt hệ thống" cho phép quản lý điều chỉnh thuế suất VAT và các cài đặt khác trên toàn bộ hệ thống nhà hàng.

## ✨ Tính Năng Chính

### 🎛️ Cài Đặt Thuế VAT
- **Điều chỉnh thuế suất**: Thay đổi % thuế VAT từ 0% đến 100%
- **Xem trước tác động**: Hiển thị ví dụ tính toán với thuế suất mới
- **Áp dụng toàn hệ thống**: Thuế suất mới sẽ được áp dụng cho tất cả đơn hàng mới
- **Lưu trữ bền vững**: Cài đặt được lưu trong localStorage và Firebase

### 🔧 Cài Đặt Kinh Doanh
- **Số bàn tối đa/nhân viên**: Giới hạn bàn phục vụ cho mỗi nhân viên
- **Thời gian chờ đơn hàng**: Thời gian tối đa chờ xử lý đơn hàng (phút)
- **Giảm giá tối đa**: Phần trăm giảm giá tối đa cho phép
- **Ngưỡng cảnh báo tồn kho**: Phần trăm cảnh báo khi tồn kho thấp

### 💼 Cài Đặt Ứng Dụng
- **Tiền tệ**: Chọn đơn vị tiền tệ (VNĐ, USD, EUR)
- **Định dạng ngày**: Chọn format hiển thị ngày

## 🚀 Cách Sử Dụng

### Truy Cập Cài Đặt
1. Đăng nhập với tài khoản Manager
2. Click vào avatar ở góc phải trên cùng
3. Chọn "Cài đặt hệ thống" từ dropdown menu

### Thay Đổi Thuế VAT
1. Trong modal "Cài đặt hệ thống", tìm mục "Cài đặt thuế"
2. Nhập thuế suất mới vào ô "Thuế suất VAT (%)"
3. Xem trước tác động trong phần "Xem trước tác động"
4. Click "Lưu cài đặt" để áp dụng

### Test Tính Năng
1. Mở `test-system-settings.html` để test tính năng
2. Thử các mức thuế khác nhau
3. Kiểm tra tính toán tự động
4. Xem event log để theo dõi các thay đổi

## 🔄 API và Integration

### JavaScript Functions
```javascript
// Lấy cài đặt hiện tại
const settings = getSystemSettings();

// Lấy thuế suất hiện tại
const vatRate = getCurrentVatRate();

// Tính thuế cho một số tiền
const taxAmount = calculateTax(subtotal);

// Tính tổng tiền bao gồm thuế
const total = calculateTotalWithTax(subtotal);

// Lưu cài đặt mới
saveSystemSettings(newSettings);
```

### Event Listeners
```javascript
// Lắng nghe thay đổi cài đặt
window.addEventListener('systemSettingsUpdated', function(event) {
    console.log('Settings updated:', event.detail);
    // Cập nhật UI hoặc tính toán lại
});
```

### localStorage Structure
```json
{
  "systemSettings": {
    "business": {
      "vatRate": 0.08,
      "maxTablesPerWaiter": 6,
      "orderTimeout": 30,
      "maxDiscountPercent": 50,
      "inventoryVarianceThreshold": 10
    },
    "ui": {
      "currency": "VNĐ",
      "dateFormat": "DD/MM/YYYY"
    }
  }
}
```

## 📊 Firebase Integration

### Collection: `systemConfig`
```javascript
// Document ID: "settings"
{
  business: {
    vatRate: 0.08,
    maxTablesPerWaiter: 6,
    orderTimeout: 30,
    maxDiscountPercent: 50,
    inventoryVarianceThreshold: 10
  },
  ui: {
    currency: "VNĐ",
    dateFormat: "DD/MM/YYYY"
  },
  updatedAt: Timestamp,
  updatedBy: "Manager Name"
}
```

## 🧪 Testing

### Test Files
- `test-system-settings.html`: Trang test tương tác
- Mở http://localhost:8000/test-system-settings.html

### Test Cases
1. **Thay đổi thuế VAT**: Test các mức thuế khác nhau
2. **Tính toán chính xác**: Verify công thức tính thuế
3. **Lưu trữ bền vững**: Refresh page và kiểm tra settings
4. **Event propagation**: Test các component nhận được thông báo
5. **Integration**: Test với manager dashboard

## 🔒 Security & Validation

### Validation Rules
- Thuế VAT: 0% - 100%
- Số bàn/nhân viên: 1 - 20
- Thời gian chờ: 5 - 120 phút
- Giảm giá tối đa: 0% - 100%
- Ngưỡng tồn kho: 1% - 50%

### Access Control
- Chỉ Manager mới có quyền thay đổi cài đặt hệ thống
- Validation ở cả client và server side
- Backup settings trước khi thay đổi

## 📱 Responsive Design
- Modal tối ưu cho mobile và desktop
- Form responsive với Bootstrap 5
- Icons từ Lucide cho UI hiện đại

## 🔧 Maintenance

### Debug
```javascript
// Enable debug mode
localStorage.setItem('systemSettingsDebug', 'true');

// View current settings
console.log(getSystemSettings());

// Reset to defaults
resetToDefaults();
```

### Monitoring
- Event log trong test page
- Console logging cho development
- Firebase audit trail cho production

## 📞 Support
- File này cung cấp hướng dẫn đầy đủ về tính năng
- Sử dụng test page để kiểm tra functionality
- Check console để debug các vấn đề

---
*Tính năng được phát triển cho hệ thống quản lý nhà hàng CNPMLT*
