# 🚀 Deployment Guide - Restaurant Management System

## 📋 Overview

Hướng dẫn deploy Restaurant Management System lên các platform khác nhau như Vercel, Netlify, GitHub Pages, và Firebase Hosting.

## 🔧 Prerequisites

- **Node.js** >= 14.0.0
- **Git** repository setup
- **NPM** hoặc **Yarn** package manager

## 🎯 Quick Deploy

### Option 1: Vercel (Recommended) ⚡

```bash
# Build và deploy
npm run build
npm run deploy

# Hoặc deploy trực tiếp
npx vercel --prod
```

**Lý do chọn Vercel:**

- ✅ Zero configuration
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Perfect cho static sites

### Option 2: Netlify 🌐

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build và deploy
npm run build
netlify deploy --prod --dir=dist

# Hoặc drag & drop vào Netlify Dashboard
```

### Option 3: GitHub Pages 📚

```bash
# Setup GitHub Pages
npm install -g gh-pages

# Build và deploy
npm run build
gh-pages -d dist
```

### Option 4: Firebase Hosting 🔥

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login và setup
firebase login
firebase init hosting

# Deploy
npm run build
firebase deploy
```

## 📂 File Structure Requirements

Đảm bảo project có structure này trước khi deploy:

```
CNPMLT/
├── index.html              # Landing page (root)
├── dashboard/              # Legacy dashboard files
│   └── manager-dashboard.html
├── public/                 # Public assets (new structure)
├── src/                    # Source code (new structure)
├── vercel.json            # Vercel configuration
├── package.json           # NPM configuration
└── scripts/
    ├── build.js           # Build script
    └── deploy.js          # Deployment script
```

## 🛠️ Build Process

Build script tự động:

1. **Tạo thư mục `dist/`**
2. **Copy tất cả files cần thiết**:
   - `index.html` (root)
   - `dashboard/` directory
   - `public/` directory (nếu có)
   - `src/` directory
   - `config/` directory
   - Documentation files
3. **Tạo `vercel.json` trong dist/**
4. **Ready for deployment!**

## 🔧 Platform-Specific Setup

### Vercel Configuration

File `vercel.json` đã được tạo tự động:

```json
{
  "version": 2,
  "name": "restaurant-management-system",
  "builds": [
    {
      "src": "**/*.html",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/",
      "dest": "/index.html"
    },
    {
      "src": "/dashboard/(.*)",
      "dest": "/dashboard/$1"
    }
  ]
}
```

### Netlify Configuration

Tạo file `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Firebase Configuration

File `firebase.json` sẽ được tạo tự động:

```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

## 🎯 URL Structure After Deployment

Sau khi deploy, các URL sau sẽ hoạt động:

| Page                  | URL                                 | Description                  |
| --------------------- | ----------------------------------- | ---------------------------- |
| **Landing**           | `/`                                 | Trang chủ với role selection |
| **Manager Dashboard** | `/dashboard/manager-dashboard.html` | Dashboard quản lý            |
| **Documentation**     | `/README.md`                        | Project documentation        |
| **Summary**           | `/Summary_Readme.md`                | Comprehensive summary        |

## 🔍 Testing Deployment

### 1. Local Testing

```bash
# Test build locally
npm run build

# Serve dist folder
cd dist
python -m http.server 8000

# Visit: http://localhost:8000
```

### 2. Production Testing

Sau khi deploy, test các features:

- ✅ **Landing page** loads correctly
- ✅ **Role selection** works
- ✅ **Manager Dashboard** accessible
- ✅ **All CSS/JS** loads properly
- ✅ **Responsive design** on mobile
- ✅ **Charts and modals** work
- ✅ **Excel export** functions

## 🚨 Common Issues & Solutions

### Issue 1: CSS/JS Not Loading

**Problem**: Static assets 404 error

**Solution**: Check file paths in HTML:

```html
<!-- Đảm bảo paths đúng -->
<link rel="stylesheet" href="./manager-styles.css" />
<script src="./manager-script.js"></script>
```

### Issue 2: Routing Problems

**Problem**: 404 on refresh

**Solution**: Configure redirects properly in platform config files

### Issue 3: Build Fails

**Problem**: `Cannot find module scripts/build.js`

**Solution**:

```bash
# Ensure scripts directory exists
mkdir scripts

# Ensure build.js exists (đã tạo ở trên)
ls scripts/build.js
```

### Issue 4: Environment Variables

**Problem**: Config not loading in production

**Solution**: Update `config/app-config.js`:

```javascript
const isProduction = window.location.hostname !== "localhost";
const API_BASE = isProduction
  ? "https://your-domain.com"
  : "http://localhost:8000";
```

## 🔒 Security Considerations

### Production Checklist

- [ ] **Remove debug logs** từ JavaScript
- [ ] **Minimize exposed data** trong mock data
- [ ] **Configure proper headers** (CORS, CSP)
- [ ] **Enable HTTPS** (tự động trên Vercel/Netlify)
- [ ] **Setup error tracking** (Sentry, LogRocket)

### Headers Configuration

Trong `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

## 📈 Performance Optimization

### 1. Asset Optimization

```bash
# Minify CSS (manual for now)
# Future: add build step for minification

# Optimize images
# Convert to WebP format for better compression
```

### 2. Caching Strategy

```json
{
  "headers": [
    {
      "source": "/(.*\\.(css|js))",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### 3. CDN Configuration

All platforms provide global CDN automatically:

- **Vercel**: Edge Network
- **Netlify**: Global CDN
- **Firebase**: Google's CDN
- **GitHub Pages**: FastCDN

## 🔄 CI/CD Setup (Advanced)

### GitHub Actions for Auto-Deploy

Tạo file `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: "16"

      - name: Install dependencies
        run: npm install

      - name: Build project
        run: npm run build

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: "--prod"
```

## 🎉 Success Checklist

Deploy thành công khi:

- ✅ **Build completes** without errors
- ✅ **Landing page accessible** tại root URL
- ✅ **Manager dashboard works** properly
- ✅ **All features functional** (charts, modals, export)
- ✅ **Mobile responsive** design works
- ✅ **Fast loading times** (<3 seconds)
- ✅ **No console errors** in browser

## 📞 Support

Nếu gặp vấn đề khi deploy:

1. **Check build logs** cho error messages
2. **Test locally** trước khi deploy
3. **Verify file paths** trong HTML
4. **Check platform status** (Vercel/Netlify status pages)
5. **Review configuration files** (vercel.json, netlify.toml)

---

**Happy Deploying!** 🚀

Hệ thống Restaurant Management của bạn sẽ sống trên web và sẵn sàng phục vụ!
