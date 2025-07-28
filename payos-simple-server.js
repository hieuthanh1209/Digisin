// PayOS Simple Server - Compatible with all Express versions
// File: payos-simple-server.js

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

// CORS Middleware - Manual implementation to avoid Express version conflicts
app.use((req, res, next) => {
  // Set CORS headers
  const origin = req.headers.origin;
  const allowedOrigins = [
    'http://localhost:8000',
    'http://127.0.0.1:8000',
    'http://localhost:5500',
    'http://127.0.0.1:5500',
    'http://localhost:3000',
    'http://127.0.0.1:3000'
  ];

  if (allowedOrigins.includes(origin) || !origin) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Access-Control-Allow-Origin');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }

  next();
});

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ========================================
// PAYOS API ENDPOINTS
// ========================================

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'PayOS Integration Server',
    cors: 'enabled'
  });
});

// Create Payment Link
app.post('/api/payos/create-payment', async (req, res) => {
  try {
    console.log('Creating PayOS payment with data:', JSON.stringify(req.body, null, 2));

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
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'orderCode, amount, and description are required',
      });
    }

    // Validate amount (must be positive integer)
    if (!Number.isInteger(amount) || amount <= 0) {
      return res.status(400).json({
        error: 'Invalid amount',
        message: 'Amount must be a positive integer',
      });
    }

    // Validate amount range
    if (amount < 1000 || amount > 500000000) {
      return res.status(400).json({
        error: 'Invalid amount range',
        message: 'Amount must be between 1,000 and 500,000,000 VND',
      });
    }

    // Prepare PayOS payment data
    const paymentData = {
      orderCode: Number(orderCode),
      amount: amount,
      description: description.substring(0, 25), // Ensure max 25 characters
      returnUrl: returnUrl || `${req.protocol}://${req.get('host')}/dashboard/cashier-dashboard.html`,
      cancelUrl: cancelUrl || `${req.protocol}://${req.get('host')}/dashboard/cashier-dashboard.html`,
      items: items || [
        {
          name: description.substring(0, 25),
          quantity: 1,
          price: amount,
        },
      ],
    };

    // Add buyer information if provided and valid
    if (buyerName && buyerName.trim()) paymentData.buyerName = buyerName.trim();
    if (buyerEmail && buyerEmail.includes('@')) paymentData.buyerEmail = buyerEmail.trim();
    if (buyerPhone && buyerPhone.trim()) paymentData.buyerPhone = buyerPhone.trim();

    console.log('PayOS payment data:', JSON.stringify(paymentData, null, 2));

    // Create payment link with PayOS
    const paymentLinkResponse = await payOS.createPaymentLink(paymentData);

    console.log('PayOS response:', JSON.stringify(paymentLinkResponse, null, 2));

    // Return success response
    res.json({
      success: true,
      data: paymentLinkResponse,
      checkoutUrl: paymentLinkResponse.checkoutUrl,
      paymentLinkId: paymentLinkResponse.paymentLinkId,
      orderCode: paymentLinkResponse.orderCode,
      qrCode: paymentLinkResponse.qrCode,
    });

  } catch (error) {
    console.error('PayOS payment creation error:', error);
    
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
    } else if (error.message.includes('Mô tả')) {
      errorMessage = 'Mô tả đơn hàng quá dài (tối đa 25 ký tự)';
      statusCode = 400;
    }

    res.status(statusCode).json({
      error: 'Payment creation failed',
      message: errorMessage,
      details: error.message,
    });
  }
});

// Get Payment Information
app.get('/api/payos/get-payment', async (req, res) => {
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
    console.error('PayOS get payment error:', error);
    res.status(500).json({
      error: 'Get payment failed',
      message: 'Không thể lấy thông tin thanh toán',
      details: error.message,
    });
  }
});

// Cancel Payment
app.post('/api/payos/cancel-payment', async (req, res) => {
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
    console.error('PayOS cancel payment error:', error);
    res.status(500).json({
      error: 'Cancel payment failed',
      message: 'Không thể hủy thanh toán',
      details: error.message,
    });
  }
});

// PayOS Webhook
app.post('/api/payos/webhook', async (req, res) => {
  try {
    console.log('PayOS webhook received:', JSON.stringify(req.body, null, 2));

    const webhookData = req.body;
    const { orderCode, status, amount, description } = webhookData.data || webhookData;

    console.log(`Webhook: Order ${orderCode} status: ${status}`);

    res.json({ success: true, message: 'Webhook processed successfully' });

  } catch (error) {
    console.error('PayOS webhook error:', error);
    res.status(500).json({
      error: 'Webhook processing failed',
      message: error.message,
    });
  }
});

// Alternative endpoint for create-payment-link (for compatibility)
app.post('/create-payment-link', async (req, res) => {
  try {
    console.log('Creating PayOS payment via /create-payment-link with data:', JSON.stringify(req.body, null, 2));

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
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'orderCode, amount, and description are required',
      });
    }

    // Validate amount (must be positive integer)
    if (!Number.isInteger(amount) || amount <= 0) {
      return res.status(400).json({
        error: 'Invalid amount',
        message: 'Amount must be a positive integer',
      });
    }

    // Validate amount range
    if (amount < 1000 || amount > 500000000) {
      return res.status(400).json({
        error: 'Invalid amount range',
        message: 'Amount must be between 1,000 and 500,000,000 VND',
      });
    }

    // Prepare PayOS payment data
    const paymentData = {
      orderCode: Number(orderCode),
      amount: amount,
      description: description.substring(0, 25), // Ensure max 25 characters
      returnUrl: returnUrl || `${req.protocol}://${req.get('host')}/dashboard/cashier-dashboard.html`,
      cancelUrl: cancelUrl || `${req.protocol}://${req.get('host')}/dashboard/cashier-dashboard.html`,
      items: items || [
        {
          name: description.substring(0, 25),
          quantity: 1,
          price: amount,
        },
      ],
    };

    // Add buyer information if provided and valid
    if (buyerName && buyerName.trim()) paymentData.buyerName = buyerName.trim();
    if (buyerEmail && buyerEmail.includes('@')) paymentData.buyerEmail = buyerEmail.trim();
    if (buyerPhone && buyerPhone.trim()) paymentData.buyerPhone = buyerPhone.trim();

    console.log('PayOS payment data:', JSON.stringify(paymentData, null, 2));

    // Create payment link with PayOS
    const paymentLinkResponse = await payOS.createPaymentLink(paymentData);

    console.log('PayOS response:', JSON.stringify(paymentLinkResponse, null, 2));

    // Return success response
    res.json({
      success: true,
      data: paymentLinkResponse,
      checkoutUrl: paymentLinkResponse.checkoutUrl,
      paymentLinkId: paymentLinkResponse.paymentLinkId,
      orderCode: paymentLinkResponse.orderCode,
      qrCode: paymentLinkResponse.qrCode,
    });

  } catch (error) {
    console.error('PayOS payment creation error:', error);
    
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
    } else if (error.message.includes('Mô tả')) {
      errorMessage = 'Mô tả đơn hàng quá dài (tối đa 25 ký tự)';
      statusCode = 400;
    }

    res.status(statusCode).json({
      error: 'Payment creation failed',
      message: errorMessage,
      details: error.message,
    });
  }
});

// Test endpoint for CORS
app.get('/api/test-cors', (req, res) => {
  res.json({
    message: 'CORS test successful',
    origin: req.headers.origin,
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: 'Something went wrong on the server',
    details: process.env.NODE_ENV === 'development' ? error.message : undefined,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 PayOS Simple Server is running on port ${PORT}`);
  console.log(`📱 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 PayOS API: http://localhost:${PORT}/api/payos`);
  console.log(`🌐 CORS test: http://localhost:${PORT}/api/test-cors`);
  console.log(`💳 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
