# PayOS Render Server

Server PayOS được deploy trên Render.com để xử lý thanh toán cho website https://digisin-27mb.vercel.app

## Environment Variables cần thiết:

```
PAYOS_CLIENT_ID=your_client_id
PAYOS_API_KEY=your_api_key  
PAYOS_CHECKSUM_KEY=your_checksum_key
NODE_ENV=production
PORT=10000
```

## API Endpoints:

- `GET /` - Health check
- `GET /health` - Detailed health check
- `POST /create-payment-link` - Tạo link thanh toán
- `GET /get-payment-info/:orderId` - Lấy thông tin thanh toán
- `POST /cancel-payment` - Hủy thanh toán
- `POST /webhook` - Webhook callback từ PayOS
- `GET /test` - Test endpoint

## Deploy trên Render:

1. Tạo repository trên GitHub với code này
2. Kết nối với Render.com
3. Cấu hình Environment Variables
4. Deploy

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
