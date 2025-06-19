// PayOS Get Payment Information
// File: api/payos/get-payment.js

import PayOS from "@payos/node";

// PayOS Configuration
const payOS = new PayOS(
  process.env.PAYOS_CLIENT_ID || "763142a9-9de4-49fd-90e0-7a69efb063e0",
  process.env.PAYOS_API_KEY || "3b19b80b-d3d8-4632-b9a8-48a45fbe9085",
  process.env.PAYOS_CHECKSUM_KEY ||
    "a7e6a0d36be0b35e9977fd5486896b50d2457d71b2f5fb8968a52a6fa4ea5527"
);

export default async function handler(req, res) {
  // Support both GET and POST methods
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
      message: "Only GET and POST methods are allowed",
    });
  }

  try {
    // Get payment link ID from query params or body
    const paymentLinkId =
      req.method === "GET" ? req.query.paymentLinkId : req.body.paymentLinkId;

    // Validate required parameter
    if (!paymentLinkId) {
      return res.status(400).json({
        error: "Missing required parameter",
        message: "paymentLinkId is required",
      });
    }

    console.log("Getting PayOS payment information for:", paymentLinkId);

    // Get payment information from PayOS
    const paymentInfo = await payOS.getPaymentLinkInformation(paymentLinkId);

    console.log("PayOS payment information retrieved:", paymentInfo);

    // Return payment information
    return res.status(200).json({
      success: true,
      data: {
        id: paymentInfo.id,
        orderCode: paymentInfo.orderCode,
        amount: paymentInfo.amount,
        amountPaid: paymentInfo.amountPaid,
        amountRemaining: paymentInfo.amountRemaining,
        status: paymentInfo.status,
        createdAt: paymentInfo.createdAt,
        transactions: paymentInfo.transactions,
        cancellationReason: paymentInfo.cancellationReason,
        canceledAt: paymentInfo.canceledAt,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("PayOS Get Payment Error:", error);

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
      message: "Failed to get payment information",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

// Helper function to check payment status
export async function checkPaymentStatus(paymentLinkId) {
  try {
    const paymentInfo = await payOS.getPaymentLinkInformation(paymentLinkId);

    return {
      success: true,
      status: paymentInfo.status,
      isPaid: paymentInfo.status === "PAID",
      isCancelled: paymentInfo.status === "CANCELLED",
      isPending: paymentInfo.status === "PENDING",
      amount: paymentInfo.amount,
      amountPaid: paymentInfo.amountPaid,
      data: paymentInfo,
    };
  } catch (error) {
    console.error("Error checking payment status:", error);
    return {
      success: false,
      error: error.message,
      status: "UNKNOWN",
    };
  }
}

// Helper function to get payment transactions
export async function getPaymentTransactions(paymentLinkId) {
  try {
    const paymentInfo = await payOS.getPaymentLinkInformation(paymentLinkId);

    return {
      success: true,
      transactions: paymentInfo.transactions || [],
      totalTransactions: paymentInfo.transactions?.length || 0,
    };
  } catch (error) {
    console.error("Error getting payment transactions:", error);
    return {
      success: false,
      error: error.message,
      transactions: [],
    };
  }
}
