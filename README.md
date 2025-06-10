# 🍽️ Restaurant Management System

Hệ thống quản lý nhà hàng hoàn chỉnh với giao diện web responsive, được xây dựng bằng HTML, CSS, JavaScript và Bootstrap.

## ✨ Tính năng chính

- **4 Dashboard riêng biệt**: Waiter, Chef, Cashier, Manager
- **Giao diện responsive**: Hoạt động tốt trên mọi thiết bị
- **Quản lý đơn hàng real-time**: Theo dõi trạng thái đơn hàng trực tiếp
- **Hệ thống thanh toán**: Với PayOS QR, mã giảm giá và in hóa đơn
- **🆕 PayOS QR Payment**: Thanh toán bằng VietQR tích hợp PayOS
- **Báo cáo và thống kê**: Export Excel, analytics chi tiết
- **Quản lý nhân viên**: CRUD operations hoàn chỉnh
- **Kiểm soát kho**: Theo dõi nguyên liệu với cảnh báo

## 🏗️ Cấu trúc dự án

```
CNPMLT/
├── public/                          # Static assets & entry points
│   ├── index.html                   # Landing page chính
│   └── images/                      # Hình ảnh public
├── src/                            # Source code
│   ├── assets/                     # Shared assets
│   │   ├── css/                    # Global styles
│   │   ├── js/                     # Shared JavaScript
│   │   └── images/                 # Shared images
│   ├── components/                 # Reusable components
│   │   ├── ui/                     # UI components (Toast, Loading...)
│   │   ├── modals/                 # Modal components
│   │   ├── charts/                 # Chart components
│   │   └── forms/                  # Form components
│   ├── dashboards/                 # Dashboard-specific code
│   │   ├── waiter/                 # Waiter dashboard
│   │   ├── chef/                   # Chef dashboard
│   │   ├── cashier/                # Cashier dashboard (🆕 PayOS QR)
│   │   └── manager/                # Manager dashboard
│   ├── data/                       # Data models & mock data
│   │   ├── models/                 # Data models
│   │   ├── mock/                   # Mock data for development
│   │   └── schemas/                # Firebase schemas
│   └── utils/                      # Utility functions
├── config/                         # Configuration files
├── docs/                          # Documentation
├── scripts/                       # Build & utility scripts
└── tests/                         # Testing (future)
```

## 🚀 Bắt đầu

### Prerequisites

- **Python 3.x** (để chạy local server)
- **Web browser** hiện đại (Chrome, Firefox, Safari, Edge)
- **Internet connection** (để load Bootstrap, FontAwesome và PayOS)

### Cài đặt

1. **Clone repository**:

   ```bash
   git clone https://github.com/your-repo/restaurant-management-system.git
   cd restaurant-management-system
   ```

2. **Khởi động server**:

   ```bash
   # Option 1: Python HTTP Server
   npm run start
   # hoặc
   python -m http.server 8000

   # Option 2: Live Server (nếu có Node.js)
   npm install -g live-server
   npm run dev
   ```

3. **Truy cập ứng dụng**:
   - Mở browser và vào `http://localhost:8000`
   - Chọn role và đăng nhập

## 📱 Dashboards

### 👨‍💼 Waiter Dashboard

- **Quản lý bàn**: 12 bàn với trạng thái real-time
- **Menu system**: 28 món ăn, 4 danh mục
- **Tạo đơn hàng**: Modal responsive với tìm kiếm
- **Tính tổng tự động**: VAT và tổng tiền

**Truy cập**: `/src/dashboards/waiter/index.html`

### 👨‍🍳 Chef Dashboard

- **4 tab trạng thái**: Chờ xử lý, Đang chế biến, Sẵn sàng, Hoàn thành
- **Quản lý đơn hàng**: Cập nhật trạng thái, timer
- **Notes system**: Ghi chú đặc biệt từ khách
- **Toast notifications**: Phản hồi người dùng

**Truy cập**: `/src/dashboards/chef/index.html`

### 💰 Cashier Dashboard 🆕

- **Payment processing**: Tiền mặt, thẻ, PayOS QR
- **🔥 PayOS QR Payment**: Thanh toán VietQR tích hợp PayOS
- **Discount codes**: 5 mã giảm giá predefined
- **🆕 Invoice printing**: In hóa đơn tạm với PayOS QR code
- **Order search**: Tìm kiếm đơn hàng nhanh
- **Real-time payment**: Theo dõi trạng thái thanh toán PayOS

**Truy cập**: `/dashboard/cashier-dashboard.html`

**Tính năng PayOS QR mới**:

- ✅ **In hóa đơn tạm**: Với mã QR PayOS để khách thanh toán
- ✅ **VietQR Integration**: Khách quét QR bằng app ngân hàng
- ✅ **Payment Modal**: Nút "In hóa đơn tạm" ngay trong popup
- ✅ **Real-time status**: Theo dõi trạng thái thanh toán
- ✅ **Bank Integration**: Tích hợp KIENLONGBANK

### 📊 Manager Dashboard

- **Staff management**: CRUD nhân viên
- **Reports**: Export Excel theo thời gian
- **Analytics**: Top selling, revenue by category
- **Menu management**: Quản lý thực đơn và công thức
- **Inventory**: Kiểm soát kho với variance alerts

**Truy cập**: `/src/dashboards/manager/index.html`

## 💳 PayOS QR Payment System

### 🎯 Tính năng PayOS QR

```javascript
// Cấu hình PayOS
const PAYOS_SETTINGS = {
  CLIENT_ID: "your-payos-client-id",
  API_KEY: "your-payos-api-key",
  CHECKSUM_KEY: "your-payos-checksum-key",
  BANK: "KIENLONGBANK",
  ACCOUNT: "0969864739",
};
```

### 🔄 Luồng thanh toán PayOS

1. **Khách gọi món** → Waiter tạo đơn hàng
2. **Đơn hàng sẵn sàng** → Chuyển sang Cashier
3. **Cashier mở Payment Modal** → Chọn PayOS payment
4. **In hóa đơn tạm** với PayOS QR code
5. **Khách quét QR** bằng app ngân hàng → Thanh toán
6. **System nhận webhook** → Cập nhật trạng thái
7. **In hóa đơn chính thức** → Hoàn tất

### 📋 File PayOS liên quan

- `dashboard/cashier-dashboard.html` - Giao diện thanh toán
- `dashboard/cashier-script.js` - Logic PayOS QR
- `dashboard/qr-demo-simple.html` - Demo QR PayOS (retired)

## 🔧 Scripts có sẵn

```bash
# Development
npm run start        # Khởi động Python server
npm run dev         # Khởi động live-server với auto-reload
npm run serve       # Alternative Python server

# Build & Deploy (future)
npm run build       # Build for production
npm run deploy      # Deploy to Firebase
npm run clean       # Clean build folders

# Testing (future)
npm run test        # Run tests
npm run test:payos  # Test PayOS integration
```

## 🛠️ Công nghệ sử dụng

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **UI Framework**: Bootstrap 5.3
- **Icons**: FontAwesome 6, Lucide Icons
- **Charts**: Chart.js
- **Payment**: PayOS Checkout SDK
- **QR Generator**: qrcode.js library
- **Date/Time**: Native JavaScript Intl API
- **Export**: SheetJS (for Excel)
- **Print**: Browser native print API

## 📁 File quan trọng

- `Summary_Readme.md` - Tóm tắt chi tiết toàn bộ dự án
- `Project_Structure_Plan.md` - Kế hoạch tái cấu trúc
- `Manager_Dashboard_Implementation.md` - Chi tiết Manager Dashboard
- `dashboard/cashier-script.js` - 🆕 PayOS QR Payment logic
- `config/app-config.js` - Cấu hình ứng dụng
- `src/utils/` - Utility functions dùng chung

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

## 🆘 Support

Nếu gặp vấn đề, vui lòng:

1. Kiểm tra `docs/` để tìm hướng dẫn
2. Xem Issues trên GitHub
3. Liên hệ team development

## 📈 Roadmap

- [x] **PayOS QR Payment Integration** ✅
- [x] **Invoice printing with QR codes** ✅
- [ ] Firebase integration
- [ ] Offline support
- [ ] Mobile app
- [ ] Multi-language support
- [ ] Advanced analytics
- [ ] API documentation
- [ ] Unit testing
- [ ] E2E testing
- [ ] PayOS webhook integration
- [ ] Multiple payment gateway support

---

**Phiên bản**: 1.1.0  
**Cập nhật cuối**: December 2024  
**Team**: Restaurant Management Development Team

### 🆕 Changelog v1.1.0

- ✅ **Added PayOS QR Payment System**
- ✅ **Enhanced Cashier Dashboard with PayOS integration**
- ✅ **Invoice printing with PayOS QR codes**
- ✅ **Real-time payment status tracking**
- ✅ **VietQR integration with KIENLONGBANK**
- ✅ **Payment Modal improvements**
