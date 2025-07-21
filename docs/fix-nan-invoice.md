# 🔧 Hướng dẫn sửa lỗi hiển thị "NaN" trong hoá đơn

## Vấn đề
Hoá đơn hiển thị "NaN₫" thay vì số tiền chính xác cho:
- Thuế VAT (10%): NaN₫ 
- Giảm giá (LUNCH20): -NaN₫

## Nguyên nhân
- Orders cũ trong Firebase thiếu trường `subtotal`
- Các phép tính với giá trị `null` hoặc `undefined` tạo ra `NaN`

## Giải pháp đã triển khai

### 1. ✅ Sửa hàm `formatCurrency()`
```javascript
function formatCurrency(amount) {
  // Handle invalid values (NaN, null, undefined) and return "0₫"
  if (isNaN(amount) || amount == null) {
    return "0₫";
  }
  // Ensure amount is a number
  const validAmount = Number(amount) || 0;
  return new Intl.NumberFormat("vi-VN").format(validAmount) + "₫";
}
```

### 2. ✅ Sửa hàm `printInvoice()`
```javascript
// Ensure subtotal is a valid number to prevent NaN
const subtotal = Number(orderToPrint.subtotal || orderToPrint.total || 0);
const taxAmount = isCompleted ? 
  Number(orderToPrint.taxAmount || 0) : 
  Number((subtotal * VAT_RATE).toFixed(0));
```

### 3. ✅ Sửa hàm `updatePaymentSummary()`
```javascript
// Use subtotal if available, otherwise use total as base amount - ensure it's a valid number
const subtotal = Number(currentOrder.subtotal || currentOrder.total || 0);
// Calculate tax as exact amount - ensure result is valid number
const taxAmount = Number((subtotal * VAT_RATE).toFixed(0));
```

### 4. ✅ Sửa hàm `processPayment()`
```javascript
const subtotal = Number(currentOrder.subtotal || currentOrder.total || 0);
const taxAmount = Number((subtotal * VAT_RATE).toFixed(0));
const discountPercent = selectedDiscountCode
  ? Number(selectedDiscountCode.discount || 0)
  : 0;
```

## Cách sử dụng

### Kiểm tra và sửa orders cũ
1. Mở **Cashier Dashboard** 
2. Mở **Developer Console** (F12)
3. Chạy lệnh:
```javascript
fixOrdersWithoutSubtotal()
```

### Tạo orders mới để test
1. Mở `http://127.0.0.1:5500/create-sample-orders.html`
2. Click **"Tạo 5 đơn hàng ảo"**
3. Orders mới sẽ có đầy đủ `subtotal` và `total`

## Kết quả
- ✅ Hoá đơn hiển thị số tiền chính xác thay vì "NaN₫"
- ✅ Thuế VAT được tính đúng: `subtotal * 0.1`
- ✅ Giảm giá được tính đúng: `afterTax * discountPercent / 100`
- ✅ Tổng tiền được tính đúng: `afterTax - discountAmount`
- ✅ Không làm mất các function khác trong hệ thống

## Test
Chạy test để verify:
```bash
node test-nan-fix.js
```

## Backup đã được thực hiện
Tất cả các thay đổi đã:
- ✅ Giữ nguyên logic tính toán
- ✅ Không thay đổi cấu trúc dữ liệu
- ✅ Tương thích với PayOS integration  
- ✅ Tương thích với các function merge/split invoice

---
*Lưu ý: Nếu vẫn thấy "NaN₫", hãy chạy `fixOrdersWithoutSubtotal()` trong console để fix orders cũ.*
