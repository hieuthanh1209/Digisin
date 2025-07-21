// Test CORS from browser console
// Copy and paste this code into browser console on http://127.0.0.1:5500

async function testCORS() {
  try {
    console.log("Testing CORS...");
    
    // Test health endpoint
    const healthResponse = await fetch('http://localhost:3000/health');
    const healthData = await healthResponse.json();
    console.log("✅ Health check:", healthData);
    
    // Test CORS endpoint
    const corsResponse = await fetch('http://localhost:3000/api/test-cors');
    const corsData = await corsResponse.json();
    console.log("✅ CORS test:", corsData);
    
    // Test PayOS create payment
    const testPayment = {
      orderCode: Date.now(),
      amount: 50000,
      description: "Test CORS",
      items: [{
        name: "Test item",
        quantity: 1,
        price: 50000
      }]
    };
    
    const paymentResponse = await fetch('http://localhost:3000/api/payos/create-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testPayment)
    });
    
    const paymentData = await paymentResponse.json();
    console.log("✅ PayOS payment test:", paymentData);
    
    console.log("🎉 All CORS tests passed!");
    
  } catch (error) {
    console.error("❌ CORS test failed:", error);
  }
}

// Run test
testCORS();
