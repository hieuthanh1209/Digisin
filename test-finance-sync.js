// Test script for Finance Sync functionality
// This script helps verify the order-to-finance sync process

console.log("🧪 Starting Finance Sync Tests...");

// Test data structure for orders
const mockOrders = [
  {
    id: "order_001",
    paymentStatus: "paid",
    totalAmount: 150000,
    total: 150000, // fallback field
    createdAt: new Date("2024-01-15T10:30:00Z"),
    updatedAt: new Date("2024-01-15T11:00:00Z"), // completion time
    cashierId: "cashier_001",
    tableId: "table_5",
    tableNumber: 5,
    paymentMethod: "cash",
    items: [
      { name: "Phở bò", quantity: 2, price: 60000 },
      { name: "Trà đá", quantity: 2, price: 15000 },
    ],
    subtotal: 135000,
    tax: 15000,
    discount: 0,
    customerInfo: { name: "Nguyen Van A", phone: "0987654321" },
  },
  {
    id: "order_002",
    paymentStatus: "paid",
    totalAmount: 200000,
    createdAt: new Date("2024-01-15T12:00:00Z"),
    updatedAt: new Date("2024-01-15T12:30:00Z"),
    cashierId: "cashier_002",
    tableId: "table_3",
    tableNumber: 3,
    paymentMethod: "card",
    items: [
      { name: "Cơm gà", quantity: 1, price: 80000 },
      { name: "Canh chua", quantity: 1, price: 40000 },
      { name: "Nước ngọt", quantity: 2, price: 40000 },
    ],
    subtotal: 160000,
    tax: 40000,
    discount: 0,
  },
  {
    id: "order_003",
    paymentStatus: "pending", // This should be skipped
    totalAmount: 120000,
    createdAt: new Date("2024-01-15T13:00:00Z"),
    updatedAt: new Date("2024-01-15T13:30:00Z"),
    cashierId: "cashier_001",
    tableId: "table_1",
    tableNumber: 1,
    paymentMethod: "cash",
  },
];

// Test functions
function testDateLogic() {
  console.log("\n📅 Testing Date Logic:");

  mockOrders.forEach((order) => {
    const transactionDate = order.updatedAt || order.createdAt || new Date();
    const shouldInclude = order.paymentStatus === "paid";

    console.log(`Order ${order.id}:`);
    console.log(`  - Status: ${order.paymentStatus}`);
    console.log(`  - Created: ${order.createdAt?.toISOString()}`);
    console.log(`  - Updated: ${order.updatedAt?.toISOString()}`);
    console.log(`  - Transaction Date: ${transactionDate.toISOString()}`);
    console.log(`  - Should sync: ${shouldInclude}`);
    console.log("");
  });
}

function testRevenueCalculation() {
  console.log("\n💰 Testing Revenue Calculation:");

  // Filter paid orders
  const paidOrders = mockOrders.filter(
    (order) => order.paymentStatus === "paid"
  );

  // Calculate revenue
  const totalRevenue = paidOrders.reduce((total, order) => {
    return total + (order.totalAmount || order.total || 0);
  }, 0);

  console.log(`Total paid orders: ${paidOrders.length}`);
  console.log(`Total revenue: ${totalRevenue.toLocaleString("vi-VN")} VNĐ`);

  // Test date filtering (today)
  const today = new Date();
  const startOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    0,
    0,
    0,
    0
  );
  const endOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    23,
    59,
    59,
    999
  );

  const todayOrders = paidOrders.filter((order) => {
    const orderDate = order.updatedAt || order.createdAt;
    return orderDate >= startOfDay && orderDate <= endOfDay;
  });

  console.log(`Today's orders: ${todayOrders.length}`);
  console.log(
    `Today's revenue: ${todayOrders
      .reduce((total, order) => total + (order.totalAmount || 0), 0)
      .toLocaleString("vi-VN")} VNĐ`
  );
}

function testFinanceTransactionStructure() {
  console.log("\n🏗️ Testing Finance Transaction Structure:");

  const sampleOrder = mockOrders[0];
  const transactionDate =
    sampleOrder.updatedAt || sampleOrder.createdAt || new Date();

  const financeData = {
    type: "income",
    category: "sales",
    amount: sampleOrder.totalAmount || sampleOrder.total || 0,
    description: `Doanh thu từ đơn hàng #${sampleOrder.id}`,
    date: transactionDate,
    paymentMethod: sampleOrder.paymentMethod || "Tiền mặt",
    orderId: sampleOrder.id,
    tableId: sampleOrder.tableId || null,
    invoice: {
      cashierId: sampleOrder.cashierId || "system",
      cashierName: "Thu ngân A", // Would be fetched from staff
      tableId: sampleOrder.tableId || null,
      tableNumber: sampleOrder.tableNumber || null,
      items: sampleOrder.items || [],
      subtotal: sampleOrder.subtotal || 0,
      vat: sampleOrder.vat || sampleOrder.tax || 0,
      discount: sampleOrder.discount || 0,
      total: sampleOrder.totalAmount || sampleOrder.total || 0,
      paymentMethod: sampleOrder.paymentMethod || "Tiền mặt",
      customerInfo: sampleOrder.customerInfo || null,
    },
    notes: `Đơn hàng bàn ${
      sampleOrder.tableId || sampleOrder.tableNumber || "N/A"
    } - ${sampleOrder.customerInfo?.name || "Khách lẻ"}`,
    createdBy: "system",
  };

  console.log("Sample finance transaction:");
  console.log(JSON.stringify(financeData, null, 2));
}

function testSyncResults() {
  console.log("\n📊 Testing Sync Results:");

  const results = {
    total: mockOrders.length,
    processed: mockOrders.filter((o) => o.paymentStatus === "paid").length,
    skipped: 0, // Would be counted during actual sync
    errors: 0,
  };

  console.log("Sync results:");
  console.log(`  - Total orders: ${results.total}`);
  console.log(`  - Processed: ${results.processed}`);
  console.log(`  - Skipped: ${results.skipped}`);
  console.log(`  - Errors: ${results.errors}`);

  // Generate user message
  let message = `Đồng bộ hoàn tất: ${results.processed} đơn được xử lý`;
  if (results.skipped > 0) {
    message += `, ${results.skipped} đơn đã tồn tại`;
  }
  if (results.errors > 0) {
    message += `, ${results.errors} lỗi`;
  }

  console.log(`User message: "${message}"`);
}

// Run tests
testDateLogic();
testRevenueCalculation();
testFinanceTransactionStructure();
testSyncResults();

console.log("\n✅ All tests completed!");

// Export for use in browser console
if (typeof window !== "undefined") {
  window.financeTest = {
    mockOrders,
    testDateLogic,
    testRevenueCalculation,
    testFinanceTransactionStructure,
    testSyncResults,
  };

  console.log("\n📝 Test functions available in window.financeTest");
  console.log("   - Run window.financeTest.testDateLogic() to test date logic");
  console.log(
    "   - Run window.financeTest.testRevenueCalculation() to test revenue calculation"
  );
  console.log(
    "   - Run window.financeTest.testFinanceTransactionStructure() to test structure"
  );
  console.log(
    "   - Run window.financeTest.testSyncResults() to test sync results"
  );
}
