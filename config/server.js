const express = require("express");
const cors = require("cors");
const { PayOS } = require("@payos/node");
const app = express();

app.use(express.json());
app.use(cors({ origin: "http://127.0.0.1:5500" })); // Adjust origin for your frontend

const payos = new PayOS({
  clientId: "763142a9-9de4-49fd-90e0-7a69efb063e0", // From payos-config.js
  apiKey: "3b19b80b-d3d8-4632-b9a8-48a45fbe9085",
  checksumKey:
    "a7e6a0d36be0b35e9977fd5486896b50d2457d71b2f5fb8968a52a6fa4ea5527",
});

app.post("/api/payos/create-payment", async (req, res) => {
  const { orderId, amount } = req.body;
  try {
    const paymentData = {
      orderCode: `ORDER_${orderId}_${Date.now()}`,
      amount: Math.round(amount),
      description: `Thanh toán đơn hàng ${orderId}`,
      returnUrl: "http://127.0.0.1:5500/dashboard/cashier-dashboard.html", // Match PAYOS_CONFIG.RETURN_URL
      cancelUrl: "http://127.0.0.1:5500/dashboard/cashier-dashboard.html",
    };
    const response = await payos.createPaymentLink(paymentData);
    res.json({ checkoutUrl: response.checkoutUrl });
  } catch (error) {
    console.error("Error creating payment link:", error);
    res.status(500).json({ error: "Failed to create payment link" });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
