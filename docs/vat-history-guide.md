# Hướng dẫn sử dụng VAT History System

## Tổng quan

Hệ thống VAT History đảm bảo rằng khi quản lý thay đổi thuế suất VAT, các đơn hàng cũ sẽ giữ nguyên **cả thuế suất và label hiển thị** ban đầu, chỉ những đơn hàng mới sau thời điểm thay đổi mới áp dụng thuế suất và label mới.

## Các tính năng chính

### 1. Lưu trữ lịch sử thay đổi VAT
- Mỗi lần thay đổi thuế suất đều được ghi lại với timestamp
- Thông tin bao gồm: thuế suất mới, người thay đổi, lý do thay đổi
- Dữ liệu được lưu trong localStorage với key `vatRateHistory`

### 2. Tính toán thuế và label theo thời gian
- **Đơn hàng mới**: sử dụng thuế suất và label hiện tại
- **Đơn hàng cũ**: sử dụng thuế suất và label có hiệu lực tại thời điểm tạo đơn
- **Label preservation**: "Thuế VAT (8%)" sẽ giữ nguyên ngay cả khi thuế hiện tại là 10%
- Tự động xác định thuế suất và label phù hợp dựa trên timestamp

### 3. Migration tự động
- Dữ liệu đơn hàng cũ được tự động migrate để bao gồm VAT labels
- Fallback mechanisms cho các đơn hàng không có đầy đủ thông tin
- Helper functions để xử lý dữ liệu legacy

### 4. Giao diện quản lý
- **Manager Dashboard**: Cài đặt hệ thống → Lịch sử thay đổi thuế VAT
- **Demo Page**: `demo-vat-history.html` để kiểm tra tính năng
- **Label Test**: `test-vat-labels.html` để test việc bảo toàn label

## Hướng dẫn sử dụng

### Thay đổi thuế suất VAT

1. **Truy cập Manager Dashboard**
   - Đăng nhập với tài khoản quản lý
   - Click vào avatar → "Cài đặt hệ thống"

2. **Cập nhật thuế suất**
   - Nhập thuế suất mới (%)
   - Hệ thống hiển thị preview tác động
   - Click "Lưu cài đặt"

3. **Xác nhận thay đổi**
   - Hệ thống hiển thị thông báo xác nhận
   - Lịch sử thay đổi được cập nhật tự động

### Kiểm tra lịch sử VAT

1. **Trong Manager Dashboard**
   ```javascript
   // Xem lịch sử thay đổi
   const history = getVatRateHistory();
   console.log(history);
   ```

2. **Trong Demo Page**
   - Truy cập `http://localhost:8000/demo-vat-history.html`
   - Tạo đơn hàng test với thời gian khác nhau
   - Thay đổi thuế suất và quan sát tác động

### Kiểm tra tính toán đúng đắn

```javascript
// Lấy thuế suất cho đơn hàng cụ thể
const orderTimestamp = '2024-01-15T10:00:00Z';
const vatRate = getVatRateForOrder(orderTimestamp);

// Lấy label VAT cho đơn hàng
const order = { timestamp: orderTimestamp, vatLabel: "Thuế VAT (8%)" };
const label = getOrderVatLabel(order);

// Tính thuế cho đơn hàng cũ
const subtotal = 100000;
const vatAmount = calculateTax(subtotal, orderTimestamp);

// Tính lại đơn hàng với thuế lịch sử
const recalculatedOrder = recalculateOrderWithHistoricalVat(originalOrder);
```

### Migration và label preservation

```javascript
// Migration tự động cho dữ liệu cũ
migrateOrderVatLabels();

// Tạo label hiện tại
const currentLabel = getCurrentVatLabel(); // "Thuế VAT (10%)"

// Xác định label cho order cũ
const oldOrder = { timestamp: 1704031200000, vatLabel: "Thuế VAT (8%)" };
const preservedLabel = getOrderVatLabel(oldOrder); // "Thuế VAT (8%)"
```

## Cấu trúc dữ liệu

### VAT Rate History Entry
```javascript
{
  rate: 0.08,                          // Thuế suất (decimal)
  timestamp: "2024-01-15T10:00:00Z",   // Thời gian thay đổi
  changedBy: "Manager Name",           // Người thay đổi
  reason: "Tax policy update"          // Lý do thay đổi
}
```

### Order Data with VAT
```javascript
{
  id: "ORDER-001",
  items: [...],
  timestamp: "2024-01-15T10:00:00Z",   // Thời gian tạo đơn
  subtotal: 100000,
  vatRate: 0.08,                       // Thuế suất áp dụng
  vatAmount: 8000,                     // Số tiền thuế
  total: 108000,
  historicalCalculation: true          // Đánh dấu tính toán lịch sử
}
```

## API Functions

### Core Functions

#### `getCurrentVatRate()`
Lấy thuế suất VAT hiện tại từ system settings.

```javascript
const currentRate = getCurrentVatRate(); // 0.08 (8%)
```

#### `getVatRateForOrder(orderTimestamp)`
Lấy thuế suất VAT có hiệu lực tại thời điểm tạo đơn hàng.

```javascript
const orderRate = getVatRateForOrder('2024-01-15T10:00:00Z');
```

#### `recordVatRateChange(newRate, changedBy, reason)`
Ghi lại thay đổi thuế suất VAT.

```javascript
recordVatRateChange(0.10, 'Manager', 'Government policy change');
```

#### `calculateTax(subtotal, orderTimestamp?)`
Tính số tiền thuế. Có thể chỉ định timestamp để sử dụng thuế lịch sử.

```javascript
// Thuế hiện tại
const currentTax = calculateTax(100000);

// Thuế lịch sử
const historicalTax = calculateTax(100000, '2024-01-15T10:00:00Z');
```

#### `recalculateOrderWithHistoricalVat(order)`
Tính lại đơn hàng với thuế suất lịch sử.

```javascript
const recalculatedOrder = recalculateOrderWithHistoricalVat(originalOrder);
```

### Helper Functions

#### `getVatRateHistory()`
Lấy toàn bộ lịch sử thay đổi thuế VAT.

#### `formatCurrency(amount)`
Format số tiền theo định dạng tiền tệ.

#### `updateVatLabels()`
Cập nhật tất cả label VAT trên trang hiện tại.

## Testing & Validation

### 1. Kiểm tra chức năng cơ bản
```javascript
// Test 1: Tạo đơn hàng mới
const newOrder = createOrderWithVat([...items]);
console.assert(newOrder.vatRate === getCurrentVatRate());

// Test 2: Thay đổi thuế suất
const oldRate = getCurrentVatRate();
recordVatRateChange(0.10, 'Test', 'Testing');
console.assert(getCurrentVatRate() === 0.10);

// Test 3: Kiểm tra đơn hàng cũ
const oldOrderVat = getVatRateForOrder(oldTimestamp);
console.assert(oldOrderVat === oldRate);
```

### 2. Demo với dữ liệu test
Sử dụng `demo-vat-history.html` để:
- Tạo đơn hàng với thời gian khác nhau
- Thay đổi thuế suất nhiều lần
- Kiểm tra tính toán tự động
- Xem lịch sử thay đổi

### 3. Kiểm tra cross-component
- Tạo đơn hàng trong Waiter Dashboard
- Thay đổi VAT trong Manager Dashboard
- Xem lịch sử trong Cashier History

## Troubleshooting

### Lỗi thường gặp

1. **"getVatRateForOrder is not a function"**
   - Đảm bảo `vat-manager.js` được load trước
   - Kiểm tra đường dẫn script

2. **VAT rate không chính xác cho đơn hàng cũ**
   - Kiểm tra timestamp của đơn hàng
   - Xác minh lịch sử VAT trong localStorage

3. **Lịch sử VAT bị mất**
   - Kiểm tra localStorage key `vatRateHistory`
   - Backup/restore dữ liệu khi cần

### Debug Commands

```javascript
// Kiểm tra dữ liệu
console.log('VAT History:', getVatRateHistory());
console.log('Current Settings:', JSON.parse(localStorage.getItem('systemSettings')));

// Reset dữ liệu
localStorage.removeItem('vatRateHistory');
localStorage.removeItem('systemSettings');

// Tạo dữ liệu test
recordVatRateChange(0.08, 'System', 'Initial setup');
recordVatRateChange(0.10, 'Manager', 'Tax increase');
```

## Backup & Recovery

### Backup dữ liệu VAT
```javascript
const vatBackup = {
  history: getVatRateHistory(),
  settings: JSON.parse(localStorage.getItem('systemSettings')),
  timestamp: new Date().toISOString()
};

// Xuất backup
console.log('VAT Backup:', JSON.stringify(vatBackup, null, 2));
```

### Restore dữ liệu
```javascript
// Import backup
const backupData = { /* backup data */ };

localStorage.setItem('vatRateHistory', JSON.stringify(backupData.history));
localStorage.setItem('systemSettings', JSON.stringify(backupData.settings));

// Refresh UI
loadSystemSettings();
loadVatHistoryDisplay();
```

## Best Practices

1. **Luôn ghi lý do thay đổi VAT** để dễ audit sau này
2. **Backup dữ liệu trước khi thay đổi** thuế suất quan trọng
3. **Test thoroughly** với dữ liệu demo trước khi apply production
4. **Monitor performance** khi có nhiều entry trong lịch sử VAT
5. **Regular cleanup** các entry cũ không cần thiết (sau 1-2 năm)

## Support

Nếu gặp vấn đề:
1. Kiểm tra console browser để xem lỗi JavaScript
2. Xác minh dữ liệu trong localStorage
3. Test với demo page để isolate issues
4. Liên hệ team development để hỗ trợ
