// PayOS Backend Integration Example
// File: config/payos-backend-example.js

const express = require('express');
const crypto = require('crypto');
const app = express();

// PayOS Configuration
const PAYOS_CONFIG = {
    CLIENT_ID: process.env.PAYOS_CLIENT_ID,
    API_KEY: process.env.PAYOS_API_KEY,
    CHECKSUM_KEY: process.env.PAYOS_CHECKSUM_KEY,
    PAYMENT_URL: 'https://api-merchant.payos.vn/v2/payment-requests'
};

app.use(express.json());

// Create PayOS Payment Link
app.post('/api/payos/create-payment-link', async (req, res) => {
    try {
        const { orderCode, amount, description, items, returnUrl, cancelUrl } = req.body;
        
        // Validate required fields
        if (!orderCode || !amount || !description) {
            return res.status(400).json({
                error: 'Missing required fields: orderCode, amount, description'
            });
        }

        // PayOS Payment Request Body
        const paymentData = {
            orderCode: orderCode,
            amount: amount,
            description: description,
            items: items || [],
            returnUrl: returnUrl || `${req.protocol}://${req.get('host')}/payment/success`,
            cancelUrl: cancelUrl || `${req.protocol}://${req.get('host')}/payment/cancel`,
            signature: generateSignature(orderCode, amount, description)
        };

        // Call PayOS API
        const response = await fetch(PAYOS_CONFIG.PAYMENT_URL, {
            method: 'POST',
            headers: {
                'x-client-id': PAYOS_CONFIG.CLIENT_ID,
                'x-api-key': PAYOS_CONFIG.API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(paymentData)
        });

        const result = await response.json();

        if (response.ok && result.code === '00') {
            res.json({
                success: true,
                checkoutUrl: result.data.checkoutUrl,
                paymentLinkId: result.data.paymentLinkId,
                orderCode: orderCode
            });
        } else {
            res.status(400).json({
                error: 'PayOS API Error',
                details: result
            });
        }

    } catch (error) {
        console.error('PayOS Error:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
});

// PayOS Webhook Handler
app.post('/api/payos/webhook', (req, res) => {
    try {
        const webhookData = req.body;
        console.log('PayOS Webhook received:', webhookData);

        // Verify webhook signature
        const isValidSignature = verifyWebhookSignature(req.headers, req.body);
        
        if (!isValidSignature) {
            return res.status(401).json({ error: 'Invalid signature' });
        }

        // Handle different webhook events
        switch (webhookData.code) {
            case '00': // Payment successful
                handlePaymentSuccess(webhookData.data);
                break;
            case '01': // Payment failed
                handlePaymentFailure(webhookData.data);
                break;
            case '02': // Payment cancelled
                handlePaymentCancelled(webhookData.data);
                break;
            default:
                console.log('Unknown webhook event:', webhookData.code);
        }

        res.json({ success: true });

    } catch (error) {
        console.error('Webhook Error:', error);
        res.status(500).json({ error: 'Webhook processing failed' });
    }
});

// Get Payment Status
app.get('/api/payos/payment-status/:orderCode', async (req, res) => {
    try {
        const { orderCode } = req.params;
        
        const response = await fetch(`https://api-merchant.payos.vn/v2/payment-requests/${orderCode}`, {
            headers: {
                'x-client-id': PAYOS_CONFIG.CLIENT_ID,
                'x-api-key': PAYOS_CONFIG.API_KEY
            }
        });

        const result = await response.json();
        
        if (response.ok) {
            res.json(result);
        } else {
            res.status(400).json({ error: 'Failed to get payment status' });
        }

    } catch (error) {
        console.error('Status Check Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Helper Functions
function generateSignature(orderCode, amount, description) {
    const data = `amount=${amount}&cancelUrl=${PAYOS_CONFIG.CANCEL_URL}&description=${description}&orderCode=${orderCode}&returnUrl=${PAYOS_CONFIG.RETURN_URL}`;
    return crypto.createHmac('sha256', PAYOS_CONFIG.CHECKSUM_KEY).update(data).digest('hex');
}

function verifyWebhookSignature(headers, body) {
    const signature = headers['x-payos-signature'];
    const computedSignature = crypto
        .createHmac('sha256', PAYOS_CONFIG.CHECKSUM_KEY)
        .update(JSON.stringify(body))
        .digest('hex');
    
    return signature === computedSignature;
}

async function handlePaymentSuccess(paymentData) {
    console.log('Payment successful:', paymentData);
    
    // Update order status in your database
    // Send confirmation email/SMS
    // Update inventory
    // Trigger any other business logic
    
    try {
        // Example: Update order in Firebase
        /*
        const orderRef = db.collection('orders').doc(paymentData.orderCode);
        await orderRef.update({
            status: 'completed',
            paymentTime: admin.firestore.FieldValue.serverTimestamp(),
            paymentMethod: 'PayOS',
            payosTransactionId: paymentData.id
        });
        
        // Create payment record
        const paymentRef = db.collection('payments').doc();
        await paymentRef.set({
            orderId: paymentData.orderCode,
            method: 'payos',
            amount: paymentData.amount,
            status: 'completed',
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
        */
        
    } catch (error) {
        console.error('Error updating payment success:', error);
    }
}

function handlePaymentFailure(paymentData) {
    console.log('Payment failed:', paymentData);
    // Handle payment failure logic
}

function handlePaymentCancelled(paymentData) {
    console.log('Payment cancelled:', paymentData);
    // Handle payment cancellation logic
}

// Environment Variables (.env file)
/*
PAYOS_CLIENT_ID=your_payos_client_id
PAYOS_API_KEY=your_payos_api_key
PAYOS_CHECKSUM_KEY=your_payos_checksum_key
PORT=3000
*/

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`PayOS Backend running on port ${PORT}`);
});

module.exports = app; 