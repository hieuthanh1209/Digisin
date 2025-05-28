# 🍽️ Restaurant Management System

Hệ thống quản lý nhà hàng hoàn chỉnh với giao diện web responsive, được xây dựng bằng HTML, CSS, JavaScript và Bootstrap.

## ✨ Tính năng chính

- **4 Dashboard riêng biệt**: Waiter, Chef, Cashier, Manager
- **Giao diện responsive**: Hoạt động tốt trên mọi thiết bị
- **Quản lý đơn hàng real-time**: Theo dõi trạng thái đơn hàng trực tiếp
- **Hệ thống thanh toán**: Với mã giảm giá và in hóa đơn
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
│   │   ├── cashier/                # Cashier dashboard
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
- **Internet connection** (để load Bootstrap, FontAwesome)

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

- **Payment processing**: Nhiều phương thức thanh toán
- **Discount codes**: 5 mã giảm giá predefined
- **Invoice printing**: In hóa đơn trước/sau thanh toán
- **Order search**: Tìm kiếm đơn hàng nhanh

**Truy cập**: `/src/dashboards/cashier/index.html`

### 📊 Manager Dashboard

- **Staff management**: CRUD nhân viên
- **Reports**: Export Excel theo thời gian
- **Analytics**: Top selling, revenue by category
- **Menu management**: Quản lý thực đơn và công thức
- **Inventory**: Kiểm soát kho với variance alerts

**Truy cập**: `/src/dashboards/manager/index.html`

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
```

## 📊 Tích hợp Firebase (Kế hoạch)

Xem `docs/Firebase_Setup_Guide.md` để biết chi tiết về:

- Cấu trúc database được đề xuất
- Authentication setup
- Real-time updates
- Cloud Functions

## 🛠️ Công nghệ sử dụng

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **UI Framework**: Bootstrap 5.3
- **Icons**: FontAwesome 6, Lucide Icons
- **Charts**: Chart.js
- **Date/Time**: Native JavaScript Intl API
- **Export**: SheetJS (for Excel)
- **Print**: Browser native print API

## 📁 File quan trọng

- `Summary_Readme.md` - Tóm tắt chi tiết toàn bộ dự án
- `Project_Structure_Plan.md` - Kế hoạch tái cấu trúc
- `Manager_Dashboard_Implementation.md` - Chi tiết Manager Dashboard
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

- [ ] Firebase integration
- [ ] Offline support
- [ ] Mobile app
- [ ] Multi-language support
- [ ] Advanced analytics
- [ ] API documentation
- [ ] Unit testing
- [ ] E2E testing

---

**Phiên bản**: 1.0.0  
**Cập nhật cuối**: $(date)  
**Team**: Restaurant Management Development Team
