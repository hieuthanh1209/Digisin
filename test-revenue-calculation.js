// Test script để kiểm tra logic tính doanh thu hôm nay
// Chạy trong browser console của manager dashboard

async function testRevenueCalculation() {
  console.log("🧪 Starting revenue calculation test...");

  try {
    // Get today's date range
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

    console.log(
      `📅 Testing for date range: ${startOfDay.toISOString()} to ${endOfDay.toISOString()}`
    );

    // Get all orders
    const allOrders = await getAllOrders();
    console.log(`📦 Total orders in database: ${allOrders.length}`);

    // Analyze all orders
    let paidCount = 0;
    let unpaidCount = 0;
    let todayPaidCount = 0;
    let todayPaidAmount = 0;

    allOrders.forEach((order) => {
      // Check payment status
      if (order.paymentStatus === "paid") {
        paidCount++;

        // Check if today
        let orderDate = null;
        let dateSource = "";

        if (order.updatedAt) {
          if (typeof order.updatedAt.toDate === "function") {
            orderDate = order.updatedAt.toDate();
            dateSource = "updatedAt";
          } else if (order.updatedAt instanceof Date) {
            orderDate = order.updatedAt;
            dateSource = "updatedAt";
          } else {
            orderDate = new Date(order.updatedAt);
            dateSource = "updatedAt";
          }
        } else if (order.paidAt) {
          if (typeof order.paidAt.toDate === "function") {
            orderDate = order.paidAt.toDate();
            dateSource = "paidAt";
          } else if (order.paidAt instanceof Date) {
            orderDate = order.paidAt;
            dateSource = "paidAt";
          } else {
            orderDate = new Date(order.paidAt);
            dateSource = "paidAt";
          }
        } else if (order.createdAt) {
          if (typeof order.createdAt.toDate === "function") {
            orderDate = order.createdAt.toDate();
            dateSource = "createdAt";
          } else if (order.createdAt instanceof Date) {
            orderDate = order.createdAt;
            dateSource = "createdAt";
          } else {
            orderDate = new Date(order.createdAt);
            dateSource = "createdAt";
          }
        }

        if (orderDate && orderDate >= startOfDay && orderDate <= endOfDay) {
          todayPaidCount++;
          todayPaidAmount += order.totalAmount || 0;
          console.log(
            `✅ Today's order: ${order.id} - Amount: ${
              order.totalAmount
            } - Date: ${orderDate.toISOString()} (${dateSource})`
          );
        }
      } else {
        unpaidCount++;
      }
    });

    console.log(`📊 Analysis Results:`);
    console.log(`   Total orders: ${allOrders.length}`);
    console.log(`   Paid orders: ${paidCount}`);
    console.log(`   Unpaid orders: ${unpaidCount}`);
    console.log(`   Today's paid orders: ${todayPaidCount}`);
    console.log(
      `   Today's revenue: ${new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(todayPaidAmount)}`
    );

    // Compare with current display
    const currentDisplayElement = document.getElementById("todayRevenue");
    if (currentDisplayElement) {
      console.log(`   Current display: ${currentDisplayElement.textContent}`);
    }

    // Show recent paid orders
    console.log(`\n📋 Recent paid orders (last 10):`);
    const recentPaidOrders = allOrders
      .filter((order) => order.paymentStatus === "paid")
      .sort((a, b) => {
        const dateA = a.updatedAt || a.paidAt || a.createdAt || new Date(0);
        const dateB = b.updatedAt || b.paidAt || b.createdAt || new Date(0);

        const timeA =
          typeof dateA.toDate === "function"
            ? dateA.toDate().getTime()
            : dateA instanceof Date
            ? dateA.getTime()
            : new Date(dateA).getTime();
        const timeB =
          typeof dateB.toDate === "function"
            ? dateB.toDate().getTime()
            : dateB instanceof Date
            ? dateB.getTime()
            : new Date(dateB).getTime();

        return timeB - timeA; // Most recent first
      })
      .slice(0, 10);

    recentPaidOrders.forEach((order) => {
      const orderDate = order.updatedAt || order.paidAt || order.createdAt;
      const displayDate =
        typeof orderDate.toDate === "function"
          ? orderDate.toDate()
          : orderDate instanceof Date
          ? orderDate
          : new Date(orderDate);
      console.log(
        `   ${order.id}: ${
          order.totalAmount
        } VND - ${displayDate.toISOString()}`
      );
    });
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

// Auto-run test
console.log(
  "📝 Revenue calculation test script loaded. Run testRevenueCalculation() to test."
);

// Also make it available globally
window.testRevenueCalculation = testRevenueCalculation;
