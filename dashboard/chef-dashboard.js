// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  setDoc,
  deleteDoc,
  Timestamp,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import firebaseConfig from "../config/firebase-config.js";
import {
  updateInventoryFromReadyOrder,
  getAllMenuItems,
  getAllInventoryItems,
  updateInventoryItem,
  getLowStockItems,
} from "./firebase-manager.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Make functions available globally for chef-script.js
window.updateInventoryFromReadyOrder = updateInventoryFromReadyOrder;
window.getAllMenuItems = getAllMenuItems;
window.getAllInventoryItems = getAllInventoryItems;
window.updateInventoryItem = updateInventoryItem;
window.getLowStockItems = getLowStockItems;
window.db = db;
window.doc = doc;
window.collection = collection;
window.getDocs = getDocs;
window.updateDoc = updateDoc;
window.setDoc = setDoc;
window.deleteDoc = deleteDoc;
window.Timestamp = Timestamp;

document.addEventListener("DOMContentLoaded", function () {
  // DOM elements
  const ordersList = document.querySelector(".orders-list");
  const userNameElement = document.getElementById("userName");
  const logoutButton = document.getElementById("logoutButton");

  // Track active orders
  let activeOrders = [];

  // Check authentication state
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in
      loadUserProfile(user.uid);
      loadPendingOrders();
    } else {
      // User is signed out, redirect to login
      window.location.href = "../index.html";
    }
  });

  // Load user profile data
  async function loadUserProfile(uid) {
    try {
      const userRef = doc(db, "users", uid);
      const unsubscribe = onSnapshot(userRef, (doc) => {
        if (doc.exists()) {
          const userData = doc.data();
          if (userData.role !== "chef") {
            // Redirect if not a chef
            alert("Bạn không có quyền truy cập trang đầu bếp");
            window.location.href = "../index.html";
            return;
          }

          // Update UI with user data
          userNameElement.textContent = userData.displayName || "Đầu bếp";

          // Set profile image if available
          if (userData.profileImage) {
            document.getElementById("userProfileImage").src =
              userData.profileImage;
          }
        }
      });
    } catch (error) {
      console.error("Error loading user profile:", error);
    }
  } // Load pending orders from waiter
  function loadPendingOrders() {
    try {
      // Create query for orders that need chef attention
      const ordersRef = collection(db, "orders");
      const q = query(
        ordersRef,
        where("status", "in", ["pending", "cooking", "ready"]), // Match waiter status
        orderBy("createdAt", "desc")
      );

      // Listen for real-time updates
      const unsubscribe = onSnapshot(q, async (snapshot) => {
        activeOrders = [];

        for (const docSnapshot of snapshot.docs) {
          const orderData = docSnapshot.data();

          // Enrich order items with recipe information
          const enrichedItems = await Promise.all(
            orderData.items.map(async (item) => {
              try {
                // Get recipe/menu item details
                const menuRef = doc(db, "menu_items", item.id);
                const menuDoc = await getDoc(menuRef);

                if (menuDoc.exists()) {
                  const menuData = menuDoc.data();
                  return {
                    ...item,
                    recipe: menuData.recipe || null,
                    ingredients: menuData.ingredients || [],
                    cookingTime: menuData.cookingTime || 15,
                    difficulty: menuData.difficulty || "medium",
                    category: menuData.category || "unknown",
                  };
                } else {
                  return item; // Return original if no recipe found
                }
              } catch (error) {
                console.error("Error loading recipe for item:", item.id, error);
                return item;
              }
            })
          );

          activeOrders.push({
            id: docSnapshot.id,
            ...orderData,
            items: enrichedItems,
            createdAt: orderData.createdAt?.toDate() || new Date(),
          });
        }

        // Update stats and render
        updateOrderStats();
        renderOrdersByStatus();
      });
    } catch (error) {
      console.error("Error loading orders:", error);
      showErrorMessage("Không thể tải đơn hàng. Vui lòng thử lại sau.");
    }
  }

  // Update order statistics
  function updateOrderStats() {
    const pendingOrders = activeOrders.filter(
      (order) => order.status === "pending"
    );
    const cookingOrders = activeOrders.filter(
      (order) => order.status === "cooking"
    );
    const readyOrders = activeOrders.filter(
      (order) => order.status === "ready"
    );
    const completedToday = activeOrders.filter((order) => {
      const today = new Date();
      const orderDate = order.createdAt;
      return (
        order.status === "completed" &&
        orderDate.getDate() === today.getDate() &&
        orderDate.getMonth() === today.getMonth() &&
        orderDate.getFullYear() === today.getFullYear()
      );
    });

    // Update stats cards
    document.getElementById("pendingCount").textContent = pendingOrders.length;
    document.getElementById("preparingCount").textContent =
      cookingOrders.length;
    document.getElementById("readyCount").textContent = readyOrders.length;
    document.getElementById("completedCount").textContent =
      completedToday.length;

    // Update tab counts
    document.getElementById("pendingTabCount").textContent =
      pendingOrders.length;
    document.getElementById("preparingTabCount").textContent =
      cookingOrders.length;
    document.getElementById("readyTabCount").textContent = readyOrders.length;
    document.getElementById("completedTabCount").textContent =
      completedToday.length;
  }

  // Render orders by status in different tabs
  function renderOrdersByStatus() {
    const pendingContainer = document.getElementById("pendingOrders");
    const preparingContainer = document.getElementById("preparingOrders");
    const readyContainer = document.getElementById("readyOrders");
    const completedContainer = document.getElementById("completedOrders");

    // Group orders by status
    const pendingOrders = activeOrders.filter(
      (order) => order.status === "pending"
    );
    const cookingOrders = activeOrders.filter(
      (order) => order.status === "cooking"
    );
    const readyOrders = activeOrders.filter(
      (order) => order.status === "ready"
    );
    const completedOrders = activeOrders.filter(
      (order) => order.status === "completed"
    );

    // Render each group
    pendingContainer.innerHTML = renderOrdersGroup(pendingOrders, "pending");
    preparingContainer.innerHTML = renderOrdersGroup(cookingOrders, "cooking");
    readyContainer.innerHTML = renderOrdersGroup(readyOrders, "ready");
    completedContainer.innerHTML = renderOrdersGroup(
      completedOrders,
      "completed"
    );

    // Add event listeners
    addEventListeners();
  }

  // Render a group of orders
  function renderOrdersGroup(orders, status) {
    if (orders.length === 0) {
      return `
        <div class="col-12 text-center p-5">
          <div class="text-muted">
            <i data-lucide="clipboard" class="mb-3" style="width: 48px; height: 48px; opacity: 0.5;"></i>
            <h5>Không có đơn hàng ${getStatusText(status).toLowerCase()}</h5>
            <p class="small">Các đơn hàng sẽ hiện thị ở đây</p>
          </div>
        </div>
      `;
    }

    return orders
      .map(
        (order) => `
      <div class="col-lg-6 col-xl-4">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-header bg-white border-bottom-0 d-flex justify-content-between align-items-center">
            <div>              <h6 class="mb-0 fw-bold">Đơn hàng #${order.id.toUpperCase()}</h6>
              <small class="text-muted">${
                order.tableName || order.tableNumber
              }</small>
            </div>
            <span class="badge ${getStatusBadgeClass(
              order.status
            )}">${getStatusText(order.status)}</span>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <small class="text-muted">
                <i data-lucide="clock" style="width: 14px; height: 14px;"></i>
                ${formatDateTime(order.createdAt)}
              </small>
            </div>
            
            <div class="order-items">
              ${order.items
                .map(
                  (item) => `
                <div class="d-flex justify-content-between align-items-start mb-3 p-2 bg-light rounded">
                  <div class="flex-grow-1">
                    <div class="d-flex align-items-center mb-1">
                      <span class="badge bg-primary rounded-pill me-2">${
                        item.quantity
                      }x</span>
                      <span class="fw-medium">${item.name}</span>
                    </div>
                      ${
                        item.note
                          ? `<small class="text-muted d-block mb-2">Ghi chú: ${item.note}</small>`
                          : ""
                      }
                    
                    ${
                      item.ingredients && item.ingredients.length > 0
                        ? `
                      <div class="ingredients mb-2">
                        <small class="text-muted d-block mb-1">Nguyên liệu:</small>
                        <div class="d-flex flex-wrap gap-1">                          ${item.ingredients
                          .map((ingredient) => {
                            // Handle both string and object formats
                            const ingredientName =
                              typeof ingredient === "string"
                                ? ingredient
                                : ingredient.name || ingredient;
                            const ingredientAmount =
                              typeof ingredient === "object" &&
                              ingredient.amount
                                ? ` (${ingredient.amount}${
                                    ingredient.unit || ""
                                  })`
                                : "";
                            return `
                            <span class="badge bg-secondary bg-opacity-25 text-dark">${ingredientName}${ingredientAmount}</span>
                          `;
                          })
                          .join("")}
                        </div>
                      </div>
                    `
                        : ""
                    }
                    
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        ${
                          item.cookingTime
                            ? `
                          <small class="text-muted">
                            <i data-lucide="timer" style="width: 12px; height: 12px;"></i>
                            ${item.cookingTime} phút
                          </small>
                        `
                            : ""
                        }
                      </div>
                      
                      ${
                        item.recipe && item.recipe.steps
                          ? `
                        <button class="btn btn-sm btn-outline-info recipe-btn" 
                                data-item='${JSON.stringify(item).replace(
                                  /'/g,
                                  "&apos;"
                                )}'>
                          <i data-lucide="book-open" style="width: 12px; height: 12px;"></i>
                          Công thức
                        </button>
                      `
                          : ""
                      }
                    </div>
                  </div>
                  
                  <div class="ms-2">
                    ${renderItemActions(order.id, item, order.status)}
                  </div>
                </div>
              `
                )
                .join("")}
            </div>
          </div>
          
          <div class="card-footer bg-white border-top-0">
            ${renderOrderActions(order)}
          </div>
        </div>
      </div>
    `
      )
      .join("");
  }

  // Render item-specific actions
  function renderItemActions(orderId, item, orderStatus) {
    if (orderStatus === "pending") {
      return `<span class="badge bg-warning text-dark">Chờ xử lý</span>`;
    } else if (orderStatus === "cooking") {
      if (item.itemStatus === "cooking") {
        return `
          <button class="btn btn-sm btn-success item-action-btn" 
                  data-order-id="${orderId}" 
                  data-item-id="${item.id}" 
                  data-action="completeItem">
            <i data-lucide="check" style="width: 14px; height: 14px;"></i>
            Hoàn thành
          </button>
        `;
      } else if (item.itemStatus === "completed") {
        return `<span class="badge bg-success">Hoàn thành</span>`;
      } else {
        return `
          <button class="btn btn-sm btn-primary item-action-btn" 
                  data-order-id="${orderId}" 
                  data-item-id="${item.id}" 
                  data-action="startItem">
            <i data-lucide="play" style="width: 14px; height: 14px;"></i>
            Bắt đầu
          </button>
        `;
      }
    } else {
      return `<span class="badge bg-success">Hoàn thành</span>`;
    }
  }
  // Render order actions
  function renderOrderActions(order) {
    if (order.status === "pending") {
      return `
        <button class="btn btn-primary w-100 order-action-btn" 
                data-order-id="${order.id}" 
                data-action="startOrder">
          <i data-lucide="play" class="me-2" style="width: 16px; height: 16px;"></i>
          Bắt đầu chế biến
        </button>
      `;
    } else if (order.status === "cooking") {
      const allItemsCompleted = order.items.every(
        (item) => item.itemStatus === "completed" || item.itemStatus === "ready"
      );

      return `
        <button class="btn btn-success w-100 order-action-btn" 
                data-order-id="${order.id}" 
                data-action="completeOrder"
                ${allItemsCompleted ? "" : "disabled"}>
          <i data-lucide="check-circle" class="me-2" style="width: 16px; height: 16px;"></i>
          ${
            allItemsCompleted
              ? "Hoàn thành đơn hàng"
              : "Chờ hoàn thành tất cả món"
          }
        </button>
      `;
    } else if (order.status === "ready") {
      return `
        <div class="text-center">
          <span class="text-success fw-medium">
            <i data-lucide="check-circle" class="me-1" style="width: 16px; height: 16px;"></i>
            Sẵn sàng phục vụ
          </span>
        </div>
      `;
    }

    return "";
  }
  // Add event listeners to action buttons
  function addEventListeners() {
    // Event listeners for order actions
    document.querySelectorAll(".order-action-btn").forEach((button) => {
      button.addEventListener("click", handleOrderAction);
    });

    // Event listeners for item actions
    document.querySelectorAll(".item-action-btn").forEach((button) => {
      button.addEventListener("click", handleItemAction);
    });

    // Event listeners for recipe buttons
    document.querySelectorAll(".recipe-btn").forEach((button) => {
      button.addEventListener("click", handleRecipeView);
    });

    // Initialize Lucide icons
    if (typeof lucide !== "undefined") {
      lucide.createIcons();
    }
  }

  // Handle viewing recipe details
  function handleRecipeView(e) {
    try {
      const itemData = JSON.parse(
        e.target.closest(".recipe-btn").getAttribute("data-item")
      );
      showRecipeModal(itemData);
    } catch (error) {
      console.error("Error parsing item data:", error);
      showErrorMessage("Không thể hiển thị công thức");
    }
  }

  // Show recipe in modal
  function showRecipeModal(item) {
    const modal = new bootstrap.Modal(document.getElementById("recipeModal"));
    const modalTitle = document.getElementById("recipeModalLabel");
    const recipeContent = document.getElementById("recipeContent");

    modalTitle.textContent = `Công thức: ${item.name}`;

    let recipeHTML = `
      <div class="row">
        <div class="col-md-6">
          <h6 class="fw-bold mb-3">
            <i data-lucide="shopping-cart" class="me-2" style="width: 16px; height: 16px;"></i>
            Nguyên liệu
          </h6>
          <ul class="list-group list-group-flush mb-4">            ${
            item.ingredients
              ? item.ingredients
                  .map((ingredient) => {
                    // Handle both string and object formats
                    const ingredientName =
                      typeof ingredient === "string"
                        ? ingredient
                        : ingredient.name || ingredient;
                    const ingredientAmount =
                      typeof ingredient === "object" && ingredient.amount
                        ? ` - ${ingredient.amount} ${ingredient.unit || ""}`
                        : "";
                    return `
              <li class="list-group-item px-0 py-2 border-0 border-bottom">
                <i data-lucide="check" class="text-success me-2" style="width: 14px; height: 14px;"></i>
                ${ingredientName}${ingredientAmount}
              </li>
            `;
                  })
                  .join("")
              : '<li class="list-group-item px-0">Chưa có thông tin nguyên liệu</li>'
          }
          </ul>
        </div>
        
        <div class="col-md-6">
          <h6 class="fw-bold mb-3">
            <i data-lucide="info" class="me-2" style="width: 16px; height: 16px;"></i>
            Thông tin
          </h6>
          <div class="card bg-light border-0 mb-4">
            <div class="card-body p-3">
              <div class="row g-2 text-center">
                <div class="col-4">
                  <div class="p-2">
                    <i data-lucide="clock" class="text-primary mb-1" style="width: 20px; height: 20px;"></i>
                    <div class="small text-muted">Thời gian</div>
                    <div class="fw-bold">${item.cookingTime || "N/A"} phút</div>
                  </div>
                </div>
                <div class="col-4">
                  <div class="p-2">
                    <i data-lucide="users" class="text-success mb-1" style="width: 20px; height: 20px;"></i>
                    <div class="small text-muted">Khẩu phần</div>
                    <div class="fw-bold">${item.recipe?.servings || 1}</div>
                  </div>
                </div>
                <div class="col-4">
                  <div class="p-2">
                    <i data-lucide="trending-up" class="text-warning mb-1" style="width: 20px; height: 20px;"></i>
                    <div class="small text-muted">Độ khó</div>
                    <div class="fw-bold">${getDifficultyText(
                      item.difficulty
                    )}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    if (item.recipe && item.recipe.steps) {
      recipeHTML += `
        <div class="mt-4">
          <h6 class="fw-bold mb-3">
            <i data-lucide="list" class="me-2" style="width: 16px; height: 16px;"></i>
            Các bước thực hiện
          </h6>
          <div class="steps">
            ${item.recipe.steps
              .map(
                (step, index) => `
              <div class="d-flex mb-3">
                <div class="flex-shrink-0">
                  <span class="badge bg-primary rounded-circle" style="width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;">
                    ${index + 1}
                  </span>
                </div>
                <div class="flex-grow-1 ms-3">
                  <p class="mb-0">${step}</p>
                </div>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      `;
    }

    recipeContent.innerHTML = recipeHTML;

    // Initialize icons in modal
    if (typeof lucide !== "undefined") {
      lucide.createIcons();
    }

    modal.show();
  }

  // Get difficulty text in Vietnamese
  function getDifficultyText(difficulty) {
    switch (difficulty) {
      case "easy":
        return "Dễ";
      case "medium":
        return "Trung bình";
      case "hard":
        return "Khó";
      default:
        return "Chưa xác định";
    }
  } // Handle order-level actions
  async function handleOrderAction(e) {
    try {
      const orderId = e.target
        .closest(".order-action-btn")
        .getAttribute("data-order-id");
      const action = e.target
        .closest(".order-action-btn")
        .getAttribute("data-action");
      const orderRef = doc(db, "orders", orderId);

      if (action === "startOrder") {
        // Start cooking the order
        await updateDoc(orderRef, {
          status: "cooking",
          updatedAt: Timestamp.now(),
          cookingStartTime: Timestamp.now(),
        });

        showSuccessMessage("Đã bắt đầu chế biến đơn hàng");
      } else if (action === "completeOrder") {
        // Show loading indicator
        showInventoryStatus("loading");

        // Mark order as ready for serving
        await updateDoc(orderRef, {
          status: "ready",
          updatedAt: Timestamp.now(),
          cookingCompletedTime: Timestamp.now(),
        });

        // Update inventory automatically when order is ready
        console.log(`🔄 Updating inventory for completed order: ${orderId}`);
        try {
          const inventoryUpdateResult = await updateInventoryFromReadyOrder(
            orderId
          );
          if (inventoryUpdateResult) {
            console.log(
              `✅ Inventory updated successfully for order: ${orderId}`
            );

            // Get order details for better notification
            const orderDoc = await getDoc(orderRef);
            if (orderDoc.exists()) {
              const orderData = orderDoc.data();
              const itemNames = orderData.items
                .map((item) => `${item.quantity}x ${item.name}`)
                .join(", ");
              showSuccessMessage(
                `Đơn hàng hoàn thành! Đã cập nhật kho cho: ${itemNames}`
              );
              showInventoryStatus(
                "success",
                `Đã cập nhật kho cho: ${itemNames}`
              );
            } else {
              showSuccessMessage(
                "Đơn hàng đã sẵn sàng phục vụ và cập nhật kho thành công!"
              );
              showInventoryStatus("success");
            }

            // Check for low stock items after update
            setTimeout(async () => {
              try {
                const lowStockItems = await getLowStockItems();
                if (lowStockItems && lowStockItems.length > 0) {
                  const lowStockNames = lowStockItems
                    .map(
                      (item) =>
                        `${item.name} (còn ${item.currentStock}${item.unit})`
                    )
                    .join(", ");

                  showInventoryStatus(
                    "warning",
                    `Nguyên liệu sắp hết: ${lowStockNames}`
                  );

                  if (typeof showWarningToast === "function") {
                    showWarningToast(`Cảnh báo kho: ${lowStockNames}`, 8000);
                  }
                }
              } catch (error) {
                console.error("Error checking low stock:", error);
              }
            }, 1000);
          } else {
            console.warn(`⚠️ Failed to update inventory for order: ${orderId}`);
            showSuccessMessage(
              "Đơn hàng đã sẵn sàng phục vụ (lưu ý: không thể cập nhật kho)"
            );
            hideInventoryStatus();
          }
        } catch (inventoryError) {
          console.error("Error updating inventory:", inventoryError);
          showSuccessMessage(
            "Đơn hàng đã sẵn sàng phục vụ (lưu ý: lỗi cập nhật kho)"
          );
          hideInventoryStatus();
        }
      }
    } catch (error) {
      console.error("Error updating order:", error);
      showErrorMessage("Không thể cập nhật đơn hàng. Vui lòng thử lại.");
      hideInventoryStatus();
    }
  }
  // Handle item-level actions
  async function handleItemAction(e) {
    try {
      const button = e.target.closest(".item-action-btn");
      const orderId = button.getAttribute("data-order-id");
      const itemId = button.getAttribute("data-item-id");
      const action = button.getAttribute("data-action");

      const order = activeOrders.find((o) => o.id === orderId);
      if (!order) return;

      const orderRef = doc(db, "orders", orderId);
      const updatedItems = order.items.map((item) => {
        if (item.id === itemId) {
          if (action === "startItem") {
            return { ...item, itemStatus: "cooking" };
          } else if (action === "completeItem") {
            return { ...item, itemStatus: "completed" };
          }
        }
        return item;
      });

      await updateDoc(orderRef, {
        items: updatedItems,
        updatedAt: Timestamp.now(),
      });

      if (action === "startItem") {
        showSuccessMessage("Đã bắt đầu chế biến món ăn");
      } else if (action === "completeItem") {
        // Update inventory for this specific completed item
        try {
          const completedItem = order.items.find((item) => item.id === itemId);
          if (completedItem) {
            console.log(
              `🔄 Updating inventory for completed item: ${completedItem.name}`
            );
            await updateInventoryForSingleItem(completedItem);
            showSuccessMessage(
              `Món ăn "${completedItem.name}" đã hoàn thành và cập nhật kho!`
            );
          } else {
            showSuccessMessage("Món ăn đã hoàn thành");
          }
        } catch (inventoryError) {
          console.error("Error updating inventory for item:", inventoryError);
          showSuccessMessage("Món ăn đã hoàn thành (lưu ý: lỗi cập nhật kho)");
        }
      }
    } catch (error) {
      console.error("Error updating item:", error);
      showErrorMessage("Không thể cập nhật món ăn. Vui lòng thử lại.");
    }
  }

  // Handle logout
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      signOut(auth)
        .then(() => {
          window.location.href = "../index.html";
        })
        .catch((error) => {
          console.error("Error signing out:", error);
        });
    });
  }
  // Utility functions
  function formatDateTime(date) {
    if (!date) return "N/A";
    return date.toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
    });
  }

  function getStatusText(status) {
    switch (status) {
      case "pending":
        return "Chờ xử lý";
      case "cooking":
        return "Đang chế biến";
      case "ready":
        return "Sẵn sàng phục vụ";
      case "completed":
        return "Đã hoàn thành";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  }

  function getStatusBadgeClass(status) {
    switch (status) {
      case "pending":
        return "bg-warning text-dark";
      case "cooking":
        return "bg-primary";
      case "ready":
        return "bg-success";
      case "completed":
        return "bg-info";
      case "cancelled":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  }

  function showSuccessMessage(message) {
    showToast(message, "success");
  }

  function showErrorMessage(message) {
    showToast(message, "error");
  }

  function showToast(message, type = "info") {
    const toastContainer = document.querySelector(".toast-container");
    if (!toastContainer) return;

    const toastId = `toast-${Date.now()}`;
    const bgClass =
      type === "success"
        ? "bg-success"
        : type === "error"
        ? "bg-danger"
        : "bg-info";

    const toastHTML = `
      <div id="${toastId}" class="toast align-items-center text-white ${bgClass} border-0" role="alert">
        <div class="d-flex">
          <div class="toast-body">
            ${message}
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
      </div>
    `;

    toastContainer.insertAdjacentHTML("beforeend", toastHTML);

    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement, { delay: 3000 });
    toast.show();

    // Remove toast element after hiding
    toastElement.addEventListener("hidden.bs.toast", () => {
      toastElement.remove();
    });
  }

  // Function to check and alert low stock after inventory update
  async function checkLowStockAfterUpdate() {
    try {
      console.log("🔍 Checking for low stock items...");

      if (window.getLowStockItems) {
        const lowStockItems = await window.getLowStockItems();

        if (lowStockItems && lowStockItems.length > 0) {
          const lowStockNames = lowStockItems
            .map(
              (item) => `${item.name} (còn ${item.currentStock}${item.unit})`
            )
            .join(", ");

          console.warn(`⚠️ Low stock alert: ${lowStockNames}`);

          // Show warning toast for low stock
          if (typeof showWarningToast === "function") {
            showWarningToast(
              `Cảnh báo: Một số nguyên liệu sắp hết - ${lowStockNames}`,
              8000
            );
          } else {
            showErrorMessage(`Cảnh báo kho: ${lowStockNames}`);
          }
        }
      }
    } catch (error) {
      console.error("Error checking low stock:", error);
    }
  }

  // Function to show inventory status indicators
  function showInventoryStatus(status, message = "") {
    const indicator = document.getElementById("inventoryStatusIndicator");
    const spinner = document.getElementById("inventorySpinner");
    const successIcon = document.getElementById("inventorySuccessIcon");
    const warningIcon = document.getElementById("inventoryWarningIcon");

    // Hide all indicators first
    spinner.style.display = "none";
    successIcon.style.display = "none";
    warningIcon.style.display = "none";

    // Show the main indicator
    indicator.style.display = "block";

    switch (status) {
      case "loading":
        spinner.style.display = "block";
        break;
      case "success":
        successIcon.style.display = "block";
        successIcon.title = message || "Kho đã được cập nhật thành công";
        // Auto hide after 5 seconds
        setTimeout(() => {
          indicator.style.display = "none";
        }, 5000);
        break;
      case "warning":
        warningIcon.style.display = "block";
        warningIcon.title = message || "Có cảnh báo về tình trạng kho";
        // Auto hide after 10 seconds
        setTimeout(() => {
          indicator.style.display = "none";
        }, 10000);
        break;
      default:
        indicator.style.display = "none";
        break;
    }
  }

  // Function to hide inventory status
  function hideInventoryStatus() {
    const indicator = document.getElementById("inventoryStatusIndicator");
    indicator.style.display = "none";
  }

  // Utility function to round numbers to 3 decimal places
  function roundTo3Decimals(number) {
    return Math.round(number * 1000) / 1000;
  }

  // Utility function to format numbers for display (remove unnecessary trailing zeros)
  function formatNumberForDisplay(number) {
    const rounded = roundTo3Decimals(number);
    return rounded % 1 === 0
      ? rounded.toString()
      : rounded.toFixed(3).replace(/\.?0+$/, "");
  }

  // ...existing code...
});

// Test function to debug inventory update
async function testInventoryUpdate() {
  console.log("🧪 Testing inventory update...");

  // Create a test order
  const testOrder = {
    id: "TEST_ORDER_" + Date.now(),
    items: [
      { name: "Phở bò tái", quantity: 1 },
      { name: "Cơm gà xối mỡ", quantity: 1 },
    ],
    status: "ready",
  };

  console.log("📝 Test order:", testOrder);

  try {
    // Test the inventory update function
    if (window.updateInventoryFromReadyOrder) {
      // First, we need to add this test order to Firestore
      if (window.db) {
        const orderRef = window.doc(window.db, "orders", testOrder.id);
        await window.setDoc(orderRef, {
          ...testOrder,
          createdAt: window.Timestamp.now(),
          updatedAt: window.Timestamp.now(),
        });

        console.log("✅ Test order added to Firestore");

        // Now test the inventory update
        const result = await window.updateInventoryFromReadyOrder(testOrder.id);

        if (result) {
          alert("✅ Test successful! Check console for details.");
        } else {
          alert("❌ Test failed! Check console for errors.");
        }

        // Clean up test order
        await window.deleteDoc(orderRef);
        console.log("🗑️ Test order cleaned up");
      } else {
        alert("❌ Firebase not available");
      }
    } else {
      alert("❌ updateInventoryFromReadyOrder function not available");
    }
  } catch (error) {
    console.error("❌ Test error:", error);
    alert("❌ Test error: " + error.message);
  }
}

// Function to update inventory for a single completed item
async function updateInventoryForSingleItem(completedItem) {
  try {
    console.log(`🔄 Starting inventory update for item: ${completedItem.name}`);

    // Get all menu items to find ingredients
    const menuItems = await window.getAllMenuItems();
    const menuItem = menuItems.find((item) => item.name === completedItem.name);

    if (
      !menuItem ||
      !menuItem.ingredients ||
      menuItem.ingredients.length === 0
    ) {
      console.warn(
        `⚠️ Menu item "${completedItem.name}" has no ingredients defined`
      );
      return false;
    }

    console.log(`📦 Menu item ingredients:`, menuItem.ingredients);

    // Get all inventory items
    const inventoryItems = await window.getAllInventoryItems();
    const inventoryMap = {};
    inventoryItems.forEach((item) => {
      inventoryMap[item.name] = item;
    });

    console.log(`📊 Available inventory items:`, Object.keys(inventoryMap));

    // Calculate ingredient usage and update inventory
    const inventoryUpdates = [];

    for (const ingredient of menuItem.ingredients) {
      // Handle different ingredient formats
      let ingredientName, ingredientAmount, ingredientId;

      if (typeof ingredient === "string") {
        // Old format: just ingredient name
        ingredientName = ingredient;
        ingredientAmount = 1; // default amount
        ingredientId = null;
      } else {
        // New format: object with id, name, amount, unit, baseAmount, baseUnit
        ingredientName = ingredient.name;
        ingredientId = ingredient.id;

        // Use baseAmount if available (calculated from unit conversion)
        // Otherwise, convert amount based on unit
        if (ingredient.baseAmount) {
          ingredientAmount = ingredient.baseAmount;
        } else {
          // Fallback conversion logic
          const amount = ingredient.amount || 1;
          const unit = ingredient.unit || "gram";

          // Convert to base inventory unit (usually kg)
          if (unit === "gram" || unit === "g") {
            ingredientAmount = amount / 1000; // Convert gram to kg
          } else if (unit === "lạng") {
            ingredientAmount = amount / 10; // Convert lạng to kg
          } else if (unit === "kg") {
            ingredientAmount = amount;
          } else if (unit === "ml") {
            ingredientAmount = amount / 1000; // Convert ml to liters
          } else if (unit === "lít" || unit === "l") {
            ingredientAmount = amount;
          } else {
            // For units like 'cái', 'hộp', 'quả' - use as is
            ingredientAmount = amount;
          }
        }
      }

      // Find inventory item by ID first, then by name
      let inventoryItem = null;
      if (ingredientId) {
        inventoryItem = inventoryItems.find((item) => item.id === ingredientId);
      }
      if (!inventoryItem) {
        inventoryItem = inventoryMap[ingredientName];
      }
      if (inventoryItem) {
        // Calculate total amount to reduce from inventory
        const totalAmountToReduce = ingredientAmount * completedItem.quantity;

        // Update the inventory item with rounded values (3 decimal places)
        const newCurrentStock = Math.max(
          0,
          inventoryItem.currentStock - totalAmountToReduce
        );
        const newUsedToday =
          (inventoryItem.usedToday || 0) + totalAmountToReduce;

        const updatedInventory = {
          ...inventoryItem,
          currentStock: roundTo3Decimals(newCurrentStock),
          usedToday: roundTo3Decimals(newUsedToday),
        };

        inventoryUpdates.push({
          itemId: inventoryItem.id,
          data: updatedInventory,
        });

        console.log(
          `✅ Updated ${ingredientName}: -${formatNumberForDisplay(
            totalAmountToReduce
          )}${inventoryItem.unit}, stock: ${formatNumberForDisplay(
            updatedInventory.currentStock
          )}${inventoryItem.unit}, used today: ${formatNumberForDisplay(
            updatedInventory.usedToday
          )}${inventoryItem.unit}`
        );
      } else {
        console.warn(
          `⚠️ Inventory item not found: ${ingredientName} (ID: ${ingredientId})`
        );
      }
    }

    // Perform all inventory updates
    if (inventoryUpdates.length > 0) {
      console.log(`💾 Updating ${inventoryUpdates.length} inventory items...`);
      const updatePromises = inventoryUpdates.map((update) =>
        window.updateInventoryItem(update.itemId, update.data)
      );

      await Promise.all(updatePromises);
      console.log(
        `✅ Successfully updated inventory for item: ${completedItem.name}`
      );
      return true;
    } else {
      console.log(
        `ℹ️ No inventory updates needed for item: ${completedItem.name}`
      );
      return false;
    }
  } catch (error) {
    console.error(
      `❌ Error updating inventory for item "${completedItem.name}":`,
      error
    );
    throw error;
  }
}

// Enhanced function to handle order completion with detailed inventory logging
async function completeOrderWithInventoryUpdate(orderId) {
  try {
    console.log(`🔄 Completing order with inventory update: ${orderId}`);

    // First mark the order as ready
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, {
      status: "ready",
      updatedAt: Timestamp.now(),
      cookingCompletedTime: Timestamp.now(),
    });

    // Then update inventory with detailed logging
    const inventoryUpdateResult = await updateInventoryFromReadyOrder(orderId);

    if (inventoryUpdateResult) {
      // Get order details for logging
      const orderDoc = await getDoc(orderRef);
      if (orderDoc.exists()) {
        const orderData = orderDoc.data();
        const itemNames = orderData.items
          .map((item) => `${item.quantity}x ${item.name}`)
          .join(", ");

        console.log(`✅ Order completed successfully: ${itemNames}`);
        showSuccessMessage(
          `Đơn hàng hoàn thành! Đã cập nhật kho cho: ${itemNames}`
        );

        // Optional: Show detailed inventory changes in console
        console.log(
          `📊 Kho đã được cập nhật tự động cho đơn hàng #${orderId.toUpperCase()}`
        );
      } else {
        showSuccessMessage(
          "Đơn hàng đã sẵn sàng phục vụ và cập nhật kho thành công!"
        );
      }
    } else {
      console.warn(`⚠️ Failed to update inventory for order: ${orderId}`);
      showSuccessMessage(
        "Đơn hàng đã sẵn sàng phục vụ (lưu ý: không thể cập nhật kho tự động)"
      );
    }

    return true;
  } catch (error) {
    console.error("Error completing order with inventory update:", error);
    showErrorMessage("Không thể hoàn thành đơn hàng. Vui lòng thử lại.");
    return false;
  }
}

// Make functions available globally
window.testInventoryUpdate = testInventoryUpdate;
window.updateInventoryForSingleItem = updateInventoryForSingleItem;
