# PayOS Render Server

Server PayOS được deploy trên Render.com để xử lý thanh toán cho website https://digisin-27mb.vercel.app

## ⚠️ Render.com Port Configuration

**QUAN TRỌNG**: Render.com tự động gán PORT environment variable. **KHÔNG** được override PORT trong Environment Variables.

- ✅ **Đúng**: Để Render tự động gán port
- ❌ **Sai**: Set PORT=10000 trong Environment Variables

## Environment Variables cần thiết:

**CHỈ CẦN 4 biến sau:**
```
PAYOS_CLIENT_ID=your_client_id
PAYOS_API_KEY=your_api_key  
PAYOS_CHECKSUM_KEY=your_checksum_key
NODE_ENV=production
```

**KHÔNG thiết lập PORT** - Render sẽ tự động cung cấp.

## API Endpoints:

- `GET /` - Health check
- `GET /health` - Detailed health check
- `POST /create-payment-link` - Tạo link thanh toán
- `GET /get-payment-info/:orderId` - Lấy thông tin thanh toán
- `POST /cancel-payment` - Hủy thanh toán
- `POST /webhook` - Webhook callback từ PayOS
- `GET /test` - Test endpoint

## Deploy trên Render:

1. **Tạo Web Service** từ GitHub repo
2. **Build Command**: `npm install`
3. **Start Command**: `npm start`
4. **Environment Variables**: Chỉ thêm 4 biến PayOS (không có PORT)
5. **Health Check Path**: `/health`

## Troubleshooting:

### Port Scan Timeout Error
```
Port scan timeout reached, failed to detect open port 10000
```

**Nguyên nhân**: Render không thể bind vào port cố định.

**Giải pháp**:
- ✅ Server code: `const PORT = process.env.PORT || 3000;`
- ✅ Listen: `app.listen(PORT, '0.0.0.0', callback)`
- ❌ KHÔNG set PORT trong Environment Variables
- ❌ KHÔNG hardcode port 10000

### CORS Issues
Server đã cấu hình CORS cho:
- `https://digisin-27mb.vercel.app`
- `http://localhost:8000` (development)

### PayOS Configuration
Check `/health` endpoint để verify:
```json
{
  "env": {
    "has_payos_config": true,
    "payos_client_id": "configured"
  }
}
```

## Sử dụng từ Vercel:

```javascript
const PAYOS_SERVER_URL = 'https://your-app-name.onrender.com';

// Tạo thanh toán
const response = await fetch(`${PAYOS_SERVER_URL}/create-payment-link`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        orderCode: Date.now(),
        amount: 100000,
        description: 'Thanh toán đơn hàng',
        returnUrl: 'https://digisin-27mb.vercel.app/payment/success',
        cancelUrl: 'https://digisin-27mb.vercel.app/payment/cancel'
    })
});
```

## Logs & Monitoring:

- **Render Dashboard**: Real-time logs
- **Health Check**: `GET /health`
- **Test Connection**: `GET /test`
