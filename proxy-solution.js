/**
 * Proxy Solution for PayOS API DNS Issues
 *
 * This file provides an approach to bypass DNS resolution issues by:
 * 1. Setting up a local proxy route on your server
 * 2. Redirecting PayOS API calls through your server
 */

// === SERVER-SIDE CODE (Node.js/Express) ===
// Add this to your server.js or app.js file

const express = require("express");
const axios = require("axios");
const app = express();

// PayOS proxy endpoint
app.post("/api/payos-proxy/payment-requests", async (req, res) => {
  try {
    const response = await axios({
      method: "post",
      url: "https://api.payos.vn/v2/payment-requests",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": req.headers["x-api-key"],
        "x-client-id": req.headers["x-client-id"],
      },
      data: req.body,
      timeout: 10000,
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("PayOS proxy error:", error);

    if (error.response) {
      // Forward PayOS error response
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({
        error: "Payment gateway connection error",
        message: error.message,
      });
    }
  }
});

// === CLIENT-SIDE MODIFICATION ===
// Replace the direct API call in generatePayOSCheckoutUrl function

/*
Instead of:
const response = await fetch('https://api.payos.vn/v2/payment-requests', {...})

Use:
const response = await fetch('/api/payos-proxy/payment-requests', {...})
*/
