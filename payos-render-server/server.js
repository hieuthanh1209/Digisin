const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const PayOS = require('@payos/node');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize PayOS
const payOS = new PayOS(
    process.env.PAYOS_CLIENT_ID,
    process.env.PAYOS_API_KEY,
    process.env.PAYOS_CHECKSUM_KEY
);

// Security middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration for your Vercel domain
app.use(cors({
    origin: [
        'http://localhost:8000',
        'http://localhost:3000',
        'https://digisin-27mb.vercel.app', // Your Vercel domain
        'https://*.vercel.app', // Allow all Vercel preview deployments
        'https://digisin-payos-server.onrender.com' // Allow self-requests
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    optionsSuccessStatus: 200 // Support legacy browsers
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    console.log('Headers:', req.headers);
    if (req.body && Object.keys(req.body).length > 0) {
        console.log('Body:', JSON.stringify(req.body, null, 2));
    }
    next();
});

// Health check endpoint
app.get('/', (req, res) => {
    res.json({ 
        message: 'PayOS Server is running on Render!',
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV,
        port: PORT,
        actual_port: process.env.PORT || 'not set',
        vercel_connected: 'https://digisin-27mb.vercel.app'
    });
});

// Detailed health check
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        env: {
            node_env: process.env.NODE_ENV,
            port: PORT,
            render_port: process.env.PORT,
            has_payos_config: !!(process.env.PAYOS_CLIENT_ID && process.env.PAYOS_API_KEY),
            payos_client_id: process.env.PAYOS_CLIENT_ID ? 'configured' : 'missing',
            connected_domains: [
                'https://digisin-27mb.vercel.app'
            ]
        },
        routes: [
            'GET /',
            'GET /health',
            'POST /create-payment-link',
            'GET /get-payment-info/:orderId',
            'POST /cancel-payment',
            'POST /webhook'
        ]
    });
});

// Create payment link
app.post('/create-payment-link', async (req, res) => {
    try {
        console.log('Creating payment link with data:', req.body);
        
        const { 
            orderCode, 
            amount, 
            description, 
            items, 
            returnUrl, 
            cancelUrl,
            buyerName,
            buyerEmail,
            buyerPhone,
            buyerAddress 
        } = req.body;

        // Validate required fields
        if (!orderCode || !amount || !description) {
            return res.status(400).json({
                error: 'Missing required fields: orderCode, amount, description'
            });
        }

        // Prepare payment data
        const paymentData = {
            orderCode: parseInt(orderCode),
            amount: parseInt(amount),
            description: description,
            items: items || [{
                name: description,
                quantity: 1,
                price: parseInt(amount)
            }],
            returnUrl: returnUrl || 'https://digisin-27mb.vercel.app/payment/success',
            cancelUrl: cancelUrl || 'https://digisin-27mb.vercel.app/payment/cancel'
        };

        // Add buyer info if provided
        if (buyerName || buyerEmail || buyerPhone) {
            paymentData.buyerInfo = {};
            if (buyerName) paymentData.buyerInfo.buyerName = buyerName;
            if (buyerEmail) paymentData.buyerInfo.buyerEmail = buyerEmail;
            if (buyerPhone) paymentData.buyerInfo.buyerPhone = buyerPhone;
            if (buyerAddress) paymentData.buyerInfo.buyerAddress = buyerAddress;
        }

        console.log('Sending to PayOS:', paymentData);

        // Create payment link
        const paymentLink = await payOS.createPaymentLink(paymentData);
        
        console.log('PayOS response:', paymentLink);

        res.json({
            success: true,
            data: paymentLink,
            orderCode: orderCode
        });

    } catch (error) {
        console.error('Payment creation error:', error);
        res.status(500).json({ 
            error: error.message,
            details: error.response?.data || 'Unknown error'
        });
    }
});

// Get payment information
app.get('/get-payment-info/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        console.log('Getting payment info for order:', orderId);

        const paymentInfo = await payOS.getPaymentLinkInformation(parseInt(orderId));
        
        res.json({
            success: true,
            data: paymentInfo
        });

    } catch (error) {
        console.error('Get payment info error:', error);
        res.status(500).json({ 
            error: error.message,
            details: error.response?.data || 'Unknown error'
        });
    }
});

// Cancel payment
app.post('/cancel-payment', async (req, res) => {
    try {
        const { orderCode, cancellationReason } = req.body;
        console.log('Cancelling payment:', orderCode);

        const result = await payOS.cancelPaymentLink(
            parseInt(orderCode), 
            cancellationReason || 'Cancelled by user'
        );
        
        res.json({
            success: true,
            data: result
        });

    } catch (error) {
        console.error('Cancel payment error:', error);
        res.status(500).json({ 
            error: error.message,
            details: error.response?.data || 'Unknown error'
        });
    }
});

// Webhook endpoint for PayOS callbacks
app.post('/webhook', (req, res) => {
    try {
        console.log('Webhook received:', req.body);
        
        // Verify webhook signature if needed
        // const signature = req.headers['x-payos-signature'];
        
        // Process the webhook data
        const webhookData = req.body;
        
        // You can add your webhook processing logic here
        // For example, update order status in your database
        
        res.json({ 
            success: true, 
            message: 'Webhook received successfully' 
        });

    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).json({ 
            error: error.message 
        });
    }
});

// Test endpoint
app.get('/test', (req, res) => {
    res.json({
        message: 'PayOS server test successful!',
        timestamp: new Date().toISOString(),
        from_vercel: req.headers.origin === 'https://digisin-27mb.vercel.app'
    });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({ 
        error: 'Internal Server Error',
        message: error.message,
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.method} ${req.path} not found`,
        availableRoutes: [
            'GET /',
            'GET /health',
            'POST /create-payment-link',
            'GET /get-payment-info/:orderId',
            'POST /cancel-payment',
            'POST /webhook',
            'GET /test'
        ]
    });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 PayOS Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV}`);
    console.log(`🌐 Server URL: http://0.0.0.0:${PORT}`);
    console.log(`⚙️  Render PORT env: ${process.env.PORT}`);
    console.log(`🔗 Connected to Vercel: https://digisin-27mb.vercel.app`);
    console.log(`💳 PayOS configured: ${!!(process.env.PAYOS_CLIENT_ID && process.env.PAYOS_API_KEY)}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    process.exit(0);
});
