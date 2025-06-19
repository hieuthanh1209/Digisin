// PayOS Backend Integration Example
// File: config/payos-backend-example.js

const express = require("express");
const crypto = require("crypto");
const app = express();

// PayOS Configuration
const PAYOS_CONFIG = {
  CLIENT_ID: process.env.PAYOS_CLIENT_ID,
  API_KEY: process.env.PAYOS_API_KEY,
  CHECKSUM_KEY: process.env.PAYOS_CHECKSUM_KEY,
  PAYMENT_URL: "https://api-merchant.payos.vn/v2/payment-requests",
};

app.use(express.json());

// Create PayOS Payment Link
app.post("/api/payos/create-payment-link", async (req, res) => {
  try {
    const { orderCode, amount, description, items, returnUrl, cancelUrl } =
      req.body;

    // Validate required fields
    if (!orderCode || !amount || !description) {
      return res.status(400).json({
        error: "Missing required fields: orderCode, amount, description",
      });
    }

    // PayOS Payment Request Body
    const paymentData = {
      orderCode: orderCode,
      amount: amount,
      description: description,
      items: items || [],
      returnUrl:
        returnUrl || `${req.protocol}://${req.get("host")}/payment/success`,
      cancelUrl:
        cancelUrl || `${req.protocol}://${req.get("host")}/payment/cancel`,
      signature: generateSignature(orderCode, amount, description),
    };

    // Call PayOS API
    const response = await fetch(PAYOS_CONFIG.PAYMENT_URL, {
      method: "POST",
      headers: {
        "x-client-id": PAYOS_CONFIG.CLIENT_ID,
        "x-api-key": PAYOS_CONFIG.API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    });

    const result = await response.json();

    if (response.ok && result.code === "00") {
      res.json({
        success: true,
        checkoutUrl: result.data.checkoutUrl,
        paymentLinkId: result.data.paymentLinkId,
        orderCode: orderCode,
      });
    } else {
      res.status(400).json({
        error: "PayOS API Error",
        details: result,
      });
    }
  } catch (error) {
    console.error("PayOS Error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
});

// PayOS Webhook Handler
app.post("/api/payos/webhook", (req, res) => {
  try {
    const webhookData = req.body;
    console.log("PayOS Webhook received:", webhookData);

    // Verify webhook signature
    const isValidSignature = verifyWebhookSignature(req.headers, req.body);

    if (!isValidSignature) {
      return res.status(401).json({ error: "Invalid signature" });
    }

    // Handle different webhook events
    switch (webhookData.code) {
      case "00": // Payment successful
        handlePaymentSuccess(webhookData.data);
        break;
      case "01": // Payment failed
        handlePaymentFailure(webhookData.data);
        break;
      case "02": // Payment cancelled
        handlePaymentCancelled(webhookData.data);
        break;
      default:
        console.log("Unknown webhook event:", webhookData.code);
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Webhook Error:", error);
    res.status(500).json({ error: "Webhook processing failed" });
  }
});

// Get Payment Status
app.get("/api/payos/payment-status/:orderCode", async (req, res) => {
  try {
    const { orderCode } = req.params;

    const response = await fetch(
      `https://api-merchant.payos.vn/v2/payment-requests/${orderCode}`,
      {
        headers: {
          "x-client-id": PAYOS_CONFIG.CLIENT_ID,
          "x-api-key": PAYOS_CONFIG.API_KEY,
        },
      }
    );

    const result = await response.json();

    if (response.ok) {
      res.json(result);
    } else {
      res.status(400).json({ error: "Failed to get payment status" });
    }
  } catch (error) {
    console.error("Status Check Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Helper Functions
function generateSignature(orderCode, amount, description) {
  const data = `amount=${amount}&cancelUrl=${PAYOS_CONFIG.CANCEL_URL}&description=${description}&orderCode=${orderCode}&returnUrl=${PAYOS_CONFIG.RETURN_URL}`;
  return crypto
    .createHmac("sha256", PAYOS_CONFIG.CHECKSUM_KEY)
    .update(data)
    .digest("hex");
}

function verifyWebhookSignature(headers, body) {
  const signature = headers["x-payos-signature"];
  const computedSignature = crypto
    .createHmac("sha256", PAYOS_CONFIG.CHECKSUM_KEY)
    .update(JSON.stringify(body))
    .digest("hex");

  return signature === computedSignature;
}

async function handlePaymentSuccess(paymentData) {
  console.log("Payment successful:", paymentData);

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
    console.error("Error updating payment success:", error);
  }
}

function handlePaymentFailure(paymentData) {
  console.log("Payment failed:", paymentData);
  // Handle payment failure logic
}

function handlePaymentCancelled(paymentData) {
  console.log("Payment cancelled:", paymentData);
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

/**
 * UPDATED: PayOS Checkout Script Integration
 *
 * This example shows how to use PayOS with the official PayOS Checkout Script
 * as documented at: https://docs.payos.vn/checkout-script-js
 */

// Frontend Integration with PayOS Checkout Script
const PayOSCheckoutIntegration = {
  /**
   * Initialize PayOS checkout using official PayOS SDK
   */
  async initializePayOSCheckout(orderId, amount, orderData) {
    try {
      // Step 1: Create payment link from backend
      const checkoutUrl = await this.createPaymentFromBackend({
        orderCode: parseInt(orderId.replace(/\D/g, "")) || Date.now(),
        amount: Math.round(amount),
        description: `Thanh toán đơn hàng ${orderId}`,
        returnUrl: window.location.href,
        cancelUrl: window.location.href,
        buyerName: orderData?.customerName || "Khách hàng",
        buyerEmail: orderData?.customerEmail || "customer@example.com",
        buyerPhone: orderData?.customerPhone || "0123456789",
        items: orderData?.items || [],
      });

      if (!checkoutUrl) {
        throw new Error("Failed to create payment link");
      }

      // Step 2: Configure PayOS with official SDK
      const payOSConfig = {
        RETURN_URL: window.location.href,
        ELEMENT_ID: "payos-checkout-iframe",
        CHECKOUT_URL: checkoutUrl,
        embedded: true, // Use embedded iframe
        onSuccess: (event) => {
          console.log("PayOS Success:", event);
          this.handlePaymentSuccess(event);
        },
        onCancel: (event) => {
          console.log("PayOS Cancelled:", event);
          this.handlePaymentCancel(event);
        },
        onExit: (event) => {
          console.log("PayOS Exit:", event);
          this.handlePaymentExit(event);
        },
      };

      // Step 3: Initialize PayOS Checkout
      if (typeof PayOSCheckout !== "undefined") {
        const { open, exit } = PayOSCheckout.usePayOS(payOSConfig);
        return { open, exit };
      } else {
        throw new Error("PayOS SDK not loaded");
      }
    } catch (error) {
      console.error("PayOS initialization error:", error);
      throw error;
    }
  },

  /**
   * Create payment link from backend API
   */
  async createPaymentFromBackend(paymentData) {
    try {
      const response = await fetch("/api/payos/create-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      });

      const result = await response.json();

      if (result.success) {
        return result.checkoutUrl;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Backend API error:", error);
      return null;
    }
  },

  /**
   * Handle successful payment
   */
  handlePaymentSuccess(event) {
    // Event properties:
    // - loading: false
    // - code: "00" (SUCCESS)
    // - id: paymentLinkId
    // - cancel: false
    // - orderCode: order code
    // - status: "PAID"

    if (event.code === "00" && event.status === "PAID") {
      // Payment successful - update UI
      this.completePayment(event);
    }
  },

  /**
   * Handle cancelled payment
   */
  handlePaymentCancel(event) {
    // Event properties similar to success but:
    // - code: "01" (FAILED) or "02" (INVALID_PARAM)
    // - cancel: true
    // - status: "CANCELLED"

    alert("Thanh toán đã bị hủy");
  },

  /**
   * Handle payment window exit
   */
  handlePaymentExit(event) {
    console.log("User closed payment window");
  },

  /**
   * Complete payment process
   */
  async completePayment(paymentEvent) {
    try {
      // Verify payment with backend
      const verification = await fetch(
        `/api/payos/verify/${paymentEvent.orderCode}`
      );
      const verifyResult = await verification.json();

      if (verifyResult.success && verifyResult.status === "PAID") {
        // Update order status in database
        await this.updateOrderStatus(
          paymentEvent.orderCode,
          "completed",
          paymentEvent
        );

        // Show success message
        alert("Thanh toán thành công!");

        // Refresh page or update UI
        location.reload();
      }
    } catch (error) {
      console.error("Payment completion error:", error);
    }
  },

  /**
   * Update order status
   */
  async updateOrderStatus(orderCode, status, paymentData) {
    try {
      const response = await fetch("/api/orders/update-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderCode,
          status,
          paymentData,
        }),
      });

      return await response.json();
    } catch (error) {
      console.error("Order update error:", error);
      return null;
    }
  },
};

// Export for use in cashier dashboard
if (typeof window !== "undefined") {
  window.PayOSCheckoutIntegration = PayOSCheckoutIntegration;
}
