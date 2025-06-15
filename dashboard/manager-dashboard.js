document.addEventListener("DOMContentLoaded", function () {
  // Mock data
  const mockStats = {
    dailyRevenue: 2500000,
    totalOrders: 25,
    bestSeller: "Phở bò",
    tablesInUse: 8,
    totalTables: 10,
  };

  const mockRecentOrders = [
    {
      id: "001",
      table: "5",
      time: "10:30",
      items: [
        { name: "Phở bò", quantity: 2, price: 60000 },
        { name: "Cơm rang", quantity: 1, price: 35000 },
      ],
      status: "completed",
      total: 155000,
    },
    {
      id: "002",
      table: "3",
      time: "10:45",
      items: [
        { name: "Bún chả", quantity: 2, price: 45000 },
        { name: "Bánh mì", quantity: 1, price: 25000 },
      ],
      status: "processing",
      total: 115000,
    },
  ];

  function formatCurrency(amount) {
    return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
  }

  function updateStats() {
    document.querySelectorAll(".stat-value").forEach((stat, index) => {
      switch (index) {
        case 0:
          stat.textContent = formatCurrency(mockStats.dailyRevenue);
          break;
        case 1:
          stat.textContent = mockStats.totalOrders;
          break;
        case 2:
          stat.textContent = mockStats.bestSeller;
          break;
        case 3:
          stat.textContent = `${mockStats.tablesInUse}/${mockStats.totalTables}`;
          break;
      }
    });
  }

  function renderRecentOrders() {
    const ordersList = document.querySelector(".orders-list");
    ordersList.innerHTML = mockRecentOrders
      .map(
        (order) => `
            <div class="card" style="margin-bottom: 1rem;">
                <div class="card-header" style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h3>Đơn hàng #${order.id}</h3>
                        <span class="text-gray-500">Bàn ${order.table} - ${
          order.time
        }</span>
                    </div>
                    <span class="status-badge" style="background-color: ${
                      order.status === "completed" ? "#dcfce7" : "#fee2e2"
                    }; color: ${
          order.status === "completed" ? "#166534" : "#991b1b"
        }">
                        ${
                          order.status === "completed"
                            ? "Hoàn thành"
                            : "Đang xử lý"
                        }
                    </span>
                </div>
                <div class="card-content">
                    <ul style="list-style: none;">
                        ${order.items
                          .map(
                            (item) => `
                            <li style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                <span>${item.quantity}x ${item.name}</span>
                                <span>${formatCurrency(
                                  item.quantity * item.price
                                )}</span>
                            </li>
                        `
                          )
                          .join("")}
                    </ul>
                    <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #e5e7eb;">
                        <div style="display: flex; justify-content: space-between; font-weight: bold;">
                            <span>Tổng cộng:</span>
                            <span>${formatCurrency(order.total)}</span>
                        </div>
                    </div>
                </div>
            </div>
        `
      )
      .join("");
  }

  // Initialize dashboard
  updateStats();
  renderRecentOrders();

  // Update stats every minute (in a real app, this would be done with WebSocket)
  setInterval(updateStats, 60000);
});
