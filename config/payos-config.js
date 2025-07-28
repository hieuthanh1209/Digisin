// PayOS Configuration for Production
// File: config/payos-config.js

// PayOS Production Configuration
export const PAYOS_CONFIG = {
  // PayOS Credentials - THAY ĐỔI BẰNG CREDENTIALS THỰC TẾ CỦA BẠN
  CLIENT_ID: "763142a9-9de4-49fd-90e0-7a69efb063e0",
  API_KEY: "3b19b80b-d3d8-4632-b9a8-48a45fbe9085",
  CHECKSUM_KEY:
    "a7e6a0d36be0b35e9977fd5486896b50d2457d71b2f5fb8968a52a6fa4ea5527",

  // URLs
  RETURN_URL: window.location.origin + "/dashboard/cashier-dashboard.html",
  CANCEL_URL: window.location.origin + "/dashboard/cashier-dashboard.html",

  // Webhook URL (for production)
  WEBHOOK_URL: window.location.origin + "/api/payos/webhook",

  // PayOS Environment
  ENVIRONMENT: "production", // "sandbox" | "production"

  // Payment Settings
  CURRENCY: "VND",

  // API Endpoints - Updated for Render deployment
  API_ENDPOINTS: {
    CREATE_PAYMENT: "https://digisin-payos-server.onrender.com/create-payment-link",
    GET_PAYMENT: "https://digisin-payos-server.onrender.com/get-payment-info",
    CANCEL_PAYMENT: "https://digisin-payos-server.onrender.com/cancel-payment",
    WEBHOOK: "https://digisin-payos-server.onrender.com/webhook",
  },

  // Timeouts (milliseconds)
  TIMEOUT: {
    PAYMENT_CREATION: 30000, // 30 seconds
    PAYMENT_COMPLETION: 300000, // 5 minutes
  },

  // Validation Rules
  VALIDATION: {
    MIN_AMOUNT: 1000, // Minimum 1,000 VND
    MAX_AMOUNT: 500000000, // Maximum 500,000,000 VND
    MAX_DESCRIPTION_LENGTH: 255,
    MAX_BUYER_NAME_LENGTH: 255,
  },

  // Error Messages
  ERROR_MESSAGES: {
    NETWORK_ERROR:
      "Không thể kết nối tới server thanh toán. Vui lòng kiểm tra kết nối internet.",
    INVALID_AMOUNT: "Số tiền thanh toán không hợp lệ.",
    PAYMENT_TIMEOUT: "Thời gian chờ thanh toán đã hết. Vui lòng thử lại.",
    PAYMENT_FAILED: "Thanh toán không thành công. Vui lòng thử lại.",
    PAYMENT_CANCELLED: "Thanh toán đã bị hủy bởi khách hàng.",
    INVALID_CREDENTIALS: "Thông tin xác thực PayOS không hợp lệ.",
    SERVER_ERROR: "Lỗi server. Vui lòng thử lại sau.",
  },
};

// PayOS Status Codes
export const PAYOS_STATUS = {
  SUCCESS: "00",
  FAILED: "01",
  INVALID_PARAM: "02",

  // Payment Status
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  PAID: "PAID",
  CANCELLED: "CANCELLED",
  EXPIRED: "EXPIRED",
};

// Helper Functions
export const PayOSUtils = {
  // Validate amount
  validateAmount: (amount) => {
    const numAmount = Number(amount);
    return (
      numAmount >= PAYOS_CONFIG.VALIDATION.MIN_AMOUNT &&
      numAmount <= PAYOS_CONFIG.VALIDATION.MAX_AMOUNT &&
      Number.isInteger(numAmount)
    );
  },

  // Format currency for display
  formatCurrency: (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + " ₫";
  },

  // Generate order code from order ID
  generateOrderCode: (orderId) => {
    // Create unique order code by combining timestamp with order ID hash
    const timestamp = Date.now();
    const orderHash = orderId.split('').reduce((hash, char) => {
      hash = ((hash << 5) - hash) + char.charCodeAt(0);
      return hash & hash; // Convert to 32-bit integer
    }, 0);
    
    // Combine timestamp (last 6 digits) with order hash (absolute value, last 4 digits)
    const uniqueCode = parseInt(timestamp.toString().slice(-6) + Math.abs(orderHash).toString().slice(-4));
    
    console.log(`Generated unique order code: ${uniqueCode} for order: ${orderId}`);
    return uniqueCode;
  },

  // Validate email format
  validateEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validate phone number (Vietnamese format)
  validatePhone: (phone) => {
    const phoneRegex = /^(0|\+84)[0-9]{9,10}$/;
    return phoneRegex.test(phone);
  },

  // Sanitize description
  sanitizeDescription: (description) => {
    return description
      .substring(0, PAYOS_CONFIG.VALIDATION.MAX_DESCRIPTION_LENGTH)
      .replace(/[^\w\s\-._(),]/g, "");
  },

  // Sanitize buyer name
  sanitizeBuyerName: (name) => {
    return name
      .substring(0, PAYOS_CONFIG.VALIDATION.MAX_BUYER_NAME_LENGTH)
      .replace(/[^a-zA-ZÀ-ỹ\s]/g, "");
  },

  // Check if PayOS response is successful
  isPaymentSuccessful: (event) => {
    return (
      event.code === PAYOS_STATUS.SUCCESS &&
      event.status === PAYOS_STATUS.PAID &&
      event.cancel === "false"
    );
  },

  // Check if payment was cancelled
  isPaymentCancelled: (event) => {
    return event.status === PAYOS_STATUS.CANCELLED || event.cancel === "true";
  },

  // Get user-friendly error message
  getErrorMessage: (error) => {
    if (error.message?.includes("Failed to fetch")) {
      return PAYOS_CONFIG.ERROR_MESSAGES.NETWORK_ERROR;
    } else if (error.message?.includes("HTTP 400")) {
      return PAYOS_CONFIG.ERROR_MESSAGES.INVALID_AMOUNT;
    } else if (error.message?.includes("HTTP 401")) {
      return PAYOS_CONFIG.ERROR_MESSAGES.INVALID_CREDENTIALS;
    } else if (error.message?.includes("HTTP 500")) {
      return PAYOS_CONFIG.ERROR_MESSAGES.SERVER_ERROR;
    } else if (error.message?.includes("timeout")) {
      return PAYOS_CONFIG.ERROR_MESSAGES.PAYMENT_TIMEOUT;
    }
    return PAYOS_CONFIG.ERROR_MESSAGES.PAYMENT_FAILED;
  },
};

// Export default configuration
export default PAYOS_CONFIG;
