// PayOS Cancel Payment
// File: api/payos/cancel-payment.js

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
  // Only allow POST method
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
      message: "Only POST method is allowed",
    });
  }

  try {
    const { paymentLinkId, cancellationReason, orderId } = req.body;

    // Validate required fields
    if (!paymentLinkId) {
      return res.status(400).json({
        error: "Missing required fields",
        message: "paymentLinkId is required",
      });
    }

    console.log("Cancelling PayOS payment:", {
      paymentLinkId,
      cancellationReason,
      orderId,
    });

    // Cancel payment link using PayOS SDK
    const cancellationResult = await payOS.cancelPaymentLink(
      paymentLinkId,
      cancellationReason || "Cancelled by merchant"
    );

    console.log("PayOS payment cancelled successfully:", cancellationResult);

    // Update order status if order ID is provided
    if (orderId) {
      await updateOrderCancellation(
        orderId,
        cancellationResult,
        cancellationReason
      );
    }

    // Return success response
    return res.status(200).json({
      success: true,
      data: {
        paymentLinkId: cancellationResult.paymentLinkId || paymentLinkId,
        orderCode: cancellationResult.orderCode,
        status: cancellationResult.status || "CANCELLED",
        cancellationReason: cancellationReason,
        cancelledAt: new Date().toISOString(),
      },
      message: "Payment cancelled successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("PayOS Cancel Payment Error:", error);

    // Handle specific PayOS errors
    if (error.code) {
      // Check if payment is already paid or expired
      if (
        error.code === "PAYMENT_LINK_NOT_FOUND" ||
        error.code === "PAYMENT_LINK_EXPIRED"
      ) {
        return res.status(400).json({
          error: "Cannot Cancel Payment",
          code: error.code,
          message:
            "Payment link cannot be cancelled (not found, expired, or already paid)",
          details: error,
        });
      }

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
      message: "Failed to cancel payment",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

// Helper function to update order cancellation in database
async function updateOrderCancellation(orderId, cancellationResult, reason) {
  try {
    const orderRef = doc(db, "orders", orderId);

    // Check if order exists
    const orderDoc = await getDoc(orderRef);
    if (!orderDoc.exists()) {
      console.warn(`Order ${orderId} not found when updating cancellation`);
      return;
    }

    // Update order with cancellation information
    const updateData = {
      paymentStatus: "cancelled",
      paymentCancelled: true,
      paymentCancelledAt: new Date(),
      paymentCancellationReason: reason || "Cancelled by merchant",
      payosStatus: "CANCELLED",
      payosCancellationData: cancellationResult,
      updatedAt: new Date(),
    };

    await updateDoc(orderRef, updateData);

    console.log(`Order ${orderId} updated with cancellation status`);
  } catch (error) {
    console.error("Error updating order cancellation:", error);
    // Don't throw error as cancellation was already successful in PayOS
  }
}

// Helper function to cancel payment by order ID
export async function cancelPaymentByOrderId(orderId, reason) {
  try {
    // Get order to find PayOS payment link ID
    const orderRef = doc(db, "orders", orderId);
    const orderDoc = await getDoc(orderRef);

    if (!orderDoc.exists()) {
      throw new Error(`Order ${orderId} not found`);
    }

    const orderData = orderDoc.data();
    const paymentLinkId = orderData.payosPaymentLinkId;

    if (!paymentLinkId) {
      throw new Error(`No PayOS payment link found for order ${orderId}`);
    }

    // Cancel the payment
    const cancellationResult = await payOS.cancelPaymentLink(
      paymentLinkId,
      reason
    );

    // Update order status
    await updateOrderCancellation(orderId, cancellationResult, reason);

    return {
      success: true,
      data: cancellationResult,
      orderId: orderId,
      paymentLinkId: paymentLinkId,
    };
  } catch (error) {
    console.error("Error cancelling payment by order ID:", error);
    return {
      success: false,
      error: error.message,
      orderId: orderId,
    };
  }
}

// Helper function to bulk cancel payments
export async function bulkCancelPayments(paymentLinkIds, reason) {
  const results = [];

  for (const paymentLinkId of paymentLinkIds) {
    try {
      const result = await payOS.cancelPaymentLink(paymentLinkId, reason);
      results.push({
        paymentLinkId,
        success: true,
        data: result,
      });
    } catch (error) {
      results.push({
        paymentLinkId,
        success: false,
        error: error.message,
      });
    }
  }

  return results;
}

// Export helper functions
export { updateOrderCancellation, cancelPaymentByOrderId, bulkCancelPayments };
