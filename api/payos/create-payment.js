// PayOS Backend API Implementation
// File: api/payos/create-payment.js

import PayOS from "@payos/node";

// PayOS Configuration - Thay đổi với credentials thực tế của bạn
const payOS = new PayOS(
  "763142a9-9de4-49fd-90e0-7a69efb063e0", // Client ID
  "3b19b80b-d3d8-4632-b9a8-48a45fbe9085", // API Key
  "a7e6a0d36be0b35e9977fd5486896b50d2457d71b2f5fb8968a52a6fa4ea5527" // Checksum Key
);

export default async function handler(req, res) {
  // Chỉ cho phép POST method
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
      message: "Only POST method is allowed",
    });
  }

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
      return res.status(400).json({
        error: "Missing required fields",
        message: "orderCode, amount, and description are required",
      });
    }

    // Validate amount (must be positive integer)
    if (!Number.isInteger(amount) || amount <= 0) {
      return res.status(400).json({
        error: "Invalid amount",
        message: "Amount must be a positive integer",
      });
    }

    // Prepare PayOS payment data
    const paymentData = {
      orderCode: orderCode,
      amount: amount,
      description: description,
      returnUrl:
        returnUrl || `${req.headers.origin}/dashboard/cashier-dashboard.html`,
      cancelUrl:
        cancelUrl || `${req.headers.origin}/dashboard/cashier-dashboard.html`,
      signature: null, // PayOS will calculate this
    };

    // Add buyer information if provided
    if (buyerName) paymentData.buyerName = buyerName;
    if (buyerEmail) paymentData.buyerEmail = buyerEmail;
    if (buyerPhone) paymentData.buyerPhone = buyerPhone;

    // Add items if provided
    if (items && Array.isArray(items) && items.length > 0) {
      paymentData.items = items.map((item) => ({
        name: item.name || "Sản phẩm",
        quantity: item.quantity || 1,
        price: item.price || 0,
      }));
    }

    console.log("Creating PayOS payment with data:", paymentData);

    // Create payment link using PayOS SDK
    const paymentLinkResponse = await payOS.createPaymentLink(paymentData);

    console.log("PayOS response:", paymentLinkResponse);

    // Return success response
    return res.status(200).json({
      success: true,
      data: {
        checkoutUrl: paymentLinkResponse.checkoutUrl,
        paymentLinkId: paymentLinkResponse.paymentLinkId,
        orderCode: paymentLinkResponse.orderCode,
        qrCode: paymentLinkResponse.qrCode,
        accountNumber: paymentLinkResponse.accountNumber,
        accountName: paymentLinkResponse.accountName,
        amount: paymentLinkResponse.amount,
        description: paymentLinkResponse.description,
        currency: paymentLinkResponse.currency || "VND",
        status: paymentLinkResponse.status,
      },
      orderId: orderId,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("PayOS API Error:", error);

    // Handle specific PayOS errors
    if (error.code) {
      return res.status(400).json({
        error: "PayOS Error",
        code: error.code,
        message: error.desc || error.message || "PayOS service error",
        details: error,
      });
    }

    // Handle general errors
    return res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to create payment link",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

// Webhook handler for PayOS payment confirmation
export async function handlePayOSWebhook(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const webhookData = req.body;

    // Verify webhook signature (important for security)
    const isValidSignature = payOS.verifyPaymentWebhookData(webhookData);

    if (!isValidSignature) {
      console.error("Invalid PayOS webhook signature");
      return res.status(400).json({ error: "Invalid signature" });
    }

    // Process payment confirmation
    const { data } = webhookData;

    console.log("PayOS Webhook received:", data);

    // Here you would update your database with payment confirmation
    // Example:
    // await updateOrderPaymentStatus(data.orderCode, data);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("PayOS Webhook Error:", error);
    return res.status(500).json({ error: "Webhook processing failed" });
  }
}

// Helper function to get payment information
export async function getPaymentInfo(paymentLinkId) {
  try {
    const paymentInfo = await payOS.getPaymentLinkInformation(paymentLinkId);
    return {
      success: true,
      data: paymentInfo,
    };
  } catch (error) {
    console.error("Error getting payment info:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Helper function to cancel payment
export async function cancelPayment(paymentLinkId, cancellationReason) {
  try {
    const result = await payOS.cancelPaymentLink(
      paymentLinkId,
      cancellationReason
    );
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("Error cancelling payment:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}
