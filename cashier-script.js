async function generatePayOSCheckoutUrl(orderData) {
  try {
    // First check if we can resolve any domain to verify internet connectivity
    const connectivityCheck = await checkConnectivity();
    if (!connectivityCheck.connected) {
      throw new Error(
        `Internet connectivity issue: ${connectivityCheck.error}`
      );
    }

    // Add retry logic for potential temporary DNS issues
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      try {
        console.log(
          `Attempt ${attempts + 1}/${maxAttempts} to connect to PayOS API...`
        );

        const response = await fetch(
          "https://api.payos.vn/v2/payment-requests",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": config.payosApiKey,
              "x-client-id": config.payosClientId,
            },
            body: JSON.stringify(orderData),
            // Add timeout to prevent long waits for DNS resolution
            signal: AbortSignal.timeout(5000),
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            `PayOS API error: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();
        return data.checkoutUrl;
      } catch (fetchError) {
        attempts++;

        // If this is DNS related and not the last attempt, retry
        if (
          (fetchError.message.includes("Failed to fetch") ||
            fetchError.message.includes("ERR_NAME_NOT_RESOLVED")) &&
          attempts < maxAttempts
        ) {
          console.log(
            `DNS resolution failed, retrying in ${attempts * 1000}ms...`
          );
          await new Promise((r) => setTimeout(r, attempts * 1000)); // Increasing backoff
          continue;
        }

        // If we've exhausted retries or it's another error, rethrow
        throw fetchError;
      }
    }
  } catch (error) {
    console.error("Payment generation error:", error);

    // Provide more specific error messages based on the failure
    if (
      error.message.includes("ERR_NAME_NOT_RESOLVED") ||
      error.message.includes("Failed to fetch")
    ) {
      showDnsErrorDialog();
      throw new Error(
        "Không thể kết nối đến máy chủ PayOS. Vui lòng kiểm tra kết nối mạng của bạn."
      );
    }

    throw error;
  }
}

// Add helper function to check general connectivity
async function checkConnectivity() {
  try {
    // Try to connect to a reliable domain like Google
    await fetch("https://www.google.com", {
      method: "HEAD",
      mode: "no-cors",
      signal: AbortSignal.timeout(3000),
    });
    return { connected: true };
  } catch (error) {
    return {
      connected: false,
      error: error.message,
    };
  }
}

// Show a helpful error dialog with troubleshooting tips
function showDnsErrorDialog() {
  const dialogHTML = `
    <div class="dns-error-dialog">
      <h3>Lỗi kết nối đến máy chủ thanh toán</h3>
      <p>Không thể kết nối đến <strong>api.payos.vn</strong></p>
      <div class="troubleshooting">
        <h4>Các bước khắc phục:</h4>
        <ol>
          <li>Kiểm tra kết nối mạng của bạn</li>
          <li>Thử đổi sang DNS Google (8.8.8.8, 8.8.4.4)</li>
          <li>Xóa cache DNS (ipconfig /flushdns)</li>
          <li>Tắt VPN nếu đang sử dụng</li>
          <li>Liên hệ quản trị viên nếu vấn đề vẫn tiếp tục</li>
        </ol>
      </div>
      <button class="close-dialog">Đóng</button>
    </div>
  `;

  const dialogOverlay = document.createElement("div");
  dialogOverlay.className = "dialog-overlay";
  dialogOverlay.innerHTML = dialogHTML;
  document.body.appendChild(dialogOverlay);

  dialogOverlay.querySelector(".close-dialog").addEventListener("click", () => {
    dialogOverlay.remove();
  });
}

function initializePayOSPayment() {
  // Set up PayOS listeners
  setupPayOSListeners();
  console.log("PayOS listeners setup complete");

  // Apply size configurations
  applyPayOSSize("medium");
  applyPayOSSize("xl");
  applyPayOSSize("small", {
    minHeight: "350px",
    height: "50vh",
    maxHeight: "400px",
    modalWidth: "1000px",
  });
}

function setupPayOSListeners() {
  // Listen for PayOS events
  window.addEventListener("payos:payment_success", handlePaymentSuccess);
  window.addEventListener("payos:payment_error", handlePaymentError);
  window.addEventListener("payos:payment_cancel", handlePaymentCancel);
  window.addEventListener("payos:popup_close", handlePopupClose);
}

function applyPayOSSize(size, config) {
  // Apply size configuration
  console.log(`PayOS size applied: ${size}`, config || {});
  // Store size configuration for later use
  if (!window.payosSizeConfigs) window.payosSizeConfigs = {};
  window.payosSizeConfigs[size] = config || {};
}

function processPayOSPayment(orderDetails) {
  // Log payment data
  const paymentData = {
    orderId: orderDetails.orderId || "HD001",
    paymentMethod: "payos_banking",
    finalTotal: orderDetails.amount || 178200,
    originalTotal: orderDetails.originalAmount || 165000,
  };
  console.log("PayOS Payment Data:", paymentData);

  // Create PayOS payment
  createPayOSPaymentLink(paymentData)
    .then((checkoutUrl) => {
      // Initialize PayOS checkout with the URL
      initializePayOSCheckout(checkoutUrl);
    })
    .catch((error) => {
      console.error("Error creating PayOS payment:", error);
      showErrorMessage(
        "Không thể tạo liên kết thanh toán. Vui lòng thử lại sau."
      );
    });
}

async function createPayOSPaymentLink(paymentData) {
  try {
    // Create order data
    const timestamp = Math.floor(Date.now() / 1000);
    const orderData = {
      orderCode: timestamp,
      amount: paymentData.finalTotal,
      description: `Thanh toán đơn hàng ${paymentData.orderId} - Bàn 5`,
      clientId: config.payosClientId,
    };

    console.log("Creating PayOS payment with:", orderData);

    // Generate signature
    console.log("Generating PayOS signature...");
    const signature = generatePayOSSignature(orderData);

    // Add signature to the data
    const paymentRequestData = {
      ...orderData,
      hasSignature: true,
    };

    console.log("Calling PayOS API with data:", paymentRequestData);

    // Call PayOS API (or mock it for demonstration)
    const apiResponse = await mockPayOSApiCall(paymentRequestData);
    console.log("PayOS API Response:", apiResponse);

    if (apiResponse.status === 200 && apiResponse.code === "00") {
      // Handle QR code if available
      if (apiResponse.hasQrCode) {
        const qrCodeUrl = generateMockQrCodeUrl(paymentData);
        console.log("PayOS QR Code URL:", qrCodeUrl);
      }

      // Generate checkout URL
      const checkoutUrl = `https://pay.payos.vn/web/${generateRandomId()}`;
      console.log("PayOS Checkout URL created:", checkoutUrl);

      return checkoutUrl;
    } else {
      throw new Error(
        `PayOS API Error: ${apiResponse.code} - ${apiResponse.desc}`
      );
    }
  } catch (error) {
    console.error("Error creating PayOS payment link:", error);
    throw error;
  }
}

function generatePayOSSignature(data) {
  // In a real implementation, you would use a proper HMAC signature
  // This is just a placeholder
  return "generated-signature-would-go-here";
}

function initializePayOSCheckout(checkoutUrl) {
  // Configure PayOS checkout
  const payOSConfig = {
    RETURN_URL: window.location.href,
    ELEMENT_ID: "payos-checkout-container",
    CHECKOUT_URL: checkoutUrl,
    embedded: false,
    onSuccess: (event) => {
      console.log("Payment successful:", event);
      handlePaymentSuccess(event);
    },
    onCancel: (event) => {
      console.log("Payment cancelled:", event);
      handlePaymentCancel(event);
    },
    onExit: (event) => {
      console.log("Payment exited:", event);
      handlePopupClose(event);
    },
  };

  // Initialize PayOS and open checkout
  if (typeof PayOSCheckout !== "undefined" && PayOSCheckout.usePayOS) {
    const { open } = PayOSCheckout.usePayOS(payOSConfig);
    open();
  } else {
    console.error("PayOS SDK not loaded properly");
    showErrorMessage(
      "Không thể khởi tạo cổng thanh toán. Vui lòng làm mới trang."
    );
  }
}

// Event handlers for PayOS events
function handlePaymentSuccess(event) {
  console.log("Payment success event:", event);
  showSuccessMessage("Thanh toán thành công!");
  // Additional success handling like updating order status
}

function handlePaymentError(event) {
  console.log("Payment error event:", event);
  showErrorMessage("Có lỗi xảy ra trong quá trình thanh toán.");
}

function handlePaymentCancel(event) {
  console.log("Payment cancel event:", event);
  showCancelMessage("Thanh toán đã bị hủy.");
}

function handlePopupClose(event) {
  console.log("Popup close event:", event);
  // Handle popup close event
}

// Mock functions for testing (replace with real API calls in production)
async function mockPayOSApiCall(data) {
  // Simulate API response
  return {
    status: 200,
    code: "00",
    desc: "success",
    hasCheckoutUrl: true,
    hasQrCode: true,
  };
}

function generateMockQrCodeUrl(paymentData) {
  // This simulates the QR code data from the logs
  return "00020101021238610010A000000727013100069704520117101425061733894870208QRIBFTTA530370454061782005802VN62180814TT HD001 Ban 5630405CA";
}

function generateRandomId() {
  // Generate a random ID similar to the one in the logs
  return "9071064ead1d4fa488e4c44d8dc93fa0";
}

// Message display functions
function showSuccessMessage(message) {
  showMessage(message, "success");
}

function showErrorMessage(message) {
  showMessage(message, "error");
}

function showCancelMessage(message) {
  showMessage(message, "cancel");
}

function showMessage(message, type) {
  const messageElement = document.createElement("div");
  messageElement.className = `payos-message payos-message-${type}`;
  messageElement.innerHTML = `
    <div class="message-content">${message}</div>
    <button class="message-close" onclick="this.parentNode.remove()">×</button>
  `;
  document.body.appendChild(messageElement);

  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (document.body.contains(messageElement)) {
      messageElement.remove();
    }
  }, 5000);
}

// Initialize PayOS on page load
document.addEventListener("DOMContentLoaded", initializePayOSPayment);
