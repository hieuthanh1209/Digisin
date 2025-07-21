# Tài liệu hướng dẫn: Hệ thống quản lý thuế suất

## Giới thiệu

Hệ thống quản lý thuế suất cho phép quản lý cài đặt thuế của nhà hàng và áp dụng thuế suất phù hợp cho từng đơn hàng dựa trên thời điểm đơn hàng được tạo. Hệ thống hỗ trợ lưu trữ lịch sử thay đổi thuế suất để đảm bảo tính chính xác khi tính toán.

## Tính năng chính

- **Thiết lập thuế suất**: Quản lý có thể cài đặt mức thuế mới với ngày áp dụng cụ thể
- **Lịch sử thuế**: Lưu trữ toàn bộ lịch sử thay đổi thuế suất
- **Áp dụng tự động**: Hệ thống tự động áp dụng mức thuế phù hợp dựa trên thời điểm tạo đơn hàng
- **Hiển thị thuế**: Hiển thị đúng mức thuế suất đã áp dụng cho từng đơn hàng

## Cách sử dụng

### 1. Truy cập cài đặt thuế

1. Đăng nhập vào hệ thống với tài khoản quản lý
2. Mở menu từ góc phải trên cùng (avatar người dùng)
3. Chọn "Cài đặt hệ thống"

### 2. Thiết lập thuế suất mới

1. Nhập mức thuế suất mới (ví dụ: 8.0%)
2. Chọn ngày và giờ áp dụng
3. Nhấn "Lưu thay đổi"

### 3. Xem lịch sử thuế

Trong giao diện cài đặt thuế, bạn có thể xem toàn bộ lịch sử thay đổi thuế suất, bao gồm:
- Mức thuế suất
- Thời điểm áp dụng

### 4. Áp dụng trong hệ thống

- **Đơn hàng mới**: Sẽ tự động áp dụng mức thuế mới nhất có hiệu lực tại thời điểm tạo đơn
- **Đơn hàng cũ**: Vẫn giữ nguyên mức thuế đã áp dụng tại thời điểm tạo đơn

## API JavaScript

Hệ thống cung cấp các hàm JavaScript sau để tích hợp với các tính năng khác:

```javascript
// Lấy mức thuế suất hiện tại
const currentRate = window.taxManager.getCurrentTaxRate();

// Lấy mức thuế suất tại một thời điểm cụ thể
const rateForDate = window.taxManager.getTaxRateForDate(orderDate);

// Tính thuế cho một số tiền dựa trên ngày đơn hàng
const taxAmount = window.taxManager.calculateTax(subtotal, orderDate);

// Lấy lịch sử thuế suất
const taxHistory = window.taxManager.getTaxHistory();
```

## Tích hợp với hệ thống đơn hàng

Khi tạo hóa đơn mới, sử dụng API để lấy mức thuế suất hiện tại:

```javascript
function createNewOrder() {
    // Lấy thời điểm hiện tại
    const orderDate = new Date();
    
    // Tính tổng tiền trước thuế
    const subtotal = calculateSubtotal();
    
    // Tính thuế dựa trên thời điểm đơn hàng
    const taxAmount = window.taxManager.calculateTax(subtotal, orderDate);
    
    // Tính tổng tiền sau thuế
    const total = subtotal + taxAmount;
    
    // Lưu thông tin thuế suất vào đơn hàng
    const taxRate = window.taxManager.getTaxRateForDate(orderDate);
    
    // Tạo đơn hàng với thông tin thuế
    const order = {
        items: [...],
        subtotal: subtotal,
        taxRate: taxRate,  // Lưu mức thuế suất áp dụng
        taxAmount: taxAmount,
        total: total,
        date: orderDate,
        // ...other order details
    };
    
    // Lưu đơn hàng vào hệ thống
    saveOrder(order);
}
```

## Lưu ý quan trọng

1. **Không sửa đổi thuế suất đã áp dụng**: Thuế suất đã áp dụng cho đơn hàng cũ sẽ không thay đổi khi bạn cập nhật mức thuế mới
2. **Lưu trữ**: Dữ liệu thuế suất được lưu trong localStorage của trình duyệt
3. **Sao lưu**: Cân nhắc sao lưu dữ liệu thuế suất định kỳ

## Xử lý sự cố

| Vấn đề | Giải pháp |
|--------|-----------|
| Không hiển thị lịch sử thuế | Kiểm tra localStorage có bị xóa không, hoặc thiết lập lại mức thuế |
| Mức thuế không áp dụng | Kiểm tra ngày áp dụng đã đến chưa |
| Lỗi tính toán | Kiểm tra định dạng số trong dữ liệu thuế |
