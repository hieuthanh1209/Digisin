// PayOS Webhook Handler
// File: api/payos/webhook.js

import PayOS from "@payos/node";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../../src/firebase.js";

// PayOS Configuration
const payOS = new PayOS(
  process.env.PAYOS_CLIENT_ID || "763142a9-9de4-49fd-90e0-7a69efb063e0",
  process.env.PAYOS_API_KEY || "3b19b80b-d3d8-4632-b9a8-48a45fbe9085",
  process.env.PAYOS_CHECKSUM_KEY ||
    "a7e6a0d36be0b35e9977fd5486896b50d2457d71b2f5fb8968a52a6fa4ea5527"
);

export default async function handler(req, res) {
  // Only allow POST method for webhooks
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
      message: "Only POST method is allowed for webhooks",
    });
  }

  try {
    const webhookData = req.body;
    console.log("PayOS Webhook received:", webhookData);

    // Verify webhook signature for security
    const isValidSignature = payOS.verifyPaymentWebhookData(webhookData);

    if (!isValidSignature) {
      console.error("Invalid PayOS webhook signature");
      return res.status(400).json({
        error: "Invalid signature",
        message: "Webhook signature verification failed",
      });
    }

    // Extract payment data
    const { data } = webhookData;

    if (!data || !data.orderCode) {
      console.error("Invalid webhook data structure");
      return res.status(400).json({
        error: "Invalid data",
        message: "Missing required payment data",
      });
    }

    // Find the order by PayOS order code
    const orderId = await findOrderByPayOSCode(data.orderCode);

    if (!orderId) {
      console.error("Order not found for PayOS code:", data.orderCode);
      return res.status(404).json({
        error: "Order not found",
        message: `No order found for PayOS order code: ${data.orderCode}`,
      });
    }

    // Update order based on payment status
    await updateOrderPaymentStatus(orderId, data);

    console.log("PayOS webhook processed successfully for order:", orderId);

    // Return success response to PayOS
    return res.status(200).json({
      success: true,
      message: "Webhook processed successfully",
      orderId: orderId,
      orderCode: data.orderCode,
    });
  } catch (error) {
    console.error("PayOS Webhook Error:", error);

    // Return error response to PayOS (will trigger retry)
    return res.status(500).json({
      error: "Webhook processing failed",
      message: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}

// Helper function to find order by PayOS order code
async function findOrderByPayOSCode(payosOrderCode) {
  try {
    // This would typically query your database
    // For now, we'll implement a simple search

    // In a real implementation, you might:
    // 1. Query Firestore with where clause on payosOrderCode field
    // 2. Use a separate mapping table
    // 3. Extract order ID from the order code format

    // Simple extraction assuming order code contains order ID
    const orderIdMatch = payosOrderCode.toString().match(/\d+/);
    if (orderIdMatch) {
      return `ORDER-${orderIdMatch[0]}`;
    }

    return null;
  } catch (error) {
    console.error("Error finding order by PayOS code:", error);
    return null;
  }
}

// Helper function to update order payment status
async function updateOrderPaymentStatus(orderId, paymentData) {
  try {
    const orderRef = doc(db, "orders", orderId);

    // Get current order data
    const orderDoc = await getDoc(orderRef);
    if (!orderDoc.exists()) {
      throw new Error(`Order ${orderId} not found in database`);
    }

    const orderData = orderDoc.data();

    // Prepare update data based on payment status
    const updateData = {
      payosWebhookReceived: true,
      payosWebhookTimestamp: new Date().toISOString(),
      payosWebhookData: paymentData,
    };

    switch (paymentData.status) {
      case "PAID":
        updateData.paymentStatus = "paid";
        updateData.paymentTime = new Date();
        updateData.payosStatus = "PAID";
        updateData.completedAt = new Date();
        break;

      case "CANCELLED":
        updateData.paymentStatus = "cancelled";
        updateData.payosStatus = "CANCELLED";
        updateData.cancelledAt = new Date();
        break;

      case "PENDING":
        updateData.paymentStatus = "pending";
        updateData.payosStatus = "PENDING";
        break;

      default:
        console.warn("Unknown payment status:", paymentData.status);
        updateData.payosStatus = paymentData.status;
    }

    // Update the order
    await updateDoc(orderRef, updateData);

    console.log(
      `Order ${orderId} updated with PayOS status: ${paymentData.status}`
    );

    // Additional processing based on status
    if (paymentData.status === "PAID") {
      await handleSuccessfulPayment(orderId, paymentData);
    } else if (paymentData.status === "CANCELLED") {
      await handleCancelledPayment(orderId, paymentData);
    }
  } catch (error) {
    console.error("Error updating order payment status:", error);
    throw error;
  }
}

// Handle successful payment
async function handleSuccessfulPayment(orderId, paymentData) {
  try {
    console.log("Processing successful payment for order:", orderId);

    // Additional business logic for successful payments:
    // 1. Send confirmation email/SMS
    // 2. Update inventory
    // 3. Generate receipt
    // 4. Notify kitchen/staff
    // 5. Update analytics/reporting

    // Example: Log successful payment
    console.log("Payment successful:", {
      orderId,
      amount: paymentData.amount,
      orderCode: paymentData.orderCode,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error handling successful payment:", error);
    // Don't throw error as payment was already successful
  }
}

// Handle cancelled payment
async function handleCancelledPayment(orderId, paymentData) {
  try {
    console.log("Processing cancelled payment for order:", orderId);

    // Additional business logic for cancelled payments:
    // 1. Release reserved inventory
    // 2. Notify staff
    // 3. Update analytics
    // 4. Clean up temporary data

    console.log("Payment cancelled:", {
      orderId,
      orderCode: paymentData.orderCode,
      reason: paymentData.cancellationReason,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error handling cancelled payment:", error);
    // Don't throw error as cancellation was already processed
  }
}

// Export helper functions for testing
export {
  findOrderByPayOSCode,
  updateOrderPaymentStatus,
  handleSuccessfulPayment,
  handleCancelledPayment,
};
