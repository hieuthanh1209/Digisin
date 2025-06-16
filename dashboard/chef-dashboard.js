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
  updateDoc,
  Timestamp,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import firebaseConfig from "../config/firebase-config.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

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
  }

  // Handle order-level actions
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
        // Mark order as ready for serving
        await updateDoc(orderRef, {
          status: "ready",
          updatedAt: Timestamp.now(),
          cookingCompletedTime: Timestamp.now(),
        });

        showSuccessMessage("Đơn hàng đã sẵn sàng phục vụ");
      }
    } catch (error) {
      console.error("Error updating order:", error);
      showErrorMessage("Không thể cập nhật đơn hàng. Vui lòng thử lại.");
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
        showSuccessMessage("Món ăn đã hoàn thành");
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
});
