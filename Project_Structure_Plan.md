# Restaurant Management System - Project Structure Reorganization Plan

## 🎯 Mục tiêu tái cấu trúc

Tổ chức lại project để:

- **Dễ bảo trì**: Phân chia rõ ràng theo chức năng
- **Scalable**: Dễ mở rộng khi thêm features
- **Professional**: Cấu trúc chuẩn công nghiệp
- **Team-friendly**: Dễ làm việc nhóm

## 📁 Cấu trúc hiện tại (cần sắp xếp lại)

```
CNPMLT/ (Current - Messy)
├── index.html
├── script.js
├── styles.css
├── *.tsx files (React components - legacy)
├── dashboard/
│   ├── waiter-dashboard.html
│   ├── waiter-script.js
│   ├── waiter-styles.css
│   ├── chef-dashboard.html
│   ├── chef-script.js
│   ├── chef-styles.css
│   ├── cashier-dashboard.html
│   ├── cashier-script.js
│   ├── cashier-styles.css
│   ├── manager-dashboard.html
│   ├── manager-script.js
│   ├── manager-styles.css
│   └── (duplicate .js files)
└── docs/
```

## 🗂️ Cấu trúc mới được đề xuất

```
CNPMLT/ (New - Organized)
├── public/                          # Static assets & entry points
│   ├── index.html                   # Main landing page
│   ├── favicon.ico
│   └── images/
│       ├── logo.png
│       ├── food-placeholder.jpg
│       └── restaurant-bg.jpg
│
├── src/                            # Source code
│   ├── assets/                     # Shared assets
│   │   ├── css/
│   │   │   ├── global.css          # Global styles
│   │   │   ├── variables.css       # CSS custom properties
│   │   │   └── utilities.css       # Utility classes
│   │   ├── js/
│   │   │   ├── utils.js           # Utility functions
│   │   │   ├── constants.js       # App constants
│   │   │   └── api.js             # API layer (for Firebase)
│   │   └── images/
│   │       └── (shared images)
│   │
│   ├── components/                 # Reusable components
│   │   ├── modals/
│   │   │   ├── order-modal.js
│   │   │   ├── payment-modal.js
│   │   │   └── staff-modal.js
│   │   ├── charts/
│   │   │   ├── revenue-chart.js
│   │   │   ├── sales-chart.js
│   │   │   └── analytics-chart.js
│   │   ├── tables/
│   │   │   ├── data-table.js
│   │   │   └── staff-table.js
│   │   ├── ui/
│   │   │   ├── toast.js
│   │   │   ├── loading.js
│   │   │   └── search-bar.js
│   │   └── forms/
│   │       ├── login-form.js
│   │       └── order-form.js
│   │
│   ├── dashboards/                 # Dashboard-specific code
│   │   ├── waiter/
│   │   │   ├── index.html
│   │   │   ├── waiter.js
│   │   │   ├── waiter.css
│   │   │   └── components/
│   │   │       ├── table-grid.js
│   │   │       ├── menu-display.js
│   │   │       └── order-summary.js
│   │   ├── chef/
│   │   │   ├── index.html
│   │   │   ├── chef.js
│   │   │   ├── chef.css
│   │   │   └── components/
│   │   │       ├── order-tabs.js
│   │   │       ├── order-card.js
│   │   │       └── timer-widget.js
│   │   ├── cashier/
│   │   │   ├── index.html
│   │   │   ├── cashier.js
│   │   │   ├── cashier.css
│   │   │   └── components/
│   │   │       ├── payment-form.js
│   │   │       ├── discount-codes.js
│   │   │       ├── invoice-printer.js
│   │   │       └── order-search.js
│   │   └── manager/
│   │       ├── index.html
│   │       ├── manager.js
│   │       ├── manager.css
│   │       └── components/
│   │           ├── dashboard-stats.js
│   │           ├── staff-management.js
│   │           ├── reports-generator.js
│   │           ├── menu-management.js
│   │           ├── inventory-control.js
│   │           └── analytics-dashboard.js
│   │
│   ├── data/                       # Mock data & models
│   │   ├── models/
│   │   │   ├── user.js
│   │   │   ├── staff.js
│   │   │   ├── menu-item.js
│   │   │   ├── order.js
│   │   │   ├── table.js
│   │   │   └── inventory.js
│   │   ├── mock/
│   │   │   ├── staff-data.js
│   │   │   ├── menu-data.js
│   │   │   ├── orders-data.js
│   │   │   ├── tables-data.js
│   │   │   └── inventory-data.js
│   │   └── schemas/
│   │       ├── firebase-schema.js
│   │       └── validation-rules.js
│   │
│   └── utils/                      # Utility functions
│       ├── date-formatter.js
│       ├── currency-formatter.js
│       ├── excel-exporter.js
│       ├── print-invoice.js
│       ├── local-storage.js
│       └── validators.js
│
├── config/                         # Configuration files
│   ├── firebase-config.js
│   ├── app-config.js
│   └── environment.js
│
├── docs/                          # Documentation
│   ├── API_Documentation.md
│   ├── Firebase_Setup_Guide.md
│   ├── Deployment_Guide.md
│   ├── Feature_Specifications.md
│   └── Development_Guidelines.md
│
├── scripts/                       # Build & utility scripts
│   ├── build.js
│   ├── deploy.js
│   └── migrate-firebase.js
│
├── tests/                         # Testing (future)
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .gitignore
├── package.json                   # Dependencies & scripts
├── README.md                      # Main documentation
└── Summary_Readme.md             # Current comprehensive summary
```

## 🔄 Plan di chuyển file

### Step 1: Tạo cấu trúc thư mục mới

```bash
mkdir -p public/images
mkdir -p src/{assets/{css,js,images},components/{modals,charts,tables,ui,forms},dashboards/{waiter,chef,cashier,manager}/components,data/{models,mock,schemas},utils}
mkdir -p config docs scripts tests/{unit,integration,e2e}
```

### Step 2: Di chuyển file HTML

```bash
# Main entry point
mv index.html public/

# Dashboard HTML files
mv dashboard/waiter-dashboard.html src/dashboards/waiter/index.html
mv dashboard/chef-dashboard.html src/dashboards/chef/index.html
mv dashboard/cashier-dashboard.html src/dashboards/cashier/index.html
mv dashboard/manager-dashboard.html src/dashboards/manager/index.html
```

### Step 3: Di chuyển & tổ chức CSS

```bash
# Global styles
mv styles.css src/assets/css/global.css

# Dashboard-specific styles
mv dashboard/waiter-styles.css src/dashboards/waiter/waiter.css
mv dashboard/chef-styles.css src/dashboards/chef/chef.css
mv dashboard/cashier-styles.css src/dashboards/cashier/cashier.css
mv dashboard/manager-styles.css src/dashboards/manager/manager.css
```

### Step 4: Di chuyển & tổ chức JavaScript

```bash
# Main script
mv script.js src/assets/js/main.js

# Dashboard scripts
mv dashboard/waiter-script.js src/dashboards/waiter/waiter.js
mv dashboard/chef-script.js src/dashboards/chef/chef.js
mv dashboard/cashier-script.js src/dashboards/cashier/cashier.js
mv dashboard/manager-script.js src/dashboards/manager/manager.js
```

### Step 5: Tạo shared components

- Extract common functionality thành reusable components
- Tạo utility functions trong src/utils/
- Setup mock data trong src/data/mock/

### Step 6: Cập nhật import paths

- Sửa tất cả đường dẫn CSS/JS trong HTML files
- Update relative paths trong JavaScript files
- Create centralized config files

### Step 7: Dọn dẹp

```bash
# Remove duplicate files
rm dashboard/manager-dashboard.js
rm dashboard/waiter-dashboard.js
rm dashboard/cashier-dashboard.js
rm dashboard/chef-dashboard.js

# Remove legacy React files
rm *.tsx

# Remove empty dashboard folder
rmdir dashboard
```

## 📋 Tạo file cấu hình mới

### package.json

```json
{
  "name": "restaurant-management-system",
  "version": "1.0.0",
  "description": "Complete restaurant management system with role-based dashboards",
  "main": "public/index.html",
  "scripts": {
    "start": "python -m http.server 8000",
    "dev": "live-server public/",
    "build": "node scripts/build.js",
    "deploy": "node scripts/deploy.js",
    "test": "echo 'Tests not implemented yet'"
  },
  "dependencies": {},
  "devDependencies": {
    "live-server": "^1.2.2"
  },
  "keywords": ["restaurant", "management", "pos", "firebase", "javascript"],
  "author": "Your Name",
  "license": "MIT"
}
```

### .gitignore

```
# Dependencies
node_modules/
npm-debug.log*

# Production builds
dist/
build/

# Environment variables
.env
.env.local
.env.production

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db

# Firebase
.firebase/
firebase-debug.log

# Temporary files
*.tmp
*.temp
```

### config/app-config.js

```javascript
// Centralized application configuration
export const APP_CONFIG = {
  name: "Restaurant Management System",
  version: "1.0.0",
  roles: ["waiter", "chef", "cashier", "manager"],
  features: {
    realTimeUpdates: true,
    offlineSupport: false,
    multiLanguage: false,
  },
  ui: {
    theme: "light",
    primaryColor: "#007bff",
    currency: "VNĐ",
    locale: "vi-VN",
  },
};
```

## 🎯 Lợi ích của cấu trúc mới

### 1. **Maintainability**

- Mỗi component có scope rõ ràng
- Dễ tìm và sửa lỗi
- Code reuse giữa các dashboard

### 2. **Scalability**

- Dễ thêm dashboard mới
- Shared components tái sử dụng
- Modular architecture

### 3. **Collaboration**

- Team members có thể work on different modules
- Clear separation of concerns
- Consistent file naming

### 4. **Performance**

- Lazy loading cho từng dashboard
- Shared utilities được cache
- Optimized asset loading

### 5. **Testing**

- Isolated components dễ test
- Mock data organized
- Clear API boundaries

## 🚀 Implementation Plan

### Phase 1: Structure Setup (1 ngày)

1. Tạo folder structure mới
2. Di chuyển files theo plan
3. Update import paths
4. Test basic functionality

### Phase 2: Code Refactoring (2-3 ngày)

1. Extract shared components
2. Create utility functions
3. Setup mock data models
4. Implement config system

### Phase 3: Enhancement (1-2 ngày)

1. Add package.json với scripts
2. Setup development tools
3. Create documentation structure
4. Add build/deploy scripts

### Phase 4: Optimization (1 ngày)

1. Minify assets
2. Setup lazy loading
3. Optimize file sizes
4. Performance testing

## 📝 Migration Checklist

- [ ] Create new folder structure
- [ ] Move HTML files to appropriate locations
- [ ] Move CSS files and update imports
- [ ] Move JavaScript files and fix paths
- [ ] Extract shared components
- [ ] Create utility functions
- [ ] Setup mock data structure
- [ ] Create configuration files
- [ ] Update documentation
- [ ] Test all dashboards
- [ ] Clean up old files
- [ ] Update README with new structure

Cấu trúc này sẽ làm cho project professional hơn nhiều và dễ maintain trong tương lai!
