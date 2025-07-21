# 🚀 Hướng dẫn Deploy PayOS Server lên Render.com

## 📋 Tổng quan

Website main: `https://digisin-27mb.vercel.app` (đã deploy trên Vercel)
PayOS Server: Sẽ deploy trên Render.com để xử lý thanh toán

## 🛠️ Bước 1: Chuẩn bị PayOS Credentials

1. Đăng nhập vào [PayOS Dashboard](https://my.payos.vn/)
2. Lấy thông tin:
   - `PAYOS_CLIENT_ID`
   - `PAYOS_API_KEY` 
   - `PAYOS_CHECKSUM_KEY`

## 🔗 Bước 2: Deploy Server lên Render

### 2.1 Tạo GitHub Repository

```bash
# Vào thư mục payos-render-server đã tạo
cd payos-render-server

# Initialize git
git init
git add .
git commit -m "Initial PayOS server for Render"

# Tạo repository mới trên GitHub: payos-render-server
git remote add origin https://github.com/yourusername/payos-render-server.git
git branch -M main
git push -u origin main
```

### 2.2 Deploy trên Render.com

1. **Đăng nhập** [Render.com](https://render.com)
2. **New** → **Web Service**
3. **Connect GitHub** → chọn `payos-render-server`
4. **Cấu hình:**
   - Name: `payos-server` 
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Instance Type: `Free` (hoặc `Starter $7/month` để không sleep)

### 2.3 Environment Variables

Trong Render Dashboard → **Environment**:

```
PAYOS_CLIENT_ID = your_actual_client_id
PAYOS_API_KEY = your_actual_api_key
PAYOS_CHECKSUM_KEY = your_actual_checksum_key
NODE_ENV = production
PORT = 10000
```

## 🌐 Bước 3: Cập nhật Frontend trên Vercel

### 3.1 Cập nhật PayOS Config

Sửa file `config/payos-vercel-config.js`:

```javascript
const PAYOS_CONFIG = {
    production: {
        serverUrl: 'https://your-app-name.onrender.com' // ⚠️ THAY BẰNG URL RENDER THỰC TẾ
    }
};
```

### 3.2 Test Connection

Sau khi deploy xong, test server:

```bash
# Health check
curl https://your-app-name.onrender.com/health

# Test từ browser console trên Vercel:
await window.payOSClient.testConnection()
```

## 🔄 Bước 4: Commit và Deploy lên Vercel

```bash
# Commit changes
git add .
git commit -m "Add PayOS Render server integration"
git push origin main

# Vercel sẽ tự động deploy khi detect thay đổi
```

## 🧪 Bước 5: Test Payment Flow

1. **Vào website**: https://digisin-27mb.vercel.app
2. **Đăng nhập** với tài khoản Thu ngân: `thanhhieu@gmail.com / 123456`
3. **Tạo đơn hàng** mới
4. **Click "Thanh toán PayOS"**
5. **Kiểm tra** xem popup payment có mở không

## 📊 Monitoring

### Render Dashboard
- **Logs**: Xem logs server realtime
- **Metrics**: CPU, Memory usage
- **Health**: Status của service

### URLs quan trọng:
- Health check: `https://your-app-name.onrender.com/health`
- Test endpoint: `https://your-app-name.onrender.com/test`
- Create payment: `POST https://your-app-name.onrender.com/create-payment-link`

## 🔧 Troubleshooting

### Lỗi CORS
Server đã cấu hình CORS cho `https://digisin-27mb.vercel.app`

### Server Sleep (Free Plan)
- Free plan sleep sau 15 phút không hoạt động
- Upgrade lên Starter ($7/month) để 24/7
- Hoặc dùng uptime monitor để ping server

### Environment Variables
Kiểm tra trong Render Dashboard → Environment có đủ 4 biến:
- `PAYOS_CLIENT_ID`
- `PAYOS_API_KEY` 
- `PAYOS_CHECKSUM_KEY`
- `NODE_ENV=production`

## 🎯 Kết quả mong đợi

✅ Server PayOS running 24/7 trên Render
✅ Website Vercel kết nối được với server  
✅ Thanh toán PayOS hoạt động smooth
✅ HTTPS & CORS configured đúng
✅ Logs & monitoring đầy đủ

## 💡 Tips

1. **Custom Domain**: Có thể add custom domain cho server Render
2. **SSL**: Tự động có SSL certificate
3. **Auto Deploy**: Git push → Auto deploy
4. **Health Check**: Built-in health monitoring
5. **Scaling**: Easy scale up khi cần

---

**Lưu ý**: Thay `your-app-name` và `yourusername` bằng tên thực tế của bạn!
