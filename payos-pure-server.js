// PayOS Pure Node.js Server - No Express Dependencies
// File: payos-pure-server.js

const http = require('http');
const url = require('url');
const PayOS = require("@payos/node");

// PayOS Configuration
const payOS = new PayOS(
  "763142a9-9de4-49fd-90e0-7a69efb063e0", // Client ID
  "3b19b80b-d3d8-4632-b9a8-48a45fbe9085", // API Key
  "a7e6a0d36be0b35e9977fd5486896b50d2457d71b2f5fb8968a52a6fa4ea5527" // Checksum Key
);

const PORT = process.env.PORT || 3000;

// CORS Headers Function
function setCORSHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma');
  res.setHeader('Access-Control-Allow-Credentials', 'false');
  res.setHeader('Access-Control-Max-Age', '86400');
}

// Response Helper Functions
function sendJSON(res, data, statusCode = 200) {
  setCORSHeaders(res);
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data, null, 2));
}

function sendError(res, error, message, statusCode = 500) {
  console.error('[ERROR]', error);
  sendJSON(res, {
    error: error,
    message: message,
    timestamp: new Date().toISOString()
  }, statusCode);
}

// Get Request Body Helper
function getRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

// Main Server
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;
  const method = req.method;

  console.log(`[${new Date().toISOString()}] ${method} ${pathname}`);
  console.log(`[CORS] Origin: ${req.headers.origin}`);

  // Set CORS headers for all requests
  setCORSHeaders(res);

  // Handle preflight OPTIONS requests
  if (method === 'OPTIONS') {
    console.log('[CORS] Handling preflight request');
    res.writeHead(200);
    res.end();
    return;
  }

  try {
    // ========================================
    // HEALTH & TEST ENDPOINTS
    // ========================================
    
    if (pathname === '/health' && method === 'GET') {
      sendJSON(res, {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'PayOS Pure Node.js Server',
        cors: 'enabled',
        version: '3.0'
      });
      return;
    }

    if (pathname === '/api/test-cors' && method === 'GET') {
      sendJSON(res, {
        message: 'CORS test successful from Pure Node.js server',
        origin: req.headers.origin,
        timestamp: new Date().toISOString(),
        method: req.method
      });
      return;
    }

    // ========================================
    // PAYOS ENDPOINTS
    // ========================================

    // Create Payment Link
    if (pathname === '/api/payos/create-payment' && method === 'POST') {
      console.log('[PAYOS] Create payment request received');
      
      try {
        const body = await getRequestBody(req);
        console.log('[PAYOS] Request body:', JSON.stringify(body, null, 2));

        const {
          orderCode,
          amount,
          description,
          returnUrl,
          cancelUrl,
          buyerName,
          buyerEmail,
          buyerPhone,
          items,
          orderId,
        } = body;

        // Validate required fields
        if (!orderCode || !amount || !description) {
          sendError(res, 'Missing required fields', 'orderCode, amount, and description are required', 400);
          return;
        }

        // Validate amount
        if (!Number.isInteger(amount) || amount <= 0) {
          sendError(res, 'Invalid amount', 'Amount must be a positive integer', 400);
          return;
        }

        if (amount < 1000 || amount > 500000000) {
          sendError(res, 'Invalid amount range', 'Amount must be between 1,000 and 500,000,000 VND', 400);
          return;
        }

        // Prepare PayOS payment data
        const cleanDescription = description.substring(0, 25);
        
        const paymentData = {
          orderCode: Number(orderCode),
          amount: amount,
          description: cleanDescription,
          returnUrl: returnUrl || `http://localhost:8000/dashboard/cashier-dashboard.html`,
          cancelUrl: cancelUrl || `http://localhost:8000/dashboard/cashier-dashboard.html`,
          items: items?.map(item => ({
            name: (item.name || 'Item').substring(0, 25),
            quantity: item.quantity || 1,
            price: item.price || 0
          })) || [
            {
              name: cleanDescription,
              quantity: 1,
              price: amount,
            },
          ],
        };

        // Add buyer information if provided
        if (buyerName && buyerName.trim()) {
          paymentData.buyerName = buyerName.trim().substring(0, 100);
        }
        if (buyerEmail && buyerEmail.includes('@')) {
          paymentData.buyerEmail = buyerEmail.trim();
        }
        if (buyerPhone && buyerPhone.trim()) {
          paymentData.buyerPhone = buyerPhone.trim();
        }

        console.log('[PAYOS] Sending to PayOS:', JSON.stringify(paymentData, null, 2));

        // Create payment link with PayOS
        const paymentLinkResponse = await payOS.createPaymentLink(paymentData);

        console.log('[PAYOS] PayOS response received:', JSON.stringify(paymentLinkResponse, null, 2));

        // Return success response
        const response = {
          success: true,
          data: paymentLinkResponse,
          checkoutUrl: paymentLinkResponse.checkoutUrl,
          paymentLinkId: paymentLinkResponse.paymentLinkId,
          orderCode: paymentLinkResponse.orderCode,
          qrCode: paymentLinkResponse.qrCode,
        };

        console.log('[PAYOS] Sending response to client:', JSON.stringify(response, null, 2));
        sendJSON(res, response);

      } catch (error) {
        console.error('[PAYOS] Payment creation error:', error);
        
        let errorMessage = 'Có lỗi xảy ra khi tạo liên kết thanh toán';
        let statusCode = 500;

        if (error.message.includes('orderCode')) {
          errorMessage = 'Mã đơn hàng đã tồn tại hoặc không hợp lệ';
          statusCode = 400;
        } else if (error.message.includes('amount')) {
          errorMessage = 'Số tiền không hợp lệ';
          statusCode = 400;
        } else if (error.message.includes('invalid')) {
          errorMessage = 'Thông tin thanh toán không hợp lệ';
          statusCode = 400;
        } else if (error.message.includes('unauthorized')) {
          errorMessage = 'Thông tin xác thực PayOS không hợp lệ';
          statusCode = 401;
        }

        sendError(res, 'Payment creation failed', errorMessage, statusCode);
      }
      return;
    }

    // Get Payment Information
    if (pathname === '/api/payos/get-payment' && method === 'GET') {
      console.log('[PAYOS] Get payment request');
      
      try {
        const { orderCode } = query;

        if (!orderCode || isNaN(orderCode)) {
          sendError(res, 'Missing or invalid orderCode', 'Order code must be a valid number', 400);
          return;
        }

        const paymentInfo = await payOS.getPaymentLinkInformation(Number(orderCode));

        sendJSON(res, {
          success: true,
          data: paymentInfo,
        });

      } catch (error) {
        console.error('[PAYOS] Get payment error:', error);
        sendError(res, 'Get payment failed', 'Không thể lấy thông tin thanh toán', 500);
      }
      return;
    }

    // Cancel Payment
    if (pathname === '/api/payos/cancel-payment' && method === 'POST') {
      console.log('[PAYOS] Cancel payment request');
      
      try {
        const body = await getRequestBody(req);
        const { orderCode, cancellationReason } = body;

        if (!orderCode) {
          sendError(res, 'Missing orderCode', 'Order code is required', 400);
          return;
        }

        const cancelData = {
          cancellationReason: cancellationReason || 'Hủy thanh toán từ hệ thống',
        };

        const cancelResponse = await payOS.cancelPaymentLink(Number(orderCode), cancelData);

        sendJSON(res, {
          success: true,
          data: cancelResponse,
        });

      } catch (error) {
        console.error('[PAYOS] Cancel payment error:', error);
        sendError(res, 'Cancel payment failed', 'Không thể hủy thanh toán', 500);
      }
      return;
    }

    // PayOS Webhook
    if (pathname === '/api/payos/webhook' && method === 'POST') {
      console.log('[WEBHOOK] PayOS webhook received');

      try {
        const body = await getRequestBody(req);
        console.log('[WEBHOOK] Webhook data:', JSON.stringify(body, null, 2));

        const { orderCode, status, amount, description } = body.data || body;
        console.log(`[WEBHOOK] Order ${orderCode} status: ${status}`);

        sendJSON(res, { success: true, message: 'Webhook processed successfully' });

      } catch (error) {
        console.error('[WEBHOOK] Webhook error:', error);
        sendError(res, 'Webhook processing failed', error.message, 500);
      }
      return;
    }

    // ========================================
    // 404 HANDLER
    // ========================================
    
    console.log(`[404] Route not found: ${method} ${pathname}`);
    sendJSON(res, {
      error: 'Route not found',
      message: `Route ${pathname} not found`,
      availableEndpoints: [
        'GET /health',
        'GET /api/test-cors',
        'POST /api/payos/create-payment',
        'GET /api/payos/get-payment',
        'POST /api/payos/cancel-payment',
        'POST /api/payos/webhook'
      ]
    }, 404);

  } catch (error) {
    console.error('[SERVER] Unhandled error:', error);
    sendError(res, 'Internal server error', 'Something went wrong on the server', 500);
  }
});

// Start server
server.listen(PORT, () => {
  console.log('🚀 PayOS Pure Node.js Server started successfully!');
  console.log(`📱 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 PayOS API: http://localhost:${PORT}/api/payos`);
  console.log(`🌐 CORS test: http://localhost:${PORT}/api/test-cors`);
  console.log(`💳 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔧 CORS: Enabled for all origins (*)`);
  console.log(`📦 Port: ${PORT}`);
  console.log('✅ Ready for Live Server connections!');
  console.log('🎯 No Express dependencies - Pure Node.js HTTP server');
});

module.exports = server;
