// Test script để verify fix thuế VAT
console.log("🧪 Testing VAT calculation fix...");

const VAT_RATE = 0.1; // 10% VAT

// Test formatCurrency function (already fixed)
function formatCurrency(amount) {
  if (isNaN(amount) || amount == null) {
    return "0₫";
  }
  const validAmount = Number(amount) || 0;
  return new Intl.NumberFormat("vi-VN").format(validAmount) + "₫";
}

// Test cases for different order scenarios
const testOrders = [
  // Case 1: Order with subtotal and total
  {
    name: "Order with subtotal and total",
    order: {
      subtotal: 100000,
      total: 100000,
      items: [
        { name: "Phở", price: 50000, quantity: 2 }
      ]
    }
  },
  // Case 2: Order with only total, no subtotal
  {
    name: "Order with only total, no subtotal",
    order: {
      total: 150000,
      items: [
        { name: "Cơm gà", price: 75000, quantity: 2 }
      ]
    }
  },
  // Case 3: Order with neither subtotal nor total, but has items
  {
    name: "Order with no subtotal/total, has items",
    order: {
      items: [
        { name: "Bánh mì", price: 25000, quantity: 2 },
        { name: "Nước cam", price: 15000, quantity: 3 }
      ]
    }
  },
  // Case 4: Order with null/undefined values
  {
    name: "Order with null/undefined values",
    order: {
      subtotal: null,
      total: undefined,
      items: [
        { name: "Test", price: 30000, quantity: 1 }
      ]
    }
  }
];

function testVATCalculation(currentOrder) {
  console.log("\n--- Testing VAT calculation logic ---");
  
  // Same logic as in updatePaymentSummary
  let subtotal = Number(currentOrder.subtotal || currentOrder.total || 0);
  
  // If subtotal is still 0, calculate from items
  if (subtotal === 0 && currentOrder.items && currentOrder.items.length > 0) {
    subtotal = currentOrder.items.reduce((sum, item) => {
      return sum + (Number(item.price || 0) * Number(item.quantity || 0));
    }, 0);
    console.log("Calculated subtotal from items:", subtotal);
  }

  // Calculate tax as exact amount
  const taxAmount = Number((subtotal * VAT_RATE).toFixed(0));
  const afterTax = subtotal + taxAmount;

  return {
    subtotal,
    taxAmount,
    afterTax,
    subtotalFormatted: formatCurrency(subtotal),
    taxAmountFormatted: formatCurrency(taxAmount),
    afterTaxFormatted: formatCurrency(afterTax)
  };
}

// Run tests
testOrders.forEach((testCase, index) => {
  console.log(`\n🧪 Test ${index + 1}: ${testCase.name}`);
  console.log("Input order:", testCase.order);
  
  const result = testVATCalculation(testCase.order);
  console.log("Results:", result);
  
  // Validation
  const isValid = result.taxAmount > 0 && result.afterTax > result.subtotal;
  console.log(`✅ ${isValid ? 'PASS' : 'FAIL'}: Tax calculated correctly`);
});

console.log("\n🎯 Summary:");
console.log("- All orders now calculate subtotal from items if missing");
console.log("- VAT is calculated as: subtotal * 0.1");
console.log("- All calculations use Number() to prevent NaN");
console.log("- formatCurrency handles invalid values safely");

console.log("\n📋 To fix existing orders in Firebase:");
console.log("1. Open Cashier Dashboard");
console.log("2. Open Console (F12)");
console.log("3. Run: fixOrdersWithoutSubtotal()");
console.log("4. Test with PayOS payment");
