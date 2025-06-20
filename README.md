# 🍽️ Restaurant Management System

Hệ thống quản lý nhà hàng hoàn chỉnh với giao diện web responsive, được xây dựng bằng HTML, CSS, JavaScript và Bootstrap.

## ✨ Tính năng chính

- **4 Dashboard riêng biệt**: Waiter, Chef, Cashier, Manager
- **Giao diện responsive**: Hoạt động tốt trên mọi thiết bị
- **Quản lý đơn hàng real-time**: Theo dõi trạng thái đơn hàng trực tiếp
- **Hệ thống thanh toán**: Tiền mặt, mã giảm giá và in hóa đơn
- **⚠️ PayOS QR Payment**: (Tạm thời gỡ bỏ, sẽ tích hợp lại sau)
- **Báo cáo và thống kê**: Export Excel, PDF và analytics chi tiết
- **Quản lý nhân viên**: CRUD operations hoàn chỉnh
- **Kiểm soát kho**: Theo dõi nguyên liệu với cảnh báo tự động
- **Performance optimizations**: Tăng tốc độ xử lý đơn hàng

## 🏗️ Cấu trúc dự án

```
CNPMLT/
├── index.html                      # Landing page chính
├── script.js                       # Main JavaScript file
├── styles.css                      # Main CSS file
├── assets/                         # Static assets
│   ├── favicon.ico                 # Website favicon
│   └── placeholder-food.jpg        # Placeholder image
├── dashboard/                      # Dashboard interfaces
│   ├── cashier-dashboard.html      # Cashier interface
│   ├── cashier-dashboard.js        # Cashier logic
│   ├── chef-dashboard.html         # Chef interface
│   ├── chef-dashboard.js           # Chef logic
│   ├── manager-dashboard.html      # Manager interface
│   ├── manager-dashboard.js        # Manager logic
│   ├── waiter-dashboard.html       # Waiter interface
│   └── waiter-dashboard.js         # Waiter logic
├── src/                            # Source code
│   ├── components/                 # Reusable components
│   │   └── ui/                     # UI components (Toast, etc.)
│   └── utils/                      # Utility functions
├── api/                            # API endpoints
│   └── payos/                      # PayOS integration endpoints
├── config/                         # Configuration files
│   ├── app-config.js               # App configuration
│   └── payos-config.js             # PayOS configuration
├── admin/                          # Admin tools
├── docs/                           # Documentation
└── scripts/                        # Build & utility scripts
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

### 💰 Cashier Dashboard

- **Payment processing**: Tiền mặt, thẻ (PayOS QR tạm thời gỡ bỏ)
- **Discount codes**: 10 mã giảm giá với tùy chỉnh linh hoạt
- **Invoice printing**: In hóa đơn chính thức
- **Order search**: Tìm kiếm đơn hàng nhanh với bộ lọc nâng cao
- **🆕 Multi-payment**: Hỗ trợ thanh toán nhiều đơn hàng cùng lúc
- **🆕 Payment history**: Lịch sử giao dịch chi tiết với báo cáo

**Truy cập**: `/dashboard/cashier-dashboard.html`

**⚠️ Lưu ý về PayOS QR**: Tính năng thanh toán PayOS QR đã tạm thời bị gỡ bỏ do một số lỗi kỹ thuật. Chúng tôi đang làm việc để khắc phục và sẽ tích hợp lại trong các bản cập nhật tương lai.

### 📊 Manager Dashboard

- **Staff management**: CRUD nhân viên
- **Reports**: Export Excel theo thời gian
- **Analytics**: Top selling, revenue by category
- **Menu management**: Quản lý thực đơn và công thức
- **Inventory**: Kiểm soát kho với variance alerts

**Truy cập**: `/src/dashboards/manager/index.html`

## 💳 PayOS QR Payment System (⚠️ Tạm thời không khả dụng)

### ⚠️ Thông báo quan trọng

Tính năng PayOS QR Payment System đã tạm thời được gỡ bỏ khỏi hệ thống do một số lỗi kỹ thuật. Chúng tôi đang làm việc để khắc phục các vấn đề và sẽ tích hợp lại trong tương lai.

Hiện tại, vui lòng sử dụng các phương thức thanh toán thay thế như tiền mặt hoặc thẻ.

### 📋 File PayOS liên quan (tham khảo)

- `dashboard/cashier-dashboard.html` - Giao diện thanh toán (đã cập nhật)
- `dashboard/cashier-script.js` - Logic thanh toán (đã cập nhật)
- `config/payos-config.js` - Cấu hình PayOS (đã vô hiệu hóa)

## 🔧 Scripts có sẵn

```bash
# Development
npm run start        # Khởi động Python server
npm run dev          # Khởi động live-server với auto-reload
npm run serve        # Alternative Python server

# Build & Deploy
npm run build        # Build for production
npm run deploy       # Deploy to Firebase
npm run clean        # Clean build folders
npm run vercel:deploy # Deploy to Vercel

# Testing
npm run test         # Run tests
npm run test:payos   # Test PayOS integration
npm run test:ui      # Test UI components

# Data Management
npm run init:menu    # Initialize menu data
npm run init:inventory # Initialize inventory data
```

## 🛠️ Công nghệ sử dụng

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **UI Framework**: Bootstrap 5.3
- **Icons**: FontAwesome 6, Lucide Icons
- **Charts**: Chart.js 4.0
- **Payment**: PayOS Checkout SDK 2.0
- **QR Generator**: qrcode.js library
- **Date/Time**: Native JavaScript Intl API
- **Export**: SheetJS (Excel), jsPDF (PDF)
- **Print**: Browser native print API
- **HTTP Client**: Axios
- **Animations**: GSAP (GreenSock)
- **State Management**: Custom Pub/Sub system
- **PDF Generation**: jsPDF with AutoTable plugin

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

- [ ] **Khắc phục và tái tích hợp PayOS QR Payment** (Ưu tiên cao)
- [x] ~~PayOS QR Payment Integration~~ (Tạm thời gỡ bỏ)
- [x] ~~Invoice printing with QR codes~~ (Tạm thời gỡ bỏ)
- [x] ~~PayOS webhook integration~~ (Tạm thời gỡ bỏ)
- [ ] Firebase integration (In Progress)
- [ ] Offline support
- [ ] Mobile app
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] API documentation
- [ ] Unit testing
- [ ] E2E testing
- [ ] Alternative payment gateway integration
- [ ] Customer loyalty program
- [ ] Table reservation system

---

**Phiên bản**: 1.2.0  
**Cập nhật cuối**: June 2025  
**Team**: Restaurant Management Development Team

### 🆕 Changelog v1.2.0

- ⚠️ **Tạm thời gỡ bỏ PayOS QR Payment System do lỗi kỹ thuật**
- ✅ **Enhanced UI/UX across all dashboards**
- ✅ **Added export options for financial reports**
- ✅ **Optimized loading times on all pages**
- ✅ **Improved mobile responsiveness**
- ✅ **Bug fixes and stability improvements**
- ✅ **Cập nhật cashier dashboard để hỗ trợ thanh toán không có PayOS**

### Changelog v1.1.0

- ✅ **Added PayOS QR Payment System**
- ✅ **Enhanced Cashier Dashboard with PayOS integration**
- ✅ **Invoice printing with PayOS QR codes**
- ✅ **Real-time payment status tracking**
- ✅ **VietQR integration with KIENLONGBANK**
- ✅ **Payment Modal improvements**
