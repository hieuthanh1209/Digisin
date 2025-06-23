// Mock data
let orders = [
  {
    id: "HD001",
    table: "Bàn 5",
    items: [
      { name: "Phở bò tái", quantity: 2 },
      { name: "Mì siêu cay pro max", quantity: 1 },
      { name: "Nước chanh", quantity: 2 },
    ],
    notes: "Không hành, ít cay, thêm rau thơm",
    status: "pending",
    orderTime: new Date(Date.now() - 15 * 60000), // 15 minutes ago
    estimatedTime: 25,
  },
  {
    id: "HD002",
    table: "Bàn 3",
    items: [
      { name: "Cơm gà nướng", quantity: 1 },
      { name: "Trà đá", quantity: 1 },
    ],
    notes: "Gà nướng vừa chín, không quá khô",
    status: "preparing",
    orderTime: new Date(Date.now() - 30 * 60000), // 30 minutes ago
    estimatedTime: 15,
  },
  {
    id: "HD003",
    table: "Bàn 7",
    items: [{ name: "Bún bò Huế", quantity: 2 }],
    notes: "",
    status: "ready",
    orderTime: new Date(Date.now() - 45 * 60000), // 45 minutes ago
    estimatedTime: 5,
  },
  {
    id: "HD004",
    table: "Bàn 2",
    items: [
      { name: "Bánh mì thịt nướng", quantity: 3 },
      { name: "Cà phê sữa đá", quantity: 2 },
    ],
    notes: "Bánh mì ít đường, cà phê đậm đà",
    status: "pending",
    orderTime: new Date(Date.now() - 20 * 60000),
    estimatedTime: 20,
  },
  {
    id: "HD005",
    table: "Bàn 9",
    items: [
      { name: "Bún chả Hà Nội", quantity: 1 },
      { name: "Sinh tố bơ", quantity: 1 },
    ],
    notes: "Bún chả ít ngọt, sinh tố không đá",
    status: "completed",
    orderTime: new Date(Date.now() - 60 * 60000), // 1 hour ago
    estimatedTime: 0,
  },
];

// Initialize when page loads
document.addEventListener("DOMContentLoaded", function () {
  // Initialize Lucide icons
  lucide.createIcons();

  // Initialize Bootstrap tabs
  const triggerTabList = document.querySelectorAll("#orderTabs button");
  triggerTabList.forEach((triggerEl) => {
    const tabTrigger = new bootstrap.Tab(triggerEl);

    triggerEl.addEventListener("click", (event) => {
      event.preventDefault();
      tabTrigger.show();
    });
  });

  updateStats();
  renderAllOrders();
});

function updateStats() {
  const stats = {
    pending: orders.filter((o) => o.status === "pending").length,
    preparing: orders.filter((o) => o.status === "preparing").length,
    ready: orders.filter((o) => o.status === "ready").length,
    completed: orders.filter((o) => o.status === "completed").length,
  };

  document.getElementById("pendingCount").textContent = stats.pending;
  document.getElementById("preparingCount").textContent = stats.preparing;
  document.getElementById("readyCount").textContent = stats.ready;
  document.getElementById("completedCount").textContent = stats.completed;

  // Update tab counts
  document.getElementById("pendingTabCount").textContent = stats.pending;
  document.getElementById("preparingTabCount").textContent = stats.preparing;
  document.getElementById("readyTabCount").textContent = stats.ready;
  document.getElementById("completedTabCount").textContent = stats.completed;
}

function renderAllOrders() {
  renderOrdersByStatus("pending");
  renderOrdersByStatus("preparing");
  renderOrdersByStatus("ready");
  renderOrdersByStatus("completed");
}

function renderOrdersByStatus(status) {
  const container = document.getElementById(`${status}Orders`);
  const statusOrders = orders.filter((order) => order.status === status);

  if (statusOrders.length === 0) {
    container.innerHTML = createEmptyState(status);
    return;
  }

  container.innerHTML = statusOrders
    .map((order) => createOrderCard(order))
    .join("");

  // Re-initialize Lucide icons
  setTimeout(() => {
    lucide.createIcons();
  }, 100);
}

function createOrderCard(order) {
  const timeAgo = getTimeAgo(order.orderTime);
  const statusColor = getStatusInfo(order.status);

  return `
        <div class="col-lg-6 col-xl-6">
            <div class="order-card">
                <div class="order-header ${
                  order.status
                } d-flex justify-content-between align-items-center">
                    <div class="d-flex align-items-center">
                        <div>
                            <h5 class="mb-1 fw-bold">${order.id}</h5>
                            <small class="order-time">
                                <i data-lucide="clock" style="width: 16px; height: 16px;"></i>
                                <span class="ms-1">${timeAgo}</span>
                            </small>
                        </div>
                    </div>
                    <div class="d-flex align-items-center gap-3">
                        <span class="badge bg-dark fs-6">${order.table}</span>
                        <span class="status-badge ${order.status}">${
    statusColor.label
  }</span>
                    </div>
                </div>
                
                <div class="order-content">
                    <div class="order-items mb-3">
                        ${order.items
                          .map(
                            (item) => `
                            <div class="order-item">
                                <div class="d-flex align-items-center">
                                    <span class="item-quantity">${item.quantity}</span>
                                    <span>${item.name}</span>
                                </div>
                            </div>
                        `
                          )
                          .join("")}
                    </div>
                    
                    ${
                      order.notes
                        ? `
                        <div class="order-notes">
                            <i data-lucide="sticky-note" style="width: 14px; height: 14px;"></i>
                            <strong>Ghi chú:</strong> ${order.notes}
                        </div>
                    `
                        : ""
                    }
                    
                    <div class="order-actions d-flex justify-content-between align-items-center">
                        <div class="estimated-time">
                            <i data-lucide="timer" style="width: 16px; height: 16px;"></i>
                            <span>${order.estimatedTime} phút</span>
                        </div>
                        <div class="d-flex gap-2">
                            ${createActionButtons(order)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function createActionButtons(order) {
  switch (order.status) {
    case "pending":
      return `
                <button class="btn btn-enhanced btn-primary btn-sm" onclick="updateOrderStatus('${order.id}', 'preparing')">
                    <i data-lucide="chef-hat" style="width: 16px; height: 16px;"></i>
                    Bắt đầu chế biến
                </button>
            `;
    case "preparing":
      return `
                <button class="btn btn-enhanced btn-success btn-sm" onclick="updateOrderStatus('${order.id}', 'ready')">
                    <i data-lucide="check-circle-2" style="width: 16px; height: 16px;"></i>
                    Hoàn thành
                </button>
            `;
    case "ready":
      return `
                <button class="btn btn-enhanced btn-outline-danger btn-sm" onclick="updateOrderStatus('${order.id}', 'preparing')">
                    <i data-lucide="arrow-left" style="width: 16px; height: 16px;"></i>
                    Quay lại
                </button>
                <button class="btn btn-enhanced btn-success btn-sm" onclick="updateOrderStatus('${order.id}', 'completed')">
                    <i data-lucide="check-circle-2" style="width: 16px; height: 16px;"></i>
                    Đã phục vụ
                </button>
            `;
    case "completed":
      return `
                <small class="text-muted">
                    <i data-lucide="check-circle-2" style="width: 16px; height: 16px;"></i>
                    Đã hoàn thành
                </small>
            `;
    default:
      return "";
  }
}

function createEmptyState(status) {
  const messages = {
    pending: {
      title: "Không có đơn hàng nào",
      desc: "Chưa có đơn hàng mới cần xử lý",
    },
    preparing: {
      title: "Không có đơn đang chế biến",
      desc: "Chưa có món nào đang được chế biến",
    },
    ready: {
      title: "Không có món nào sẵn sàng",
      desc: "Chưa có món nào hoàn thành chờ phục vụ",
    },
    completed: {
      title: "Chưa có đơn hoàn thành",
      desc: "Chưa có đơn hàng nào được hoàn thành hôm nay",
    },
  };

  const message = messages[status];

  return `
        <div class="col-12">
            <div class="empty-state">
                <div class="empty-icon">
                    <i data-lucide="clipboard-list" style="width: 5rem; height: 5rem;"></i>
                </div>
                <h3 class="empty-title">${message.title}</h3>
                <p class="empty-description">${message.desc}</p>
            </div>
        </div>
    `;
}

function getStatusInfo(status) {
  const statusMap = {
    pending: { label: "Chờ xử lý", color: "warning" },
    preparing: { label: "Đang chế biến", color: "primary" },
    ready: { label: "Sẵn sàng", color: "success" },
    completed: { label: "Hoàn thành", color: "secondary" },
  };
  return statusMap[status] || { label: "Không xác định", color: "secondary" };
}

function getTimeAgo(orderTime) {
  const now = new Date();
  const diffInMinutes = Math.floor((now - orderTime) / (1000 * 60));

  if (diffInMinutes < 60) {
    return `${diffInMinutes} phút trước`;
  } else {
    const hours = Math.floor(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;
    return minutes > 0 ? `${hours}h${minutes}p trước` : `${hours}h trước`;
  }
}

async function updateOrderStatus(orderId, newStatus) {
  console.log(`🔄 Updating order ${orderId} status to: ${newStatus}`);

  const order = orders.find((o) => o.id === orderId);
  if (!order) {
    console.error(`❌ Order ${orderId} not found in local orders array`);
    return;
  }

  const oldStatus = order.status;
  order.status = newStatus;

  // Update estimated time based on status
  if (newStatus === "preparing") {
    order.estimatedTime = 20;
  } else if (newStatus === "ready") {
    order.estimatedTime = 5;

    // Update inventory when status changes to "ready"
    try {
      // First, update the order status in Firestore using v9+ syntax
      if (window.db) {
        // Use Firebase v9+ syntax
        const orderRef = window.doc(window.db, "orders", orderId);
        await window.updateDoc(orderRef, {
          status: "ready",
          updatedAt: window.Timestamp.now(),
        });
        console.log("Order status updated to ready");
      }

      // Then update inventory based on order items
      if (window.updateInventoryFromReadyOrder) {
        await window.updateInventoryFromReadyOrder(orderId);
        console.log("Inventory updated successfully for order", orderId);
      } else {
        console.warn("Function updateInventoryFromReadyOrder not available");
      }
    } catch (error) {
      console.error("Failed to update inventory:", error);
    }
  } else if (newStatus === "completed") {
    order.estimatedTime = 0;

    // Update order status in Firestore if available
    if (typeof firebase !== "undefined" && firebase.firestore) {
      try {
        await firebase.firestore().collection("orders").doc(orderId).update({
          status: "completed",
          updatedAt: new Date(),
        });
      } catch (error) {
        console.error("Failed to update order status:", error);
      }
    }
  }

  // Show appropriate toast notification
  const statusMessages = {
    pending: {
      type: "warning",
      title: "Đơn hàng chờ xử lý",
      message: `${orderId} đã được chuyển về trạng thái chờ xử lý`,
    },
    preparing: {
      type: "info",
      title: "Bắt đầu chế biến",
      message: `${orderId} đã bắt đầu được chế biến`,
    },
    ready: {
      type: "success",
      title: "Món đã sẵn sàng",
      message: `${orderId} đã hoàn thành và sẵn sàng phục vụ`,
    },
    completed: {
      type: "success",
      title: "Đã phục vụ",
      message: `${orderId} đã được phục vụ thành công`,
    },
  };

  const statusInfo = statusMessages[newStatus];
  if (statusInfo) {
    showToast(statusInfo.type, statusInfo.title, statusInfo.message);
  }

  updateStats();
  renderAllOrders();
}

// Toast notification system
function showToast(type, title, message) {
  const toastContainer = document.querySelector(".toast-container");
  const toastId = "toast-" + Date.now();

  const toastHtml = `
        <div id="${toastId}" class="toast toast-${type}" role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="true" data-bs-delay="4000">
            <div class="toast-header">
                <div class="d-flex align-items-center">
                    ${getToastIcon(type)}
                    <strong class="toast-title ms-2">${title}</strong>
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        </div>
    `;

  toastContainer.insertAdjacentHTML("beforeend", toastHtml);

  const toastElement = document.getElementById(toastId);
  const toast = new bootstrap.Toast(toastElement);

  // Remove toast from DOM after it's hidden
  toastElement.addEventListener("hidden.bs.toast", () => {
    toastElement.remove();
  });

  toast.show();

  // Re-initialize Lucide icons in toast
  setTimeout(() => {
    lucide.createIcons();
  }, 50);
}

function getToastIcon(type) {
  const icons = {
    success:
      '<i data-lucide="check-circle-2" class="text-success" style="width: 18px; height: 18px;"></i>',
    warning:
      '<i data-lucide="alert-triangle" class="text-warning" style="width: 18px; height: 18px;"></i>',
    info: '<i data-lucide="info" class="text-info" style="width: 18px; height: 18px;"></i>',
    danger:
      '<i data-lucide="x-circle" class="text-danger" style="width: 18px; height: 18px;"></i>',
  };
  return icons[type] || icons.info;
}

// Simulate real-time updates
setInterval(() => {
  // Randomly add new orders or update existing ones
  if (Math.random() < 0.3) {
    const messages = [
      "Đơn hàng mới từ Bàn 8 đã được thêm vào hệ thống",
      "Bếp cần chú ý đơn hàng có yêu cầu đặc biệt",
      "Khách hàng yêu cầu gia tăng tốc độ phục vụ",
      "Có đơn hàng VIP cần ưu tiên xử lý",
    ];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    showToast("info", "Thông báo mới", randomMessage);
  }
}, 30000); // Every 30 seconds
