// Test PayOS Integration
// File: test-payos-integration.js

async function testPayOSIntegration() {
  console.log("🧪 Testing PayOS Integration...");

  // Test 1: Health Check
  try {
    const healthResponse = await fetch("http://localhost:3000/health");
    const healthData = await healthResponse.json();
    console.log("✅ Health Check:", healthData);
  } catch (error) {
    console.error("❌ Health Check Failed:", error);
    return;
  }

  // Test 2: Create Payment Link
  try {
    const testPayment = {
      orderCode: Date.now(), // Use timestamp as unique order code
      amount: 50000, // 50,000 VND
      description: "Don hang thu nghiem", // Max 25 characters
      returnUrl: "http://localhost:8000/dashboard/cashier-dashboard.html?test=success",
      cancelUrl: "http://localhost:8000/dashboard/cashier-dashboard.html?test=cancelled",
      items: [
        {
          name: "Pho bo dac biet",
          quantity: 1,
          price: 50000
        }
      ],
      buyerEmail: "test@example.com",
      buyerPhone: "0123456789"
    };

    console.log("📤 Creating test payment:", testPayment);

    const createResponse = await fetch("http://localhost:3000/api/payos/create-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(testPayment)
    });

    const createData = await createResponse.json();
    
    if (createResponse.ok) {
      console.log("✅ Payment Created Successfully:", {
        orderCode: createData.orderCode,
        checkoutUrl: createData.checkoutUrl,
        paymentLinkId: createData.paymentLinkId
      });

      // Test 3: Get Payment Information
      try {
        const getResponse = await fetch(`http://localhost:3000/api/payos/get-payment?orderCode=${createData.orderCode}`);
        const getData = await getResponse.json();
        
        if (getResponse.ok) {
          console.log("✅ Payment Info Retrieved:", {
            status: getData.data.status,
            amount: getData.data.amount,
            description: getData.data.description
          });
        } else {
          console.log("⚠️ Get Payment Warning:", getData);
        }
      } catch (error) {
        console.error("❌ Get Payment Failed:", error);
      }

      // Optional: Test Cancel Payment (uncomment if needed)
      /*
      try {
        const cancelResponse = await fetch("http://localhost:3000/api/payos/cancel-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            orderCode: createData.orderCode,
            cancellationReason: "Test cancellation"
          })
        });

        const cancelData = await cancelResponse.json();
        
        if (cancelResponse.ok) {
          console.log("✅ Payment Cancelled Successfully:", cancelData);
        } else {
          console.log("⚠️ Cancel Payment Warning:", cancelData);
        }
      } catch (error) {
        console.error("❌ Cancel Payment Failed:", error);
      }
      */

      // Display checkout URL for manual testing
      console.log("\n🔗 Manual Test:");
      console.log("Copy this URL to browser to test payment flow:");
      console.log(createData.checkoutUrl);
      
    } else {
      console.error("❌ Payment Creation Failed:", createData);
    }

  } catch (error) {
    console.error("❌ Payment Creation Error:", error);
  }

  console.log("\n✨ PayOS Integration Test Completed!");
}

// Test frontend integration
function testFrontendIntegration() {
  console.log("\n🌐 Testing Frontend Integration...");
  
  // Check if PayOS config is loaded
  if (typeof window !== 'undefined' && window.PAYOS_CONFIG) {
    console.log("✅ PayOS Config Loaded");
  } else {
    console.log("⚠️ PayOS Config Not Found (expected in browser)");
  }

  // Check if PayOS functions are available
  const payosFunctions = [
    'processPayOSPayment',
    'handlePayOSReturn',
    'printPayOSInvoice'
  ];

  payosFunctions.forEach(funcName => {
    if (typeof window !== 'undefined' && window[funcName]) {
      console.log(`✅ ${funcName} function available`);
    } else {
      console.log(`⚠️ ${funcName} function not found (expected in browser)`);
    }
  });

  console.log("✨ Frontend Integration Test Completed!");
}

// Run tests
if (typeof window === 'undefined') {
  // Node.js environment
  testPayOSIntegration();
} else {
  // Browser environment
  testFrontendIntegration();
  
  // Add test button to page if in cashier dashboard
  if (window.location.pathname.includes('cashier-dashboard')) {
    const testButton = document.createElement('button');
    testButton.textContent = '🧪 Test PayOS';
    testButton.className = 'btn btn-warning position-fixed';
    testButton.style.cssText = 'top: 10px; right: 10px; z-index: 9999;';
    testButton.onclick = () => {
      testPayOSIntegration();
      alert('Check console for test results');
    };
    document.body.appendChild(testButton);
  }
}

module.exports = { testPayOSIntegration, testFrontendIntegration };
