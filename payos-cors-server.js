// PayOS CORS-Fixed Server - Optimized for Live Server
// File: payos-cors-server.js

const express = require("express");
const PayOS = require("@payos/node");

const app = express();
const PORT = process.env.PORT || 3000;

// PayOS Configuration
const payOS = new PayOS(
  "763142a9-9de4-49fd-90e0-7a69efb063e0", // Client ID
  "3b19b80b-d3d8-4632-b9a8-48a45fbe9085", // API Key
  "a7e6a0d36be0b35e9977fd5486896b50d2457d71b2f5fb8968a52a6fa4ea5527" // Checksum Key
);

// Enhanced CORS Middleware - Specifically for Live Server
app.use((req, res, next) => {
  // Get the origin from the request
  const origin = req.headers.origin;
  
  console.log(`[CORS] Request from origin: ${origin}`);
  console.log(`[CORS] Request method: ${req.method}`);
  console.log(`[CORS] Request URL: ${req.url}`);

  // Always set these headers for maximum compatibility
  res.header('Access-Control-Allow-Origin', '*'); // Allow all origins for development
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma');
  res.header('Access-Control-Allow-Credentials', 'false'); // Set to false when using wildcard origin
  res.header('Access-Control-Max-Age', '86400'); // Cache preflight for 24 hours

  // Handle preflight requests immediately
  if (req.method === 'OPTIONS') {
    console.log('[CORS] Handling preflight request');
    res.status(200).send();
    return;
  }

  next();
});

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ========================================
// HEALTH CHECK & TEST ENDPOINTS
// ========================================

// Health check
app.get('/health', (req, res) => {
  console.log('[HEALTH] Health check requested');
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'PayOS CORS-Fixed Server',
    cors: 'enabled',
    version: '2.0'
  });
});

// CORS test endpoint
app.get('/api/test-cors', (req, res) => {
  console.log('[CORS-TEST] CORS test requested');
  res.json({
    message: 'CORS test successful',
    origin: req.headers.origin,
    timestamp: new Date().toISOString(),
    method: req.method,
    headers: req.headers
  });
});

// Simple test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// ========================================
// PAYOS API ENDPOINTS
// ========================================

// Create Payment Link
app.post('/api/payos/create-payment', async (req, res) => {
  console.log('[PAYOS] Create payment request received');
  console.log('[PAYOS] Request body:', JSON.stringify(req.body, null, 2));

  try {
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
    } = req.body;

    // Validate required fields
    if (!orderCode || !amount || !description) {
      console.log('[PAYOS] Missing required fields');
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'orderCode, amount, and description are required',
      });
    }

    // Validate amount (must be positive integer)
    if (!Number.isInteger(amount) || amount <= 0) {
      console.log('[PAYOS] Invalid amount:', amount);
      return res.status(400).json({
        error: 'Invalid amount',
        message: 'Amount must be a positive integer',
      });
    }

    // Validate amount range
    if (amount < 1000 || amount > 500000000) {
      console.log('[PAYOS] Amount out of range:', amount);
      return res.status(400).json({
        error: 'Invalid amount range',
        message: 'Amount must be between 1,000 and 500,000,000 VND',
      });
    }

    // Ensure description is within 25 characters
    const cleanDescription = description.substring(0, 25);
    
    // Prepare PayOS payment data
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

    // Add buyer information if provided and valid
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
    res.json(response);

  } catch (error) {
    console.error('[PAYOS] Payment creation error:', error);
    
    // Handle specific PayOS errors
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
    } else if (error.message.includes('Mô tả') || error.message.includes('25')) {
      errorMessage = 'Mô tả đơn hàng quá dài (tối đa 25 ký tự)';
      statusCode = 400;
    }

    const errorResponse = {
      error: 'Payment creation failed',
      message: errorMessage,
      details: error.message,
    };

    console.log('[PAYOS] Error response:', JSON.stringify(errorResponse, null, 2));
    res.status(statusCode).json(errorResponse);
  }
});

// Get Payment Information
app.get('/api/payos/get-payment', async (req, res) => {
  console.log('[PAYOS] Get payment request');
  
  try {
    const { orderCode } = req.query;

    if (!orderCode || isNaN(orderCode)) {
      return res.status(400).json({
        error: 'Missing or invalid orderCode',
        message: 'Order code must be a valid number',
      });
    }

    const paymentInfo = await payOS.getPaymentLinkInformation(Number(orderCode));

    res.json({
      success: true,
      data: paymentInfo,
    });

  } catch (error) {
    console.error('[PAYOS] Get payment error:', error);
    res.status(500).json({
      error: 'Get payment failed',
      message: 'Không thể lấy thông tin thanh toán',
      details: error.message,
    });
  }
});

// Cancel Payment
app.post('/api/payos/cancel-payment', async (req, res) => {
  console.log('[PAYOS] Cancel payment request');
  
  try {
    const { orderCode, cancellationReason } = req.body;

    if (!orderCode) {
      return res.status(400).json({
        error: 'Missing orderCode',
        message: 'Order code is required',
      });
    }

    const cancelData = {
      cancellationReason: cancellationReason || 'Hủy thanh toán từ hệ thống',
    };

    const cancelResponse = await payOS.cancelPaymentLink(Number(orderCode), cancelData);

    res.json({
      success: true,
      data: cancelResponse,
    });

  } catch (error) {
    console.error('[PAYOS] Cancel payment error:', error);
    res.status(500).json({
      error: 'Cancel payment failed',
      message: 'Không thể hủy thanh toán',
      details: error.message,
    });
  }
});

// PayOS Webhook
app.post('/api/payos/webhook', async (req, res) => {
  console.log('[WEBHOOK] PayOS webhook received:', JSON.stringify(req.body, null, 2));

  try {
    const webhookData = req.body;
    const { orderCode, status, amount, description } = webhookData.data || webhookData;

    console.log(`[WEBHOOK] Order ${orderCode} status: ${status}`);

    res.json({ success: true, message: 'Webhook processed successfully' });

  } catch (error) {
    console.error('[WEBHOOK] Webhook error:', error);
    res.status(500).json({
      error: 'Webhook processing failed',
      message: error.message,
    });
  }
});

// ========================================
// CATCH-ALL ERROR HANDLERS
// ========================================

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  console.log(`[404] API endpoint not found: ${req.originalUrl}`);
  res.status(404).json({
    error: 'API endpoint not found',
    message: `The endpoint ${req.originalUrl} does not exist`,
    availableEndpoints: [
      '/health',
      '/api/test-cors',
      '/api/payos/create-payment',
      '/api/payos/get-payment',
      '/api/payos/cancel-payment',
      '/api/payos/webhook'
    ]
  });
});

// Global error handling middleware
app.use((error, req, res, next) => {
  console.error('[ERROR] Server error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: 'Something went wrong on the server',
    details: process.env.NODE_ENV === 'development' ? error.message : undefined,
  });
});

// Catch-all handler
app.use('*', (req, res) => {
  console.log(`[CATCH-ALL] Unhandled request: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    error: 'Route not found',
    message: `Route ${req.originalUrl} not found`,
  });
});

// Start server
app.listen(PORT, () => {
  console.log('🚀 PayOS CORS-Fixed Server started successfully!');
  console.log(`📱 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 PayOS API: http://localhost:${PORT}/api/payos`);
  console.log(`🌐 CORS test: http://localhost:${PORT}/api/test-cors`);
  console.log(`💳 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔧 CORS: Enabled for all origins (*)`);;
  console.log(`📦 Port: ${PORT}`);
  console.log('✅ Ready for Live Server connections!');
});

module.exports = app;
