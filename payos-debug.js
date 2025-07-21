// PayOS Debug & Test Functions
// File: payos-debug.js

// Test PayOS success return
function testPayOSSuccess() {
  console.log('[TEST] Simulating PayOS success return...');
  
  // Check if there are any pending orders to use for test
  const pendingOrdersElement = document.getElementById('pendingOrders');
  const orderCards = pendingOrdersElement?.querySelectorAll('[data-order-id]');
  
  if (orderCards && orderCards.length > 0) {
    // Use the first pending order for test
    const firstOrderId = orderCards[0].getAttribute('data-order-id');
    console.log('[TEST] Using existing pending order:', firstOrderId);
    
    // Create fake URL params for successful payment
    const testParams = new URLSearchParams({
      code: '00',
      status: 'PAID',
      orderCode: '999',
      orderId: firstOrderId
    });
    
    // Create fake payment info
    const testPaymentInfo = {
      orderCode: 999,
      orderId: firstOrderId,
      amount: 100000,
      subtotal: 90000,
      vat: 9000,
      discount: 0,
      discountCode: '',
      paymentMethod: 'PayOS',
      checkoutUrl: 'https://pay.payos.vn/test',
      timestamp: new Date(),
      status: 'pending'
    };
    
    // Store in localStorage
    localStorage.setItem('payos_payment_999', JSON.stringify(testPaymentInfo));
    
    // Call handlePayOSReturn
    handlePayOSReturn(testParams);
  } else {
    console.log('[TEST] No pending orders found, showing generic success popup...');
    
    // Just show the success modal without Firebase update
    if (window.showPayOSResult) {
      showPayOSResult(true, "Test thanh toán thành công! (Không có đơn hàng thực để cập nhật)", null);
    } else {
      console.error('[TEST] showPayOSResult function not found');
    }
  }
}

// Test PayOS success popup (UI only - no Firebase update)
function testPayOSSuccessUI() {
  console.log('[TEST] Testing PayOS success UI only...');
  
  if (window.showPayOSResult) {
    showPayOSResult(true, "Test thanh toán thành công! Tổng tiền: 100,000₫", {
      amount: 100000,
      orderCode: 999,
      orderId: 'TEST-UI-ONLY'
    });
    
    if (window.showNotification) {
      showNotification("Test PayOS success popup - UI only!", "success");
    }
  } else {
    console.error('[TEST] showPayOSResult function not found');
  }
}

// Test PayOS failure popup (UI only)
function testPayOSFailureUI() {
  console.log('[TEST] Testing PayOS failure UI only...');
  
  if (window.showPayOSResult) {
    showPayOSResult(false, "Test thanh toán thất bại! Lỗi demo.", null);
    
    if (window.showNotification) {
      showNotification("Test PayOS failure popup - UI only!", "error");
    }
  } else {
    console.error('[TEST] showPayOSResult function not found');
  }
}

// Test PayOS cancel return
function testPayOSCancel() {
  console.log('[TEST] Simulating PayOS cancel return...');
  
  const testParams = new URLSearchParams({
    cancelled: 'true',
    orderCode: '125',
    orderId: 'TEST-ORDER-003'
  });
  
  handlePayOSReturn(testParams);
}

// Clear all PayOS localStorage data
function clearPayOSStorage() {
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith('payos_payment_')) {
      localStorage.removeItem(key);
      console.log('[DEBUG] Removed:', key);
    }
  });
  console.log('[DEBUG] Cleared all PayOS localStorage data');
}

// Check PayOS localStorage
function checkPayOSStorage() {
  const keys = Object.keys(localStorage);
  const payosKeys = keys.filter(key => key.startsWith('payos_payment_'));
  
  console.log('[DEBUG] PayOS localStorage entries:', payosKeys.length);
  payosKeys.forEach(key => {
    try {
      const data = JSON.parse(localStorage.getItem(key));
      console.log(`[DEBUG] ${key}:`, data);
    } catch (e) {
      console.log(`[DEBUG] ${key}: Invalid JSON`);
    }
  });
}

// Test server connection
async function testPayOSServer() {
  try {
    console.log('[TEST] Testing PayOS server connection...');
    
    const response = await fetch('http://localhost:3000/health');
    if (response.ok) {
      const data = await response.json();
      console.log('[TEST] Server health check success:', data);
    } else {
      console.error('[TEST] Server health check failed:', response.status);
    }
    
    const corsResponse = await fetch('http://localhost:3000/api/test-cors');
    if (corsResponse.ok) {
      const corsData = await corsResponse.json();
      console.log('[TEST] CORS test success:', corsData);
    } else {
      console.error('[TEST] CORS test failed:', corsResponse.status);
    }
    
  } catch (error) {
    console.error('[TEST] Server test failed:', error);
  }
}

// Export functions to global scope for testing
window.testPayOSSuccess = testPayOSSuccess;
window.testPayOSSuccessUI = testPayOSSuccessUI;
window.testPayOSFailureUI = testPayOSFailureUI;
window.testPayOSCancel = testPayOSCancel;
window.clearPayOSStorage = clearPayOSStorage;
window.checkPayOSStorage = checkPayOSStorage;
window.testPayOSServer = testPayOSServer;

console.log('[DEBUG] PayOS debug functions loaded. Available commands:');
console.log('- testPayOSSuccessUI(): Test successful payment popup (UI only)');
console.log('- testPayOSFailureUI(): Test failed payment popup (UI only)');
console.log('- testPayOSSuccess(): Test successful payment with real order');
console.log('- testPayOSCancel(): Test cancelled payment return');
console.log('- clearPayOSStorage(): Clear all PayOS localStorage');
console.log('- checkPayOSStorage(): Check PayOS localStorage');
console.log('- testPayOSServer(): Test server connection');
