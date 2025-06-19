/**
 * Server-side proxy for PayOS API
 *
 * This is a Node.js/Express implementation to proxy requests to PayOS API
 * from your server instead of directly from the browser.
 *
 * How to use:
 * 1. Implement this on your server
 * 2. Change client-side fetch calls to use your proxy endpoint
 */

const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();

// Proxy endpoint for PayOS API
router.post("/payos-proxy", async (req, res) => {
  try {
    // Forward the request to PayOS API
    const response = await fetch("https://api.payos.vn/v2/payment-requests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": req.headers["x-api-key"],
        "x-client-id": req.headers["x-client-id"],
      },
      body: JSON.stringify(req.body),
      timeout: 10000,
    });

    // Forward the response back to client
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error("PayOS proxy error:", error);
    res.status(500).json({
      error: "Payment gateway error",
      message: error.message,
    });
  }
});

module.exports = router;

/**
 * Client-side modification example:
 *
 * // Instead of:
 * fetch('https://api.payos.vn/v2/payment-requests', {...})
 *
 * // Use:
 * fetch('/api/payos-proxy', {...})
 */
