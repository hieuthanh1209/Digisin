# 🍽️ Digisin - Restaurant Management System

Hệ thống quản lý nhà hàng số hoàn chỉnh với giao diện web responsive, được xây dựng bằng HTML, CSS, JavaScript và tích hợp Firebase + PayOS.

## ✨ Tính năng chính

- **4 Dashboard chuyên biệt**: Waiter, Chef, Cashier, Manager với giao diện tối ưu
- **Responsive Design**: Hoạt động mượt mà trên desktop, tablet và mobile
- **Quản lý đơn hàng real-time**: Đồng bộ trạng thái đơn hàng theo thời gian thực
- **Hệ thống thanh toán đa dạng**: Tiền mặt, PayOS QR, mã giảm giá và in hóa đơn
- **Firebase Integration**: Database real-time với Firestore
- **Báo cáo và analytics**: Export Excel, PDF với visualization charts
- **Quản lý nhân viên**: CRUD operations và phân quyền
- **Kiểm soát kho**: Theo dõi nguyên liệu với cảnh báo tự động
- **Tính thuế VAT**: Hệ thống tính thuế linh hoạt
- **Performance Optimization**: Load balancing và caching

## 🏗️ Cấu trúc dự án

```
Digisin/
├── index.html                      # Landing page chính
├── script.js                       # Main JavaScript logic
├── styles.css                      # Global styles
├── server.js                       # Node.js backend server
├── package.json                    # Node.js dependencies
├── vercel.json                     # Vercel deployment config
├── assets/                         # Static assets
│   ├── favicon.ico                 # Website icon
│   └── placeholder-food.jpg        # Default food image
├── dashboard/                      # Dashboard interfaces
│   ├── waiter-dashboard.html       # Waiter interface
│   ├── waiter-dashboard.js         # Waiter logic
│   ├── chef-dashboard.html         # Chef interface
│   ├── chef-dashboard.js           # Chef logic
│   ├── cashier-dashboard.html      # Cashier interface
│   ├── cashier-dashboard.js        # Cashier logic
│   ├── manager-dashboard.html      # Manager interface
│   └── manager-dashboard.js        # Manager logic
├── admin/                          # Admin initialization tools
│   ├── init-menu.html              # Menu initialization
│   ├── init-inventory.html         # Inventory setup
│   ├── init-finance.html           # Finance setup
│   └── initialize-firebase.html    # Firebase initialization
├── config/                         # Configuration files
│   ├── firebase-config.js          # Firebase configuration
│   ├── app-config.js               # Application settings
│   ├── payos-config.js             # PayOS payment settings
│   └── firestore.rules             # Firestore security rules
├── api/                            # API endpoints
│   └── payos/                      # PayOS webhook handlers
├── payos-render-server/            # PayOS server deployment
├── docs/                           # Documentation
│   ├── payos-integration-guide.md  # PayOS integration guide
│   ├── system-settings-guide.md    # System configuration
│   └── tax-settings-guide.md       # VAT settings guide
├── scripts/                        # Utility scripts
└── src/                            # Source components
    ├── components/                 # Reusable UI components
    └── utils/                      # Helper functions
```

## 🚀 Bắt đầu nhanh

### Yêu cầu hệ thống

- **Node.js 16+** (để chạy backend server)
- **Web browser** hiện đại (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- **Firebase Account** (để sử dụng Firestore database)
- **PayOS Account** (để thanh toán QR code - tùy chọn)

### Cài đặt

1. **Clone repository**:

   ```bash
   git clone https://github.com/hieuthanh1209/Digisin.git
   cd Digisin
   ```

2. **Cài đặt dependencies**:

   ```bash
   # Install Node.js dependencies
   npm install

   # Install PayOS server dependencies (nếu cần)
   cd payos-render-server
   npm install
   cd ..
   ```

3. **Cấu hình Firebase**:
   - Tạo project mới trên [Firebase Console](https://console.firebase.google.com)
   - Copy config vào `config/firebase-config.js`
   - Cấu hình Firestore rules từ `config/firestore.rules`

4. **Cấu hình PayOS** (tùy chọn):
   - Đăng ký tài khoản [PayOS](https://payos.vn)
   - Cập nhật `config/payos-config.js` với API keys

5. **Khởi động ứng dụng**:

   ```bash
   # Khởi động PayOS server
   node payos-simple-server.js


6. **Truy cập ứng dụng**:
   - Main app: `http://localhost:3000`
   - PayOS server: `http://localhost:3001`

### Khởi tạo dữ liệu ban đầu

1. Truy cập `/admin/initialize-firebase.html` để setup Firebase
2. Sử dụng `/admin/init-menu.html` để thêm menu mẫu
3. Sử dụng `/admin/init-inventory.html` để setup kho hàng
4. Sử dụng `/admin/init-finance.html` để cấu hình tài chính

## 📱 Dashboard Interfaces

### 👨‍💼 Waiter Dashboard (`/dashboard/waiter-dashboard.html`)

**Chức năng chính:**
- **Quản lý bàn**: 12 bàn với trạng thái real-time (Trống/Có khách/Đã đặt)
- **Menu thông minh**: 28+ món ăn, 4 danh mục với search và filter
- **Tạo đơn hàng**: Modal responsive với tính toán tự động
- **Gọi món**: Thêm/sửa/xóa món, ghi chú đặc biệt
- **Tính tổng real-time**: VAT, giảm giá, tổng tiền tự động

**Tính năng nổi bật:**
- Drag & drop menu items
- Voice note cho yêu cầu đặc biệt
- Table map visualization
- Order status tracking

### 👨‍🍳 Chef Dashboard (`/dashboard/chef-dashboard.html`)

**Workflow 4 giai đoạn:**
1. **Chờ xử lý** - Đơn hàng mới chờ confirm
2. **Đang chế biến** - Đang nấu với timer
3. **Sẵn sàng** - Hoàn thành, chờ phục vụ
4. **Đã hoàn thành** - Đã giao khách

**Tính năng nổi bật:**
- Kitchen timer cho từng món
- Priority order management
- Ingredient availability check
- Real-time notifications

### 💰 Cashier Dashboard (`/dashboard/cashier-dashboard.html`)

**Payment Processing:**
- **Thanh toán tiền mặt**: Tính tiền thừa tự động
- **PayOS QR Payment**: Thanh toán nhanh qua QR code
- **Mã giảm giá**: 10+ loại voucher có sẵn
- **In hóa đơn**: Template VAT chuẩn với QR code

**Tính năng nâng cao:**
- Multi-payment support (tiền mặt + thẻ)
- Payment history với export
- Refund management
- Tax calculation engine

### 📊 Manager Dashboard (`/dashboard/manager-dashboard.html`)

**Management Tools:**
- **Staff Management**: CRUD nhân viên với phân quyền
- **Financial Reports**: Revenue, expense tracking
- **Menu Management**: Cập nhật món ăn, giá cả
- **Inventory Control**: Quản lý kho với alerts
- **Analytics**: Charts và insights

**Business Intelligence:**
- Top selling analysis
- Revenue by time periods
- Staff performance metrics
- Inventory variance reports

## 💳 PayOS Integration

### � PayOS QR Payment System

Digisin tích hợp PayOS để cung cấp thanh toán QR code tiện lợi và an toàn.

**Tính năng:**
- **QR Code Payment**: Khách quét mã thanh toán
- **Real-time Status**: Theo dõi trạng thái thanh toán
- **VietQR Support**: Tương thích với tất cả ngân hàng Việt Nam
- **Webhook Integration**: Xử lý callback tự động
- **Security**: Mã hóa và xác thực an toàn

**Cấu hình PayOS:**
1. Đăng ký tài khoản tại [PayOS.vn](https://payos.vn)
2. Lấy API credentials (Client ID, API Key, Checksum Key)
3. Cập nhật `config/payos-config.js`:

```javascript
const PAYOS_CONFIG = {
    CLIENT_ID: "your-client-id",
    API_KEY: "your-api-key", 
    CHECKSUM_KEY: "your-checksum-key",
    SANDBOX: true // false for production
};
```

**PayOS Server Deployment:**
- Render: `/payos-render-server/` - Production server
- Local: `npm run payos:start` - Development
- Vercel: `api/payos/` - Serverless functions

### � Payment Flow

1. **Tạo đơn hàng** → Cashier tạo payment link
2. **QR Code** → Hiển thị QR cho khách quét
3. **Thanh toán** → Khách thanh toán qua banking app
4. **Webhook** → PayOS gửi callback về server
5. **Hoàn tất** → Cập nhật trạng thái và in hóa đơn

## 🔧 Available Scripts

```bash
# Development
npm start               # Khởi động main server (port 3000)
npm run dev             # Development với auto-reload
npm run serve           # Alternative static server

# PayOS Integration
npm run payos:start     # Khởi động PayOS server (port 3001)
npm run payos:test      # Test PayOS webhook integration
npm run payos:deploy    # Deploy PayOS server to Render

# Build & Deploy
npm run build           # Build production bundle
npm run deploy          # Deploy to Vercel
npm run deploy:firebase # Deploy to Firebase Hosting
npm run clean           # Clean build artifacts

# Testing & Development
npm run test            # Run unit tests
npm run test:payos      # Test PayOS integration
npm run test:ui         # Test UI components
npm run test:e2e        # End-to-end testing

# Data Management
npm run init:all        # Initialize all data (menu, inventory, finance)
npm run init:menu       # Initialize menu data
npm run init:inventory  # Initialize inventory data
npm run init:finance    # Initialize finance settings
npm run backup:data     # Backup Firestore data
npm run restore:data    # Restore from backup

# Code Quality
npm run lint            # ESLint code checking
npm run format          # Prettier code formatting
npm run validate        # Validate all configurations
```

## 🛠️ Tech Stack

### Frontend
- **HTML5** - Semantic markup với accessibility
- **CSS3** - Modern styling với Grid/Flexbox
- **JavaScript ES6+** - Native JS với modules
- **Bootstrap 5.3** - Responsive UI framework
- **FontAwesome 6** - Icon library
- **Chart.js 4.0** - Data visualization

### Backend & Database
- **Node.js 18+** - Backend runtime
- **Express.js** - Web application framework
- **Firebase** - Backend-as-a-Service
  - **Firestore** - NoSQL real-time database
  - **Firebase Auth** - Authentication system
  - **Firebase Functions** - Serverless functions
  - **Firebase Hosting** - Static hosting

### Payment & Integration
- **PayOS SDK 2.0** - Vietnam payment gateway
- **VietQR** - QR code payment standard
- **Webhook handling** - Real-time payment updates

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Webpack** - Module bundling (optional)
- **Vercel/Render** - Deployment platforms

### Libraries & Utilities
- **Axios** - HTTP client
- **QRCode.js** - QR code generation
- **jsPDF** - PDF generation
- **SheetJS** - Excel export
- **Moment.js** - Date/time handling
- **SweetAlert2** - Beautiful alerts
- **DataTables** - Advanced table features

## 📁 Important Files

### Configuration
- `config/firebase-config.js` - 🔑 Firebase project configuration
- `config/payos-config.js` - 💳 PayOS payment settings
- `config/app-config.js` - ⚙️ Application settings
- `firestore.rules` - 🔒 Database security rules
- `vercel.json` - 🚀 Vercel deployment config

### Core Application
- `server.js` - 🖥️ Main Node.js server
- `package.json` - 📦 Project dependencies and scripts
- `index.html` - 🏠 Landing page
- `script.js` - 📱 Main application logic
- `styles.css` - 🎨 Global styles

### Dashboard Files
- `dashboard/waiter-dashboard.html` - 👨‍💼 Waiter interface
- `dashboard/chef-dashboard.html` - 👨‍🍳 Chef interface  
- `dashboard/cashier-dashboard.html` - 💰 Cashier interface
- `dashboard/manager-dashboard.html` - 📊 Manager interface

### PayOS Integration
- `payos-render-server/` - 🌐 PayOS production server
- `api/payos/` - ⚡ PayOS Vercel serverless functions
- `payos-*.js` - 🔧 PayOS development servers

### Admin Tools
- `admin/initialize-firebase.html` - 🔧 Firebase setup
- `admin/init-menu.html` - 🍽️ Menu initialization
- `admin/init-inventory.html` - 📦 Inventory setup
- `admin/init-finance.html` - 💰 Finance configuration

### Documentation
- `docs/payos-integration-guide.md` - 💳 PayOS setup guide
- `docs/system-settings-guide.md` - ⚙️ System configuration
- `docs/tax-settings-guide.md` - 🧾 VAT configuration
- `README-PayOS.md` - 📖 PayOS specific documentation
- `PAYOS_TEST_GUIDE.md` - 🧪 PayOS testing instructions

## 🤝 Contributing

Chúng tôi hoan nghênh mọi đóng góp cho dự án Digisin!

### Quy trình đóng góp

1. **Fork** repository này
2. **Clone** fork về máy local:
   ```bash
   git clone https://github.com/your-username/Digisin.git
   ```
3. **Tạo branch** cho feature mới:
   ```bash
   git checkout -b feature/amazing-feature
   ```
4. **Commit** thay đổi với message rõ ràng:
   ```bash
   git commit -m 'Add: Amazing new feature'
   ```
5. **Push** lên branch:
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Tạo Pull Request** với mô tả chi tiết

### Coding Standards

- **JavaScript**: ES6+ syntax, functional programming
- **HTML**: Semantic markup, accessibility
- **CSS**: BEM methodology, responsive design
- **Comments**: JSDoc for functions, clear explanations
- **Testing**: Unit tests cho core functions

### Bug Reports

Khi báo bug, vui lòng bao gồm:
- Mô tả chi tiết vấn đề
- Các bước tái hiện
- Screenshots/videos (nếu có)
- Browser và version
- Console errors (nếu có)

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### MIT License Summary
- ✅ Commercial use
- ✅ Modification  
- ✅ Distribution
- ✅ Private use
- ❌ Warranty
- ❌ Liability

## 🆘 Support & Contact

### Hỗ trợ kỹ thuật

1. **Documentation**: Xem `docs/` folder cho hướng dẫn chi tiết
2. **GitHub Issues**: [Tạo issue mới](https://github.com/hieuthanh1209/Digisin/issues)
3. **Discussions**: [GitHub Discussions](https://github.com/hieuthanh1209/Digisin/discussions)

### Liên hệ

- **Developer**: @hieuthanh1209
- **Email**: [Contact via GitHub](https://github.com/hieuthanh1209)
- **Project Repository**: https://github.com/hieuthanh1209/Digisin

### Báo cáo bảo mật

Nếu phát hiện lỗ hổng bảo mật, vui lòng:
1. **KHÔNG** tạo public issue
2. Email trực tiếp qua GitHub
3. Cung cấp chi tiết về vulnerability
4. Chờ response trước khi công bố

## 📈 Roadmap & Development

### ✅ Completed Features (v2.0.0)

- [x] **Complete Dashboard System** - 4 specialized interfaces
- [x] **Firebase Integration** - Real-time database with Firestore
- [x] **PayOS Payment System** - QR code payments with VietQR
- [x] **Responsive Design** - Mobile-first approach
- [x] **Invoice System** - VAT calculation and printing
- [x] **Real-time Updates** - Live order status tracking
- [x] **Advanced Analytics** - Charts and business intelligence
- [x] **Staff Management** - CRUD operations with role-based access
- [x] **Inventory Control** - Stock management with alerts
- [x] **Multi-language Support** - Vietnamese and English

### 🚧 In Progress (v2.1.0)

- [ ] **Performance Optimization** - Faster loading times
- [ ] **Enhanced Security** - Advanced authentication
- [ ] **Mobile App** - React Native companion app
- [ ] **Offline Support** - PWA with service workers
- [ ] **Advanced Reports** - More detailed analytics
- [ ] **API Documentation** - Comprehensive API docs

### 🔮 Future Plans (v3.0.0+)

- [ ] **AI Integration** - Smart recommendations and forecasting
- [ ] **Voice Commands** - Hands-free operation
- [ ] **IoT Integration** - Kitchen equipment connectivity
- [ ] **Customer App** - Online ordering and reservations
- [ ] **Loyalty Program** - Customer retention system
- [ ] **Multi-location** - Chain restaurant support
- [ ] **Advanced POS** - Hardware integration
- [ ] **Franchise Management** - Multi-tenant architecture

### 🐛 Known Issues & Fixes

#### High Priority
- [ ] PayOS webhook occasionally delays (investigating)
- [ ] Large menu loading optimization needed
- [ ] Mobile Safari touch event improvements

#### Medium Priority  
- [ ] Dark mode implementation
- [ ] Better error handling for offline scenarios
- [ ] Enhanced accessibility features

#### Low Priority
- [ ] UI/UX polish improvements
- [ ] Additional payment gateways
- [ ] More export formats

---

## 📊 Project Stats

**Current Version**: `v2.0.0`  
**Last Updated**: August 03 2025  
**Development Team**: [hieuthanh1209](https://github.com/hieuthanh1209)  
**License**: MIT  
**Repository**: [Digisin](https://github.com/hieuthanh1209/Digisin)

**⭐ Star this repository if you find it helpful!**  
**🍴 Fork it to contribute to the project!**  
**📢 Share it with others who might benefit!**
